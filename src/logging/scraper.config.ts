import { format, loggers, transports } from 'winston'
const { combine, timestamp, label, printf } = format

loggers.add('scraper', {
  format: combine(
    format.colorize(),
    label({ label: 'Scraper' }),
    timestamp(),
    printf(info => {
      return `${info.timestamp} [${info.label}] ${info.level}: ${info.message}`
    })
  ),
  transports: [new transports.Console()],
})
