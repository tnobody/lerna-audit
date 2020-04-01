#!/usr/bin/env node

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

async function getPackages() {
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

function filterInternalDeps (deps, packageNames) {
    return packageFilter(deps, (name) => packageInJson(packageNames, name));
}

function filterDeps (deps, packageNames) {
    return packageFilter(deps, (name) => !packageInJson(packageNames, name))
}

function packageFilter(deps, filter){
    return Object.entries(deps || {}).filter(([name]) => {
        return filter(name)
    }).reduce((deps, [name, version]) => ({...deps, [name]: version}), {})
}

(async () => {
    const packages = await getPackages();
    const packageNames = packages.map(p => p.name);
    for (let lernaPackage of packages) {
        const packagePaths = getPackageFilePaths(lernaPackage.location);

        console.log(`Running ${lernaPackage.name}`);

        const packageJson = require(packagePaths.originalPath);
        await promises.rename(packagePaths.originalPath, packagePaths.backupPath);

        const internalDependencies = filterInternalDeps(packageJson.dependencies, packageNames);
        const internalDevDependencies = filterInternalDeps(packageJson.devDependencies, packageNames);
        try {

            const newPackageJson = ({
                ...packageJson,
                dependencies: filterDeps(packageJson.dependencies, packageNames),
                devDependencies: filterDeps(packageJson.devDependencies, packageNames)
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

        } catch(e) {
            console.error(e);
            await promises.rename(packagePaths.backupPath, packagePaths.originalPath);
        } finally {
            const auditedPackageJson = require(packagePaths.originalPath);
            const restoredPackageJson = ({
                ...auditedPackageJson,
                dependencies: {...auditedPackageJson.dependencies, ...internalDependencies},
                devDependencies: {...auditedPackageJson.devDependencies, ...internalDevDependencies},
            });

            await promises.writeFile(packagePaths.originalPath, JSON.stringify(restoredPackageJson, null, 2));
            await promises.unlink(packagePaths.backupPath);
        }
    }
})();
