import { writeFileSync } from 'node:fs'
import path from 'node:path'

import Reporter from './reporter.js'
import logger from '../logger.js'

export default class JSONReporter extends Reporter {
  public write = (): void => {
    const json = JSON.stringify(Object.fromEntries(this.errors), null, 2)

    if (!this.config.outFile) {
      logger.info(json)
      return
    }

    const outDir = this.config.configDirectory ?? process.cwd()
    writeFileSync(path.join(outDir, this.config.outFile || 'gherklin-report.json'), json, {
      flag: 'w',
    })
  }
}
