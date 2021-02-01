/** @noSelfInFile */

type json = Array<any>

declare namespace Json = require('Json.json') {
    function decode(json: json): string
    function encode(data: any): json
}