function addDevDependencies (auditedPackageJson, internalLernaDependencies, restoredPackageJson) {
    const mergedDevDependencies = {...auditedPackageJson.devDependencies, ...internalLernaDependencies.devDependencies};
    if (!isEmpty(mergedDevDependencies)) {
        restoredPackageJson = {
            ...restoredPackageJson,
            devDependencies: mergedDevDependencies
        }
    }
    return restoredPackageJson;
}

function addDependencies (auditedPackageJson, internalLernaDependencies, restoredPackageJson) {
    const mergedDependencies = {...auditedPackageJson.dependencies, ...internalLernaDependencies.dependencies};
    if (!isEmpty(mergedDependencies)) {
        restoredPackageJson = {
            ...restoredPackageJson,
            dependencies: mergedDependencies
        }
    }
    return restoredPackageJson;
}

function restorePackageJson (packagePaths, internalLernaDependencies) {
    const auditedPackageJson = require(packagePaths.originalPath);
    let restoredPackageJson = addDependencies(auditedPackageJson, internalLernaDependencies, auditedPackageJson);
    restoredPackageJson = addDevDependencies(auditedPackageJson, internalLernaDependencies, restoredPackageJson);
    return restoredPackageJson;
}

function isEmpty(object){
    return Object.keys(object).length === 0 && object.constructor === Object;
}

module.exports = {
    restorePackageJson
};