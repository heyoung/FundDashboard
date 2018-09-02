import Koa from 'koa'
import Router from 'koa-router'
import serve from 'koa-static'
import views from 'koa-views'

const app = new Koa()
const router = new Router()

app.use(views(__dirname + '/views'))
app.use(serve(__dirname + '/dist'))

router.get('/', async (ctx, next) => {
  await ctx.render('index')
})

app.use(router.routes()).use(router.allowedMethods())

app.listen(3000)
