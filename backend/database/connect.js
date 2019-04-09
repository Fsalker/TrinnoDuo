require("dotenv").config()
let Sequelize = require("sequelize")
let sequelize = new Sequelize(`postgres://${process.env.PGUSER}:${process.env.PGPASSWORD}@localhost:${process.env.PGPORT}/${process.env.PGDATABASE}`, {logging: false})

let {Pool} = require("pg")

module.exports = {
  createConnection: async() => new Pool().connect(),
  sequelize
}

//module.exports = sequelize