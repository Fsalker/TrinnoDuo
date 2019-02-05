let router = require("express").Router()
let {log} = require("./common.js")
let apiName = require("./common.js").thisApiName(__filename)
let {createSession} = require("./common.js")

router.post(apiName, async(req, res) => {
  try{
    //console.log(req.client)
    //console.log(req.body)
    /*if(req.body.username === undefined || typeof(req.body.username) != "String" || req.body.username.length > 1000000)
      return res.status(400)*/
    let r = await req.client.query("INSERT INTO users(username, password) VALUES($1, $2) RETURNING id", [req.body.username, req.body.password])
    let user_id = r.rows[0].id
    let session = await createSession(req.client, user_id)

    res.end(JSON.stringify({session}))
  }catch(e){log(e)}
})

module.exports = router

/*module.exports = (...args) => {
  let router = require("express").Router()

  /*router.get(args.apiName, async(req, res) => {
    throw 123
  })
}*/

/*let router = require("express").Router()
let {log} = require("./common.js")
let apiName = require("./common.js").thisApiName(__filename)

/*router.get(apiName, (req, res) => {
  try {
    //throw new Error("123f")
  } catch(e) {
    log(e)
  }
})

router.get(`${apiName}/:id`, (req, res) => {
  try{
    res.end(`Getting ${apiName} with ID ${req.params.id}`)
  } catch(e) {
    log(e)
  }
})

router.post(apiName, (req, res) => {
  try{
    res.end(JSON.stringify({session: `1234123456785678123412345678567812341234567856781234123456785678`}))
  } catch(e) {
    log(e)
  }
})

router.delete(apiName, (req, res) => {
  try{
    res.end(`Delete ${apiName}`)
  } catch(e) {
    log(e)
  }
})

module.exports = router*/