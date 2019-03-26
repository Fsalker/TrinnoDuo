module.exports = async(sequelizeConnection) => {
  try{
    let Sequelize = require("sequelize")
    class boards extends Sequelize.Model{}
    boards.init({
      id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
      user_id: {type: Sequelize.INTEGER, allowNull: false},
      title: {type: Sequelize.TEXT, allowNull: false},
    }, {sequelize: sequelizeConnection})

    await boards.sync()
  }catch(e){console.log(e)}
}