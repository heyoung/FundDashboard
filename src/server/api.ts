import Joi from 'joi'
import Router from 'koa-router'
import { FundDataManager } from '../data/data-manager'

const router = new Router({
  prefix: '/api/v1'
})
; (async () => {
  const manager: FundDataManager = await FundDataManager.build()

  router.get('/funds/names', async ctx => {
    const names = await manager.getAllNames()
    ctx.body = names
  })

  // Returns list of fund data.
  router.get('/funds', async ctx => {
    if (Object.keys(ctx.request.query).indexOf('name') > -1) {
      if (!ctx.request.query.name) {
        ctx.body = {}
        return
      }

      if (
        Joi.validate(
          ctx.request.query.name,
          Joi.string().regex(/^[a-zA-Z0-9\s-]*$/)
        ).error
      ) {
        ctx.status = 400
        ctx.body = 'Invalid query name'
        return
      }

      const fund = await manager.getByName(ctx.request.query.name)

      if (!fund) {
        ctx.body = {}
      } else {
        ctx.body = fund
      }

      return
    }

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
