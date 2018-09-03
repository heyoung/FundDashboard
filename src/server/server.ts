import Koa from 'koa'
import Router from 'koa-router'
import serve from 'koa-static'
import views from 'koa-views'
import logger from '../logging/server-logger'
import apiRouter from './api'

const app = new Koa()
const router = new Router()

app.use(views(__dirname + '/views'))
app.use(serve(__dirname + '/dist'))

app.use(logger)

router.get('/', async (ctx, next) => {
  await ctx.render('dashboard')
})

app.use(router.routes()).use(router.allowedMethods())
app.use(apiRouter.routes()).use(apiRouter.allowedMethods())

app.listen(3000)
