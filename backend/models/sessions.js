module.exports = async(sequelizeConnection) => {
  try{
    let Sequelize = require("sequelize")
    class Sessions extends Sequelize.Model{}
    Sessions.init({
      id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
      session: {type: Sequelize.TEXT, allowNull: false},
    }, {sequelize: sequelizeConnection})

    // await Sessions.sync()
    return Sessions
  }catch(e){console.log(e)}
}