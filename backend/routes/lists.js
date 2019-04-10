module.exports = (args) => {
  let router = require("express").Router()

  let {Cards, Lists, Boards, Sessions, Users} = args.sequelize.models
  router.post(args.apiName, async(req, res) => {
    try{
      let {board_id, title} = req.body.data
      if(!(await args.authentificateUserWithSession(Sessions, req.body.auth.session))) return res.status(401).end()

      let U = await args.getUserFromSession(Sessions, req.body.auth.session)
      let B = await Boards.findOne({where: {id: board_id}})
      if(B.creator_user_id != U.id) return res.status(403).end()
      let L = await Lists.create({title})
      await L.setBoard(B)

      res.end(JSON.stringify({list_id: L.id}))
    }catch(e){ args.catchRouteError({error: e, result: res}) }
  })

  router.put(args.apiName, async(req, res) => {
    try{
      let {list_id, title} = req.body.data
      if(!(await args.authentificateUserWithSession(Sessions, req.body.auth.session))) return res.status(401).end()
      let L = await Lists.findOne({where: {id: list_id}})
      let U = await args.getUserFromSession(Sessions, req.body.auth.session)
      let B = await L.getBoard()
      if(B.creator_user_id != U.id) return res.status(403).end()

      await L.update({title}, {where: {id: list_id}})
      // await req.client.query("UPDATE lists SET title=$1 WHERE id = $2", [title, list_id])

      res.end()
    }catch(e){ args.catchRouteError({error: e, result: res}) }
  })

  router.get(args.apiName + "/:session/:board_id", async(req, res) => {
    try{
      let {board_id, session} = req.params
      if(!(await args.authentificateUserWithSession(Sessions, session))) return res.status(401).end()

      let U = await args.getUserFromSession(Sessions, session)
      let B = await Boards.findOne({where: {id: board_id}})
      if(B.creator_user_id != U.id) return res.status(403).end()

      L = await Lists.findAll({attributes: [["id", "list_id"], "title", ["createdAt", "creation_date"], ["updatedAt", "updated_date"]], where: {BoardId: board_id}})

      res.end(JSON.stringify(L))
    }catch(e){ args.catchRouteError({error: e, result: res}) }
  })

  router.delete(args.apiName, async(req, res) => {
    try{
      let {list_id, title} = req.body.data
      if(!(await args.authentificateUserWithSession(Sessions, req.body.auth.session))) return res.status(401).end()

      let L = await Lists.findOne({where: {id: list_id}})
      let U = await args.getUserFromSession(Sessions, req.body.auth.session)
      let B = await L.getBoard()
      if(B.creator_user_id != U.id) return res.status(403).end()

      await Cards.destroy({where: {ListId: list_id}})
      await L.destroy()

      res.end()
    }catch(e){ args.catchRouteError({error: e, result: res}) }
  })

  return router
}