export default function restorePackageJson (packagePaths, internalLernaDependencies) {
    const auditedPackageJson = require(packagePaths.originalPath);
    return ({
        ...auditedPackageJson,
        dependencies: {...auditedPackageJson.dependencies, ...internalLernaDependencies.dependencies},
        devDependencies: {...auditedPackageJson.devDependencies, ...internalLernaDependencies.devDependencies},
    });
}