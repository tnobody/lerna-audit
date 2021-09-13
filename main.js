#!/usr/bin/env node

const {restorePackageJson} = require("./lib/restore-package-json.function");
const {restoreOriginalPackageJson} = require("./lib/restore-original-package-json.function");
const {analyzeJson} = require("./lib/analyzeJson");
const {writeJson} = require("./lib/writeJson");
const {spawnSync} = require('child_process');
const {promises} = require('fs');
const {join} = require('path');

const {argv} = require('yargs')
    .boolean("fix")
    .default("fix", true);

let packagePaths;

process.on('unhandledRejection', (error) => {
    console.error(error);
    process.exit(1);
});

async function dieGracefully(){
    await restoreOriginalPackageJson(packagePaths);
    process.exit(1);
}
process.on('SIGINT', async () => dieGracefully());
process.on('SIGTERM', async () => dieGracefully());

function getLernaPackages() {
    const result = spawnSync('npx', ['lerna', 'ls', '--all', '--json', '--loglevel=silent'], { stdio: ['pipe', 'pipe', 'inherit'], shell: true });
    if (result.status === 0) {
        return JSON.parse(result.stdout);						
    }
    
    return [];
}

function getPackageFilePaths(path) {
    return {
        backupPath: join(path, 'original-package.json'),
        originalPath: join(path, 'package.json'),
    }
}

function packageInJson(packageNames, name){
    return packageNames.some(n => n === name)
}

function filterInternalLernaDeps (deps, packageNames) {
    return packageFilter(deps, (name) => packageInJson(packageNames, name));
}

function filterExternalDeps (deps, packageNames) {
    return packageFilter(deps, (name) => !packageInJson(packageNames, name))
}

function packageFilter(originalDepenencies, filter){
    return Object.entries(originalDepenencies || {}).filter(([name]) => {
        return filter(name)
    }).reduce((filteredDependencies, [name, version]) => ({...filteredDependencies, [name]: version}), {})
}

async function lernaAudit() {
    const lernaPackages = getLernaPackages();
    const lernaPackageNames = lernaPackages.map(p => p.name);
    for (let lernaPackage of lernaPackages) {
        packagePaths = getPackageFilePaths(lernaPackage.location);

        console.log(`Running ${lernaPackage.name}`);

        const jsonOpts = analyzeJson(await promises.readFile(packagePaths.originalPath, "utf8"));

        const packageJson = require(packagePaths.originalPath);
        await promises.rename(packagePaths.originalPath, packagePaths.backupPath);

        const internalLernaDependencies = {
            dependencies: filterInternalLernaDeps(packageJson.dependencies, lernaPackageNames),
            devDependencies: filterInternalLernaDeps(packageJson.devDependencies, lernaPackageNames)
        };
        try {
            const newPackageJson = ({
                ...packageJson,
                dependencies: filterExternalDeps(packageJson.dependencies, lernaPackageNames),
                devDependencies: filterExternalDeps(packageJson.devDependencies, lernaPackageNames)
            });

            await writeJson(packagePaths.originalPath, newPackageJson, jsonOpts)

            console.log(`Run audit in ${lernaPackage.location}`);
            const auditResult = spawnSync('npm', ['audit'], { cwd: lernaPackage.location, stdio: 'inherit', shell: true });
            if(auditResult.status !== 0 && argv.fix){
                console.log('We will fix this for you');
                spawnSync('npm', ['audit', 'fix'], { cwd: lernaPackage.location, stdio: 'inherit', shell: true });
            }
            const restoredPackageJson = restorePackageJson(packagePaths, internalLernaDependencies);

            await writeJson(packagePaths.originalPath, restoredPackageJson, jsonOpts)
            await promises.unlink(packagePaths.backupPath);
        } catch (e) {
            console.error(e);
            await restoreOriginalPackageJson(packagePaths);
        }
    }
}

(async () => {
    await lernaAudit();
})();
