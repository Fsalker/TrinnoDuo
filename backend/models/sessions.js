module.exports = async(sequelizeConnection) => {
  try{
    let Sequelize = require("sequelize")
    class sessions extends Sequelize.Model{}
    sessions.init({
      id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
      user_id: {type: Sequelize.INTEGER, allowNull: false},
      session: {type: Sequelize.TEXT, allowNull: false},
    }, {sequelize: sequelizeConnection})

    await sessions.sync()
  }catch(e){console.log(e)}
}