import Reporter from './reporter.js';
export default class HTMLReporter extends Reporter {
    write: () => void;
    private syntaxHighlight;
}
