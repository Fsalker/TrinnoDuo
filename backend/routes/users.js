let router = require("express").Router()
let {log} = require("./common.js")
let apiName = require("./common.js").thisApiName(__filename)

router.get(apiName, (req, res) => {
  try {
    console.log(req.body)
    //throw new Error("123f")
    res.end(`Getting ${apiName}`)
  } catch(e) {
    log(e)
  }
})

router.get(`${apiName}/:id`, (req, res) => {
  try{
    console.log(req.body)
    res.end(`Getting ${apiName} with ID ${req.params.id}`)
  } catch(e) {
    log(e)
  }
})

router.post(apiName, (req, res) => {
  try{
    console.log(req.body)
    res.end(JSON.stringify({session: `1234123456785678123412345678567812341234567856781234123456785678`}))
  } catch(e) {
    log(e)
  }
})

router.delete(apiName, (req, res) => {
  try{
    console.log(req.body)
    res.end(`Delete ${apiName}`)
  } catch(e) {
    log(e)
  }
})

module.exports = router