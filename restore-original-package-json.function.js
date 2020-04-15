const {promises} = require('fs');

async function restoreOriginalPackageJson(packagePaths){
    try{
        await promises.rename(packagePaths.backupPath, packagePaths.originalPath);
        console.log('\nSuccessfully restored the original package.json!');
    }catch (error) {
        console.warn(`\nAn error occurred when restoring the original package.json: ${error}`);
    }
}

module.exports = {
    restoreOriginalPackageJson
};