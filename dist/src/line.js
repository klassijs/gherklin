import { dialects } from '@cucumber/gherkin';
import { camelise } from './utils.js';
export default class Line {
    keyword = '';
    safeKeyword = '';
    text = '';
    indentation = 0;
    constructor(line) {
        this.text = line;
        const allKeywords = Object.entries(dialects['en']);
        const keywords = allKeywords
            .filter((kw) => kw[0] !== 'name' && kw[0] !== 'native')
            .map((kw) => kw[1])
            .flat()
            .sort((a, b) => b < a ? -1 : 1);
        const regex = new RegExp(`^(${keywords.map((k) => k.replaceAll('*', '\\*')).join('|')})`);
        const keywordMatch = line.trim().match(regex);
        if (keywordMatch) {
            this.keyword = keywordMatch[0];
            this.safeKeyword = camelise(this.keyword).trim();
            this.indentation = line.length - line.trimStart().length;
            this.text = line.replace(keywordMatch[0], '').trimStart();
        }
    }
}
//# sourceMappingURL=line.js.map