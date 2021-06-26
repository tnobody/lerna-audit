const updateRootPackageJson = require("./lib/update-root-package-json");

async function savePackageJSON(path, packageInfo) {
  await updateRootPackageJson({
    path: path,
    package: packageInfo
  });
}

module.exports = {
  savePackageJSON
};
