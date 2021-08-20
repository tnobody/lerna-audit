const {restorePackageJson} = require("./restore-package-json.function");

describe("restorePackageJson", () => {

    beforeEach(() =>{
        jest.resetModules();
    });

    it("should not add empty devDependencies to package.json", () => {

        //GIVEN
        const packagePaths = {
            originalPath: "foo/package.json"
        };
        jest.mock("foo/package.json", () => ({
            dependencies: {}
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
    });

    it("should not add empty Dependencies to package.json", () => {

        //GIVEN
        const packagePaths = {
            originalPath: "foo/package.json"
        };
        jest.mock("foo/package.json", () => ({
            devDependencies: {}
        }), { virtual: true });

        const internalLernaDependencies = {
            dependencies: {},
            devDependencies: {"foobar.js": "21.0.0"}
        };

        const expectedRestoredPackageJson = {
            devDependencies: {
                "foobar.js": "21.0.0"
            }
        };

        //WHEN
        const restoredPackageJson = restorePackageJson(packagePaths, internalLernaDependencies);

        //THEN
        expect(restoredPackageJson).toEqual(expectedRestoredPackageJson);
    })
});