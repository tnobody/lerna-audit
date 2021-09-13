function analyzeJson(jsonString){
    const opts = {}
    const match = jsonString.match("^{\n*( +)*");
    if(match && match[1]){
        opts.indentation = match[1].length
    }else{
        opts.indentation = 0
    }

    opts.withEOFNewline = jsonString.endsWith("\n");

    return opts
}

module.exports = {
    analyzeJson
};