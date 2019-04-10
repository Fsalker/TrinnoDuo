module.exports = (args) => {
  let router = require("express").Router()

  let {Cards, Lists, Boards, Sessions, Users} = args.sequelize.models
  router.post(args.apiName, async(req, res) => {
    try{
      let {list_id, title} = req.body.data
      if(!(await args.authentificateUserWithSession(Sessions, req.body.auth.session))) return res.status(401).end()

      let U = await args.getUserFromSession(Sessions, req.body.auth.session)
      let L = await Lists.findOne({where: {id: list_id}})
      let B = await L.getBoard()
      if(B.creator_user_id != U.id) return res.status(403).end()

      let C = await Cards.create({title})
      await C.setList(L)

      res.end(JSON.stringify({card_id: C.id}))
    }catch(e){ args.catchRouteError({error: e, result: res}) }
  })

  router.put(args.apiName, async(req, res) => {
    try{
      let {card_id, title, description} = req.body.data
      if(!(await args.authentificateUserWithSession(Sessions, req.body.auth.session))) return res.status(401).end()

      let C = await Cards.findOne({where: {id: card_id}})
      let L = await C.getList()
      let B = await L.getBoard()
      let U = await args.getUserFromSession(Sessions, req.body.auth.session)
      if(B.creator_user_id != U.id) return res.status(403).end()

      if(title)
        await C.update({title})
      if(description)
        await C.update({description})

      res.end()
    }catch(e){ args.catchRouteError({error: e, result: res}) }
  })

  router.get(args.apiName + "/:session/:list_id", async(req, res) => {
    try{
      let {session, list_id} = req.params
      if(!(await args.authentificateUserWithSession(Sessions, session))) return res.status(401).end()

      let L = await Lists.findOne({where: {id: list_id}})
      let B = await L.getBoard()
      let U = await args.getUserFromSession(Sessions, session)
      if(B.creator_user_id != U.id) return res.status(403).end()

      let cards = await Cards.findAll({attributes: [["id", "card_id"], "title", ["createdAt", "creation_date"], ["updatedAt", "updated_date"]], where: {ListId: list_id}})
      cards = cards.map(card => card.dataValues)

      res.end(JSON.stringify(cards))
    }catch(e){ args.catchRouteError({error: e, result: res}) }
  })

  router.get(args.apiName + "/:session/:list_id/:card_id", async(req, res) => {
    try{
      let {session, card_id} = req.params
      if(!(await args.authentificateUserWithSession(Sessions, session))) return res.status(401).end()

      let C = await Cards.findOne({where: {id: card_id}})
      let L = await C.getList()
      let B = await L.getBoard()
      let U = await args.getUserFromSession(Sessions, session)
      if(B.creator_user_id != U.id) return res.status(403).end()

      res.end(JSON.stringify({title: C.title, description: C.description}))
    }catch(e){ args.catchRouteError({error: e, result: res}) }
  })

  router.delete(args.apiName, async(req, res) => {
    try{
      let {card_id} = req.body.data
      if(!(await args.authentificateUserWithSession(Sessions, req.body.auth.session))) return res.status(401).end()

      let C = await Cards.findOne({where: {id: card_id}})
      let L = await C.getList()
      let B = await L.getBoard()
      let U = await args.getUserFromSession(Sessions, req.body.auth.session)
      if(B.creator_user_id != U.id) return res.status(403).end()

      await C.destroy()

      res.end()
    }catch(e){ args.catchRouteError({error: e, result: res}) }
  })

  return router
}