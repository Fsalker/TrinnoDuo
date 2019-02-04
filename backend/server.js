let express = require("express")
require("dotenv").config();
let connect = require("./database/connect")

const INITIALISE_DATABASE = true;
const PORT = require.main === module ? process.env.BACKEND_PORT : process.env.BACKEND_ALTERNATIVE_PORT // Use the default port when running server.js directly OR the alternative port otherwise (so as to avoid conflicts :D)

let main = async() => {
  let client = await connect()

  if(INITIALISE_DATABASE)
    await require("./database/initialiseDatabase").initialiseDatabase(client)

  let app = express()
  app.listen(PORT)
  app.use((req, res, next) => {req.client = client; next()}) // Pass client to Routes
  // app.use((req, res, next) => {console.log("Started!"); next()})
  // app.use((req, res, next) => {console.log("Finished!"); next()})
  app.use(require("./routes"))
  console.log(`Server listening on ${PORT}`)
}

if(require.main === module)
  main()

module.exports = main