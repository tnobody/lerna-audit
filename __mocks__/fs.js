const fs = jest.genMockFromModule('fs');
const renameMock = jest.fn();

fs.promises = {
    rename: renameMock
}

module.exports = fs;