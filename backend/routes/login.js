let {createSession} = require("./common.js")
let {hashify} = require("./common.js")

module.exports = (args) => {
  let router = require("express").Router()

  let {Users, Sessions} = args.sequelize.models
  router.post(args.apiName, async(req, res) => {
    try{
      let {username, password} = req.body.data
      password = hashify(password)

      // let r = await req.client.query("SELECT id FROM users WHERE username = $1 AND password = $2", [username, password])
      let user = await Users.findOne({where: {username, password}})
      if(!user)
        return res.status(404).end()
      let session = await createSession(Sessions, user)
      //args.log("Logged in user "+username)
      res.end(JSON.stringify({session}))
    }catch(e){ args.catchRouteError({error: e, result: res}) }
  })

  return router
}