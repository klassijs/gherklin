import Reporter from './reporter.js'

export default class NullReporter extends Reporter {
  public write = (): void => {}
}
