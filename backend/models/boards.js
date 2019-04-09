module.exports = async(sequelizeConnection) => {
  try{
    let Sequelize = require("sequelize")
    class Boards extends Sequelize.Model{}
    Boards.init({
      id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
      creator_user_id: {type: Sequelize.INTEGER, allowNull: false},
      title: {type: Sequelize.TEXT, allowNull: false},
    }, {sequelize: sequelizeConnection})

    // await Boards.sync()
    return Boards
  }catch(e){console.log(e)}
}