let express = require("express")
let log = require("./routes/common.js").log
require("dotenv").config();
let connect = require("./database/connect").createConnection
let {sequelize} = require("./database/connect")

// const INITIALISE_DATABASE = false;
const RESET_DATABASE = false;
const PORT = require.main === module ? process.env.BACKEND_PORT : process.env.BACKEND_ALTERNATIVE_PORT // Use the default port when running server.js directly OR the alternative port otherwise (so as to avoid conflicts :D)

let main = async() => {
  try{
    let client = await connect()

    await require("./models")(sequelize)
    if(RESET_DATABASE)
      await sequelize.sync({force: true})
    let app = express()
    app.listen(PORT)
    // app.use((req, res, next) => {req.client = client; next()}) // Pass client to Routes
    let routes = await require("./routes")(sequelize)
    app.use(routes)
    log(`Server listening on ${PORT}`)
  }catch(e){console.log(e)}
}

if(require.main === module)
  main()

module.exports = main