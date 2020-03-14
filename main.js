#!/usr/bin/env node

const {restorePackageJson} =  require("./restore-package-json.function");
const {exec} = require('child_process');
const {promises} = require('fs');
const {join} = require('path');

process.on('unhandledRejection', (error) => {
    console.error(error);
    process.exit(1);
});

async function cmd(command, cwd = process.cwd()) {
    return new Promise((res, rej) => {
        exec(command, {cwd}, (err, stdout, stderr) => {
            if (err) {
                rej(stderr || stdout);
            } else {
                res(stdout);
            }
        });

    })
}

async function getLernaPackages() {
    const result = await cmd('npx lerna ls --all --json --loglevel=silent');
    return JSON.parse(result);
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
    const lernaPackages = await getLernaPackages();
    const lernaPackageNames = lernaPackages.map(p => p.name);
    for (let lernaPackage of lernaPackages) {
        const packagePaths = getPackageFilePaths(lernaPackage.location);

        console.log(`Running ${lernaPackage.name}`);

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

            await promises.writeFile(packagePaths.originalPath, JSON.stringify(newPackageJson, null, 2));

            try {
                console.log(`Run audit in ${lernaPackage.location}`);
                const audit = await cmd('npm audit', lernaPackage.location);
                console.log('Audit result');
                console.log(audit);
            } catch (e) {
                console.log('Audit errors');
                console.error(e);
                console.log('We will fix this for you');
                const auditFix = await cmd('npm audit fix', lernaPackage.location);
                console.log(auditFix);
            }

        } catch (e) {
            console.error(e);
            await promises.rename(packagePaths.backupPath, packagePaths.originalPath);
        } finally {
            const restoredPackageJson = restorePackageJson(packagePaths, internalLernaDependencies);

            await promises.writeFile(packagePaths.originalPath, JSON.stringify(restoredPackageJson, null, 2));
            await promises.unlink(packagePaths.backupPath);
        }
    }
}

(async () => {
    await lernaAudit();
})();
