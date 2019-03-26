let express = require("express")
let log = require("./routes/common.js").log
require("dotenv").config();
let connect = require("./database/connect").createConnection
let sequelizeConnection = require("./database/connect").sequelize

// const INITIALISE_DATABASE = false;
const RESET_DATABASE = false;
const PORT = require.main === module ? process.env.BACKEND_PORT : process.env.BACKEND_ALTERNATIVE_PORT // Use the default port when running server.js directly OR the alternative port otherwise (so as to avoid conflicts :D)


let main = async() => {
  try{
    let client = await connect()

    // if(INITIALISE_DATABASE)
    //   await require("./database/initialiseDatabase").initialiseDatabase(client)
    if(RESET_DATABASE)
      await require("./database/initialiseDatabase").resetDatabase(client)

    await require("./models")(sequelizeConnection)
    let app = express()
    app.listen(PORT)
    app.use((req, res, next) => {req.client = client; next()}) // Pass client to Routes
    let routes = require("./routes")
    app.use(routes)
    log(`Server listening on ${PORT}`)
  }catch(e){console.log(e)}
}

if(require.main === module)
  main()

module.exports = main