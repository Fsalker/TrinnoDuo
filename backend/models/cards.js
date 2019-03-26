module.exports = async(sequelizeConnection) => {
  try{
    let Sequelize = require("sequelize")
    class cards extends Sequelize.Model{}
    cards.init({
      id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
      user_id: {type: Sequelize.INTEGER, allowNull: false},
      title: {type: Sequelize.TEXT, allowNull: false},
      description: {type: Sequelize.TEXT, defaultValue: ""},
    }, {sequelize: sequelizeConnection})

    await cards.sync()
  }catch(e){console.log(e)}
}