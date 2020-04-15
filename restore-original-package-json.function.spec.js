jest.mock('fs')
const {promises} = require('fs');
const {restoreOriginalPackageJson} = require("./restore-original-package-json.function");

describe("restore original package json", () => {

    const warnMock = jest.fn();
    global.console = {
        warn: warnMock
    }

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
        expect(warnMock).toBeCalled();
    })
});