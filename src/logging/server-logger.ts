import chalk from 'chalk'
import Router from 'koa-router'
import { loggers } from 'winston'

import '../logging/server.config'

const logger = loggers.get('server')

export default async (ctx: any, next: any) => {
  const start = +new Date()

  await next()

  const ms = +new Date() - start

  let msg = chalk.gray(`${ctx.method} ${ctx.originalUrl}`)

  let logLevel = 'info'

  if (ctx.status >= 500) {
    logLevel = 'error'
    msg += chalk.red(` ${ctx.status} `)
  }

  if (ctx.status >= 400) {
    logLevel = 'warn'
    msg += chalk.yellow(` ${ctx.status} `)
  }

  if (ctx.status >= 100) {
    logLevel = 'info'
    msg += chalk.green(` ${ctx.status} `)
  }

  msg += chalk.gray(`${ms}ms`)

  logger.log(logLevel, msg)
}
