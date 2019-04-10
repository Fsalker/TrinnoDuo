module.exports = (args) => {
  let router = require("express").Router()

  let {Cards, Lists, Boards, Sessions, Users} = args.sequelize.models
  router.post(args.apiName, async(req, res) => {
    try{
      let {title} = req.body.data
      if(!(await args.authentificateUserWithSession(Sessions, req.body.auth.session))) return res.status(401).end()

      let U = await args.getUserFromSession(Sessions, req.body.auth.session)
      let B = await Boards.create({title, creator_user_id: U.id})
      await B.addUser(U)

      res.end(JSON.stringify({board_id: B.id}))
    }catch(e){ args.catchRouteError({error: e, result: res}) }
  })

  router.put(args.apiName, async(req, res) => {
    try{
      let {board_id, title} = req.body.data
      if(!(await args.authentificateUserWithSession(Sessions, req.body.auth.session))) return res.status(401).end()

      if(title === undefined)
        return res.status(400).end()

      let U = await args.getUserFromSession(Sessions, req.body.auth.session)
      let B = await Boards.findOne({where: {id: board_id}})
      if(B.creator_user_id != U.id) return res.status(403).end()

      await B.update({title}, {where: {id: board_id}})
      res.end()
    }catch(e){ args.catchRouteError({error: e, result: res}) }
  })

  router.get(args.apiName + "/:session", async(req, res) => {
    try{
      let {session} = req.params
      if(!(await args.authentificateUserWithSession(Sessions, session))) return res.status(401).end()

      let U = await args.getUserFromSession(Sessions, session)
      let B = await Boards.findAll({attributes: [["id", "board_id"], "title", ["createdAt", "creation_date"], ["updatedAt", "last_updated"]], where: {creator_user_id: U.id}})
      B = B.map(board => board.dataValues)

      res.end(JSON.stringify(B))
    }catch(e){ args.catchRouteError({error: e, result: res}) }
  })

  router.get(args.apiName + "/:session/:board_id", async(req, res) => {
    try{
      let {session} = req.params
      if(!(await args.authentificateUserWithSession(Sessions, session))) return res.status(401).end()
      let {board_id} = req.params

      let U = await args.getUserFromSession(Sessions, session)
      let B = await Boards.findOne({where: {id: board_id}})
      if(B.creator_user_id != U.id) return res.status(403).end()

      res.end(JSON.stringify({title: B.title}))
    }catch(e){ args.catchRouteError({error: e, result: res}) }
  })

  router.delete(args.apiName, async(req, res) => {
    try{
      let {board_id} = req.body.data
      if(!(await args.authentificateUserWithSession(Sessions, req.body.auth.session))) return res.status(401).end()

      let U = await args.getUserFromSession(Sessions, req.body.auth.session)
      let B = await Boards.findOne({where: {id: board_id}})
      if(B.creator_user_id != U.id) return res.status(403).end()

      let lists = await Lists.findAll({where: {BoardId: board_id}})
      let listIds = lists.reduce((acc, list) => acc.push(list.id), [])
      let cards = await Cards.findAll({where: {ListId: listIds}})
      let cardIds = cards.reduce((acc, card) => acc.push(card.id), [])

      await B.destroy({})
      await Lists.destroy({where: {id: listIds}})
      await Cards.destroy({where: {id: cardIds}})

      res.end()
    }catch(e){ args.catchRouteError({error: e, result: res}) }
  })

  return router
}