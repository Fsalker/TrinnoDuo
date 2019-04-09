let {createSession} = require("./common.js")
let {hashify} = require("./common.js")

module.exports = async(args) => {
  let router = require("express").Router()

  let {Users, Sessions} = args.sequelize.models
  router.post(args.apiName, async(req, res) => {
    try{
      let {username, password} = req.body.data
      password = hashify(password)

      if(await Users.findOne({where: {username}}))
         return res.status(409).end()
      let user = await Users.create({username, password})
      let session = await createSession(Sessions, user)
      //args.log("Registered user "+username)
      res.end(JSON.stringify({session}))
    }catch(e){ args.catchRouteError({error: e, result: res}) }
  })

  router.get(args.apiName+"/:session", async(req, res) => {
    try{
      let {session} = req.params
      if(!(await args.authentificateUserWithSession(Sessions, session))) return res.status(401).end()

      let users = await Users.findAll({attributes: [["id", "user_id"], "username"]})
      users = users.map(user => user.dataValues)

      res.end(JSON.stringify(users))
    }catch(e){ args.catchRouteError({error: e, result: res}) }
  })

  router.delete(args.apiName, async(req, res) => {
    try{
      let session, username, password

      let U, S
      if(req.body.auth && req.body.auth.session) {
        //if(!req.body.auth.session) return res.status(400).end()
        session = req.body.auth.session
        S = await Sessions.findOne({where: {sessions}})
        U = await Users.findOne({where: {id: S.dataValues.userId}})
      }
      else if(req.body.data && req.body.data.username && req.body.data.password) {
        //if(!req.body.data.username || !req.body.data.password) return res.status(400).end()
        username = req.body.data.username
        password = req.body.data.password
        password = hashify(password)
        U = await Users.findOne({where: {username, password}})
      }
      else return res.status(400).end()

      if(U) await U.destroy({})
      if(S) await S.destroy({})

      res.end()
    }catch(e){ args.catchRouteError({error: e, result: res}) }
  })

  return router
}