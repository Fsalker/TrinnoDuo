let express = require("express")
let router = express.Router()
let fs = require("fs")

router.use(express.json())
// Use routers from all exported .js files in this folder, except for index.js and common.js
let apiFiles = fs.readdirSync(__dirname).filter(fileName => fileName != "index.js" && fileName != "common.js").map(fileName => fileName.slice(0, -3)).forEach(fileName => {
  try{
    router.use(require(`./${fileName}`))
  } catch(e) {
    console.log("An error has occurred when adding Route "+fileName)
    console.log(e)
  }
})

/*let apiFiles = fs.readdirSync(__dirname)
console.log(apiFiles)
let filteredApiFiles = apiFiles.filter(fileName => fileName != "index.js" && fileName != "common.js")
console.log(filteredApiFiles)
let mappedApiFiles = filteredApiFiles.map(fileName => fileName.slice(0, -3))
console.log(mappedApiFiles);
[1, 2, 3].forEach(fileName => {
  try {
    console.log(fileName)
    throw new Error(123)
  }catch(e){console.log(e)}
})*/

module.exports = router