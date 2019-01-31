let express = require("express")
let router = express.Router()
let fs = require("fs")

router.use(express.json())
// Use routers from all exported .js files in this folder, except for index.js and common.js
let apiFiles = fs.readdirSync(__dirname).filter(fileName => fileName != "index.js" && fileName != "common.js").map(fileName => fileName.slice(0, -3)).forEach(fileName => {
  router.use(require(`./${fileName}`))
})

module.exports = router