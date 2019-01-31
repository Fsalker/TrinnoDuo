let router = require("express").Router()
let {thisApiName, log} = require("./common.js")

router.get(thisApiName(__filename), (req, res) => {
  try{
    console.log(req.client)
    res.end("hey!")
  } catch(e) {
    log(e)
  }
})

module.exports = router