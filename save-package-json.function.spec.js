const {savePackageJSON} = require("./save-package-json.function");
const updateRootPackageJson = require("./lib/update-root-package-json");

jest.mock("./lib/update-root-package-json");

describe("savePackageJSON", () => {
  it("calls the vendor method with path and desired package.json content", async () => {
    const path = "/foo/bar/baz";
    const packageInfo = {
      name: "test",
      dependencies: {}
    };

    await savePackageJSON(path, packageInfo);

    expect(updateRootPackageJson).toHaveBeenCalledWith({
      path: path,
      package: packageInfo
    });
  });
});
