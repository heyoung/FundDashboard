import Joi from 'joi'
import Router from 'koa-router'
import { FundDataManager } from '../data/data-manager'

const router = new Router({
  prefix: '/api/v1'
})
; (async () => {
  const manager: FundDataManager = await FundDataManager.build()

  // Returns list of fund data.
  // TODO: Use query string if present
  router.get('/funds', async ctx => {
    const funds = await manager.getAll()
    ctx.body = funds
  })

  // Returns data for a specific fund
  router.get('/funds/:isin', async ctx => {
    const result = Joi.validate(ctx.params.isin, Joi.string().alphanum())

    if (result.error) {
      ctx.status = 400
      ctx.body = 'Invalid ISIN'
      return
    }

    const fund = await manager.getByIsin(result.value)

    if (!fund) {
      ctx.status = 404
      ctx.body = 'Fund not found'
      return
    }

    ctx.body = fund
  })
})()

export default router
