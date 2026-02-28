import { switchOrSeveritySchema } from '../schemas.js';
import Schema from '../schema.js';
export default class AlignedDatatables {
    name = 'aligned-datatables';
    acceptedSchema = switchOrSeveritySchema;
    schema;
    constructor(rawSchema) {
        this.schema = new Schema(rawSchema);
    }
    async run(document) {
        document.lines.forEach((line, lineIndex) => {
            // Only consider lines that start with a '|' after trimming left padding
            if (line.text.trimStart().charAt(0) !== '|') {
                return;
            }
            const nextLine = document.lines[lineIndex + 1];
            if (!nextLine)
                return;
            // Collect pipe positions for the current line
            const pipeIndices = [];
            let pipeIndex = line.text.indexOf('|');
            while (pipeIndex !== -1) {
                pipeIndices.push(pipeIndex);
                pipeIndex = line.text.indexOf('|', pipeIndex + 1);
            }
            // Collect pipe positions for the next line
            const nextPipeIndices = [];
            let nextPipeIndex = nextLine.text.indexOf('|');
            while (nextPipeIndex !== -1) {
                nextPipeIndices.push(nextPipeIndex);
                nextPipeIndex = nextLine.text.indexOf('|', nextPipeIndex + 1);
            }
            // Compare column positions of each pipe
            pipeIndices.forEach((col, idx) => {
                const matchCol = nextPipeIndices[idx];
                if (matchCol === undefined)
                    return;
                if (col !== matchCol) {
                    document.addError(this, 'Data table is not formatted correctly', {
                        line: lineIndex + 1, // 1-based line number
                        column: matchCol, // column where misalignment occurs
                    });
                }
            });
        });
    }
}
