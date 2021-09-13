const {promises} = require("fs");

async function writeJson(path, json, jsonOpts){
    let jsonToWrite = JSON.stringify(json, null, jsonOpts.indentation);
    if(jsonOpts.withEOFNewline){
        jsonToWrite += "\n"
    }

    await promises.writeFile(path, jsonToWrite);
}

module.exports = {
    writeJson
};