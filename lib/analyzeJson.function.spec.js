const {analyzeJson} = require("./analyzeJson");

describe("analyzeJson", () => {
    it("should analyze indentation", () => {

        //GIVEN
        const jsonString = "{   \"name\": \"sampleJson\",   \"version\": \"0.8.15\"}"
        const expectedIndentation = 3;

        //WHEN
        const opts = analyzeJson(jsonString);

        //THEN
        expect(opts.indentation).toBe(expectedIndentation)
    })

    it("should recognize json files without indentation", () => {

        //GIVEN
        const jsonString = "{\"name\": \"sampleJson\",   \"version\": \"0.8.15\"}"
        const expectedIndentation = 0;

        //WHEN
        const opts = analyzeJson(jsonString);

        //THEN
        expect(opts.indentation).toBe(expectedIndentation)
    })

    it("should identify newline at EOF", () => {

        //GIVEN
        const jsonString = "{   \"name\": \"sampleJson\",   \"version\": \"0.8.15\"}\n"

        //WHEN
        const opts = analyzeJson(jsonString);

        //THEN
        expect(opts.withEOFNewline).toBeTruthy()
    })

    it("should identify no newline at EOF", () => {

        //GIVEN
        const jsonString = "{   \"name\": \"sampleJson\",   \"version\": \"0.8.15\"}"

        //WHEN
        const opts = analyzeJson(jsonString);

        //THEN
        expect(opts.withEOFNewline).toBeFalsy()
    })
});