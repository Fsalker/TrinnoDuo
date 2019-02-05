let router = require("express").Router()
let {log} = require("./common.js")
let apiName = require("./common.js").thisApiName(__filename)

/*router.post(apiName, async(req, res) => {
  try{


    //res.end(JSON.stringify({session: "abcdef"}))
  }catch(e){log(e)}
})*/

module.exports = router