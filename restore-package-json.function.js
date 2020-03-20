function addDevDependencies (dependenciesToAdd, restoredPackageJson) {
    if (isEmpty(dependenciesToAdd)) {
        return restoredPackageJson;
    }

    return  {
        ...restoredPackageJson,
        devDependencies: dependenciesToAdd
    }

}

function addDependencies (dependenciesToAdd, originalDependencies) {
    if (isEmpty(dependenciesToAdd)) {
        return originalDependencies;
    }

    return {
        ...originalDependencies,
        dependencies: dependenciesToAdd
    }
}

function restorePackageJson (packagePaths, internalLernaDependencies) {
    const auditedPackageJson = require(packagePaths.originalPath);
    let restoredPackageJson = addDependencies({
            ...auditedPackageJson.dependencies,
            ...internalLernaDependencies.dependencies
        },
        auditedPackageJson
    );

    restoredPackageJson = addDevDependencies({
            ...auditedPackageJson.devDependencies,
            ...internalLernaDependencies.devDependencies
        },
        restoredPackageJson
    );

    return restoredPackageJson;
}

function isEmpty(object){
    return Object.keys(object).length === 0 && object.constructor === Object;
}

module.exports = {
    restorePackageJson
};