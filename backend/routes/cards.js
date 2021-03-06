module.exports = (args) => {
  let router = require("express").Router()

  router.post(args.apiName, async(req, res) => {
    try{
      let {list_id, title} = req.body.data
      if(!(await args.authentificateUserWithSession(req.client, req.body.auth.session))) return res.status(401).end()
      let board_id = (await req.client.query("SELECT board_id FROM lists WHERE id = $1", [list_id])).rows[0].board_id
      let user_id = await args.getIdFromSession(req.client, req.body.auth.session)
      if(!(await args.validateBoardOwnership(req.client, user_id, board_id))) return res.status(403).end()

      let card_id = (await req.client.query("INSERT INTO cards(id, list_id, title) VALUES($1, $2, $3) RETURNING id AS card_id", [args.generateShortSession(), list_id, title])).rows[0].card_id

      res.end(JSON.stringify({card_id}))
    }catch(e){ args.catchRouteError({error: e, result: res}) }
  })

  router.put(args.apiName, async(req, res) => {
    try{
      let {card_id, title, description} = req.body.data
      if(!(await args.authentificateUserWithSession(req.client, req.body.auth.session))) return res.status(401).end()
      let list_id = (await req.client.query("SELECT list_id FROM cards WHERE id = $1", [card_id])).rows[0].list_id
      let board_id = (await req.client.query("SELECT board_id FROM lists WHERE id = $1", [list_id])).rows[0].board_id
      let user_id = await args.getIdFromSession(req.client, req.body.auth.session)
      if(!(await args.validateBoardOwnership(req.client, user_id, board_id))) return res.status(403).end()

      if(title)
        await req.client.query("UPDATE cards SET title = $1 WHERE id = $2", [title, card_id])
      if(description)
        await req.client.query("UPDATE cards SET description = $1 WHERE id = $2", [description, card_id])

      res.end()
    }catch(e){ args.catchRouteError({error: e, result: res}) }
  })

  router.get(args.apiName + "/:session/:list_id", async(req, res) => {
    try{
      let {session, list_id} = req.params
      if(!(await args.authentificateUserWithSession(req.client, session))) return res.status(401).end()
      let board_id = (await req.client.query("SELECT board_id FROM lists WHERE id = $1", [list_id])).rows[0].board_id
      let user_id = await args.getIdFromSession(req.client, session)
      if(!(await args.validateBoardOwnership(req.client, user_id, board_id))) return res.status(403).end()

      let cards = (await req.client.query("SELECT id AS card_id, title, creation_date, last_updated FROM cards WHERE list_id = $1", [list_id])).rows

      res.end(JSON.stringify(cards))
    }catch(e){ args.catchRouteError({error: e, result: res}) }
  })

  router.get(args.apiName + "/:session/:list_id/:card_id", async(req, res) => {
    try{
      let {session, card_id} = req.params
      if(!(await args.authentificateUserWithSession(req.client, session))) return res.status(401).end()
      let list_id = (await req.client.query("SELECT list_id FROM cards WHERE id = $1", [card_id])).rows[0].list_id
      let board_id = (await req.client.query("SELECT board_id FROM lists WHERE id = $1", [list_id])).rows[0].board_id
      let user_id = await args.getIdFromSession(req.client, session)
      if(!(await args.validateBoardOwnership(req.client, user_id, board_id))) return res.status(403).end()

      let card = (await req.client.query("SELECT title, description FROM cards WHERE id = $1", [card_id])).rows[0]

      res.end(JSON.stringify(card))
    }catch(e){ args.catchRouteError({error: e, result: res}) }
  })

  router.delete(args.apiName, async(req, res) => {
    try{
      let {card_id} = req.body.data
      if(!(await args.authentificateUserWithSession(req.client, req.body.auth.session))) return res.status(401).end()
      let list_id = (await req.client.query("SELECT list_id FROM cards WHERE id = $1", [card_id])).rows[0].list_id
      let board_id = (await req.client.query("SELECT board_id FROM lists WHERE id = $1", [list_id])).rows[0].board_id
      let user_id = await args.getIdFromSession(req.client, req.body.auth.session)
      if(!(await args.validateBoardOwnership(req.client, user_id, board_id))) return res.status(403).end()

      await req.client.query("DELETE FROM cards WHERE id = $1", [card_id])

      res.end()
    }catch(e){ args.catchRouteError({error: e, result: res}) }
  })

  return router
}