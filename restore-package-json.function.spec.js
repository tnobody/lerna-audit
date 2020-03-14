const {restorePackageJson} =  require("./restore-package-json.function");

describe("restorePackageJson", () => {
    it("should not add empty dependencies to package.json", () => {

        //GIVEN
        const packagePaths = {
            originalPath: "foo/package.json"
        };
        jest.mock("foo/package.json", () => ({
            dependencies: {},
            devDependencies: {}
        }), { virtual: true });

        const internalLernaDependencies = {
            dependencies: {
                "foobar.js": "42.0.0"
            },
            devDependencies: {}
        };

        const expectedRestoredPackageJson = {
            dependencies: {
                "foobar.js": "42.0.0"
            }
        };

        //WHEN
        const restoredPackageJson = restorePackageJson(packagePaths, internalLernaDependencies);

        //THEN
        expect(restoredPackageJson).toEqual(expectedRestoredPackageJson);
    })
});