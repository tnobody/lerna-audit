const {promises} = require('fs');

async function restoreOriginalPackageJson(packagePaths){
    if(packagePaths){
        try{
            await promises.rename(packagePaths.backupPath, packagePaths.originalPath);
            console.log("");//Ensure pretty linebreak in console
        }catch (error) {
            console.warn(`\nAn error occurred when restoring the original package.json: ${error}`);
        }
    }
}

module.exports = {
    restoreOriginalPackageJson
};