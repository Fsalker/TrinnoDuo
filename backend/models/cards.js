module.exports = async(sequelizeConnection) => {
  try{
    let Sequelize = require("sequelize")
    class Cards extends Sequelize.Model{}
    Cards.init({
      id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
      title: {type: Sequelize.TEXT, allowNull: false},
      description: {type: Sequelize.TEXT, defaultValue: ""},
    }, {sequelize: sequelizeConnection})

    // await Cards.sync()
    return Cards
  }catch(e){console.log(e)}
}