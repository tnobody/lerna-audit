function addDependencyIfNotEmpty (auditedPackageJson, internalLernaDependencies, restoredPackageJson) {
    const mergedDevDependencies = {...auditedPackageJson.devDependencies, ...internalLernaDependencies.devDependencies};
    if (!isEmpty(mergedDevDependencies)) {
        restoredPackageJson = {
            ...restoredPackageJson,
            devDependencies: mergedDevDependencies
        }
    }
    return restoredPackageJson;
}

function restorePackageJson (packagePaths, internalLernaDependencies) {
    const auditedPackageJson = require(packagePaths.originalPath);
    let restoredPackageJson = {
            ...auditedPackageJson,
            dependencies: {...auditedPackageJson.dependencies, ...internalLernaDependencies.dependencies},
        };
    restoredPackageJson = addDependencyIfNotEmpty(auditedPackageJson, internalLernaDependencies, restoredPackageJson);
    return restoredPackageJson;
}

function isEmpty(object){
    return Object.keys(object).length === 0 && object.constructor === Object;
}

module.exports = {
    restorePackageJson
};