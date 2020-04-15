async function restoreOriginalPackageJson(packagePaths){
    await promises.rename(packagePaths.backupPath, packagePaths.originalPath);
}

module.exports = {
    restoreOriginalPackageJson
};