module.exports = async(sequelizeConnection) => {
  try{
    let Sequelize = require("sequelize")
    class user_to_board extends Sequelize.Model{}
    user_to_board.init({
      id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
      user_id: {type: Sequelize.INTEGER, allowNull: false, unique: "compositeIndex"},
      board_id: {type: Sequelize.INTEGER, allowNull: false, unique: "compositeIndex"},
    }, {sequelize: sequelizeConnection})

    await user_to_board.sync()
  }catch(e){console.log(e)}
}