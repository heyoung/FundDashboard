import { format, Logger, loggers, transports } from 'winston'
const { combine, timestamp, label, printf } = format

function buildLogger(loggerName: string): Logger {
  return loggers.add(loggerName, {
    format: combine(
      format.colorize(),
      label({ label: loggerName }),
      timestamp(),
      printf(info => {
        return `${info.timestamp} [${info.label}] ${info.level}: ${
          info.message
        }`
      })
    ),
    transports: [new transports.Console()]
  })
}

export { buildLogger }
