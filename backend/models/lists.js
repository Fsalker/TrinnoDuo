module.exports = async(sequelizeConnection) => {
  try{
    let Sequelize = require("sequelize")
    class Lists extends Sequelize.Model{}
    Lists.init({
      id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
      title: {type: Sequelize.TEXT, allowNull: false},
    }, {sequelize: sequelizeConnection})

    // await Lists.sync()
    return Lists
  }catch(e){console.log(e)}
}