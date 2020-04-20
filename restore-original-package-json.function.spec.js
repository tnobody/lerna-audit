jest.mock('fs')
const {promises} = require('fs');
const {restoreOriginalPackageJson} = require("./restore-original-package-json.function");

describe("restore original package json", () => {

    const errorMock = jest.fn();
    global.console = {
        error: errorMock
    }

    beforeEach(() => {
        errorMock.mockReset();
    })

    it("should restore original package json", async () => {

        //GIVEN
        const packagePaths = {
            backupPath: "/foo/bar",
            originalPath: "/foo/bar.original"
        };

        //WHEN
        await restoreOriginalPackageJson(packagePaths);

        //THEN
        expect(promises.rename).toHaveBeenCalledWith(packagePaths.backupPath, packagePaths.originalPath);
    })

    it("should die gracefully in case of an error", async () => {

        //GIVEN
        const packagePaths = {
            backupPath: "/foo/bar",
            originalPath: "/foo/bar.original"
        };
        promises.rename.mockImplementation(() => {
            throw Error;
        });

        //WHEN
        await restoreOriginalPackageJson(packagePaths);

        //THEN
        expect(errorMock).toBeCalled();
    })

    it("should not throw an error on undefined package paths", async () => {

        //GIVEN
        let packagePaths;

        //WHEN + THEN
        await expect(() => restoreOriginalPackageJson(packagePaths)).not.toThrow()
        expect(errorMock).not.toBeCalled();
    })
});