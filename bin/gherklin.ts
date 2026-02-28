#!/usr/bin/env node
import { readFileSync } from 'node:fs'
import { Runner } from '../src/index.js' // note the .js here

const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf-8'))
const version: string = pkg.version

const onError = (err: unknown) => {
    const msg = err instanceof Error ? (err.stack || err.message) : String(err)
    console.error(`Ah ah ah, you didn't say the magic word!

Gherklin: v${version}  

${msg}
`)
}
process.on('uncaughtException', onError)
process.on('unhandledRejection', onError as any)

const runner = new Runner()
try {
    const init = await runner.init()
    if (!init.success) process.exit(1)
    const result = await runner.run()
    process.exit(result.success ? 0 : 1)
} catch (err) {
    onError(err)
    process.exit(1)
}