function restorePackageJson (packagePaths, internalLernaDependencies) {
    let auditedPackageJson = require(packagePaths.originalPath);

    const mergedDependencies = {
        ...auditedPackageJson.dependencies,
        ...internalLernaDependencies.dependencies
    };

    const mergedDevDependencies = {
        ...auditedPackageJson.devDependencies,
        ...internalLernaDependencies.devDependencies
    };

    if(!isEmpty(mergedDependencies)){
        auditedPackageJson=  {
            ...auditedPackageJson,
            dependencies: mergedDependencies
        }
    }

    if(!isEmpty(mergedDevDependencies)){
        auditedPackageJson=  {
            ...auditedPackageJson,
            devDependencies: mergedDevDependencies
        }
    }

    return auditedPackageJson;
}

function isEmpty(object){
    return Object.keys(object).length === 0 && object.constructor === Object;
}

module.exports = {
    restorePackageJson
};