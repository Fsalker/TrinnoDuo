let express = require("express")
require("dotenv").config();
let connect = require("./database/connect")

const INITIALISE_DATABASE = true

;(async() => {
  let client = await connect()

  if(INITIALISE_DATABASE)
    await require("./database/initialiseDatabase").initialiseDatabase(client)

  let app = express()
  app.listen(process.env.BACKEND_PORT)
  let routes = require("./routes")
  app.use((req, res, next) => { // Pass client to routers
    req.client = client
    next()
  })
  app.use(routes)
  console.log(`Server listening on ${process.env.BACKEND_PORT}`)
})()