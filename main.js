#!/usr/bin/env node

const {exec} = require('child_process');
const {promises} = require('fs');
const {join} = require('path');

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

(async () => {
    const packages = await getPackages();
    const packageNames = packages.map(p => p.name);
    for (let lernaPackage of packages) {
        const packagePaths = getPackageFilePaths(lernaPackage.location);

        console.log(`Running ${lernaPackage.name}`)

        await promises.rename(packagePaths.originalPath, packagePaths.backupPath);
        try {
            const packageJson = require(packagePaths.backupPath);

            function filterDeps (deps) {
                return Object.entries(deps || {}).filter(([name]) => {
                    return !packageNames.some(n => n === name)
                }).reduce((deps, [name, version]) => ({...deps, [name]: version}), {})
            }

            const newPackageJson = ({
                ...packageJson,
                dependencies: filterDeps(packageJson.dependencies),
                devDependencies: filterDeps(packageJson.devDependencies)
            });

            await promises.writeFile(packagePaths.originalPath, JSON.stringify(newPackageJson, null, 2))

            try {
                console.log(`Run audit in ${lernaPackage.location}`)
                const audit = await cmd('npm audit', lernaPackage.location);
                console.log('Audit result');
                console.log(audit);
            } catch (e) {
                console.log('Audit errors');
                console.error(e)
                console.log('We will fix this for you');
                const auditFix = await cmd('npm audit fix', lernaPackage.location);
                console.log(auditFix);
            }


        } catch(e) {
            console.error(e);
        } finally {
            await promises.rename(packagePaths.backupPath, packagePaths.originalPath);
        }
    }
})();
