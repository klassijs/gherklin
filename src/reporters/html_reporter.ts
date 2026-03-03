import { readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import Handlebars from 'handlebars'

import Reporter from './reporter.js'
import { Report, ReportFile, ReportLine, Severity } from '../types.js'

const TOP_RULES_COUNT = 6

interface FileReportItem {
  path: string
  errorCount: number
  warnCount: number
  issues: Array<{ line: number; col: number; severity: string; rule: string }>
}

interface DashboardReport extends Report {
  generatedAt: string
  version: string
  filesScanned: number
  totalWarnings: number
  durationSeconds: number
  topRules: Array<{ name: string; count: number }>
  fileList: FileReportItem[]
}

export default class HTMLReporter extends Reporter {
  public override write = (): void => {
    const templateHTML = readFileSync(path.join(import.meta.dirname, './template.html'), { encoding: 'utf-8' })

    const template = Handlebars.compile(templateHTML)
    const values: DashboardReport = {
      title: this.config?.title || 'Gherklin Report',
      files: [],
      totalErrors: 0,
      totalWarns: 0,
      totalLines: 0,
      rules: {},
      generatedAt: new Date().toISOString(),
      version: this.getVersion(),
      filesScanned: this.errors.size,
      totalWarnings: 0,
      durationSeconds: 0.025,
      topRules: [],
      fileList: [],
    }

    for (const [filePath] of this.errors.entries()) {
      const errors = this.errors.get(filePath)
      if (!errors) continue

      const errorCount = errors.filter((e) => e.severity === Severity.error).length
      const warnCount = errors.filter((e) => e.severity === Severity.warn).length
      values.totalErrors += errorCount
      values.totalWarns += warnCount
      values.totalWarnings = values.totalWarns

      for (const e of errors) {
        values.rules[e.rule] = (values.rules[e.rule] ?? 0) + 1
      }

      const issues = errors.map((e) => ({
        line: e.location.line,
        col: e.location.column ?? 1,
        severity: e.severity === Severity.error ? 'error' : 'warn',
        rule: e.rule,
      }))

      values.fileList.push({
        path: filePath,
        errorCount,
        warnCount,
        issues,
      })

      const content = readFileSync(filePath, { encoding: 'utf-8' })
      const lines = content.split('\n')
      values.totalLines += lines.length

      const hasErrors = errors.some((e) => e.severity === Severity.error)
      const fileInfo: ReportFile = {
        path: filePath,
        hasErrors,
        lines: [],
        issueCount: errors.length,
      }

      lines.forEach((line: string, index: number) => {
        const lineIssue = errors.find((e) => e.location.line === index + 1)
        const lineInfo: ReportLine = {
          number: index + 1,
          hasError: lineIssue !== undefined,
          errorSeverity: lineIssue ? lineIssue.severity : Severity.warn,
          content: this.syntaxHighlight(line),
          ruleName: lineIssue?.rule ?? '',
        }
        fileInfo.lines.push(lineInfo)
      })
      values.files.push(fileInfo)
    }

    const totalIssues = values.totalErrors + values.totalWarnings
    const ruleCounts = Object.values(values.rules)
    const maxRuleCount = ruleCounts.length ? Math.max(...ruleCounts) : 0
    values.topRules = Object.entries(values.rules)
      .sort(([, a], [, b]) => b - a)
      .slice(0, TOP_RULES_COUNT)
      .map(([name, count]) => ({
        name,
        count,
        widthPercent: maxRuleCount > 0 ? (count / maxRuleCount) * 100 : 0,
      }))

    const v = values as unknown as Record<string, unknown>
    v.totalIssues = totalIssues
    v.errorPercent = totalIssues ? (values.totalErrors / totalIssues) * 100 : 0
    v.warnPercent = totalIssues ? (values.totalWarnings / totalIssues) * 100 : 0
    v.fileListJson = JSON.stringify(values.fileList).replace(/</g, '\\u003c')

    const html = template(values)
    const outDir = this.config.configDirectory ?? process.cwd()
    writeFileSync(path.resolve(outDir, this.config.outFile || 'gherklin-report.html'), html)
  }

  private getVersion(): string {
    try {
      const pkgPath = path.join(process.cwd(), 'package.json')
      const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'))
      return (pkg.version as string) ?? '1.0.14'
    } catch {
      return '1.0.14'
    }
  }

  private syntaxHighlight(line: string): string {
    const keywords = ['Scenario Outline', 'Scenario', 'Feature', 'Given', 'When', 'Then', 'And', 'But', 'Rule']
    let keyword

    const keywordMatch = line.match(new RegExp(`${keywords.join('|')}`))
    if (keywordMatch) {
      keyword = keywordMatch[0]
      line = line.replace(keyword, `<span class="keyword">${keyword}</span>`)
    }

    if (line.trim().indexOf('#') === 0) {
      line = `<span class="text-muted">${line}</span>`
    }

    return line
  }
}
