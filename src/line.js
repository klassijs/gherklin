"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var gherkin_1 = require("@cucumber/gherkin");
var utils_js_1 = require("./utils.js");
var Line = /** @class */ (function () {
    function Line(line) {
        this.keyword = '';
        this.safeKeyword = '';
        this.text = '';
        this.indentation = 0;
        this.text = line;
        var allKeywords = Object.entries(gherkin_1.dialects['en']);
        var keywords = allKeywords
            .filter(function (kw) { return kw[0] !== 'name' && kw[0] !== 'native'; })
            .map(function (kw) { return kw[1]; })
            .flat()
            .sort(function (a, b) { return b < a ? -1 : 1; });
        var regex = new RegExp("^(".concat(keywords.map(function (k) { return k.replaceAll('*', '\\*'); }).join('|'), ")"));
        var keywordMatch = line.trim().match(regex);
        if (keywordMatch) {
            this.keyword = keywordMatch[0];
            this.safeKeyword = (0, utils_js_1.camelise)(this.keyword).trim();
            this.indentation = line.length - line.trimStart().length;
            this.text = line.replace(keywordMatch[0], '').trimStart();
        }
    }
    return Line;
}());
exports.default = Line;
