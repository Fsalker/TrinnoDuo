module.exports = async(sequelizeConnection) => {
  try{
    let Sequelize = require("sequelize")
    class users extends Sequelize.Model{}
    users.init({
      id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
      username: {type: Sequelize.TEXT, allowNull: false, unique: true},
      password: {type: Sequelize.TEXT, allowNull: false},
    }, {sequelize: sequelizeConnection})

    await users.sync()
    // await users.create({username: "adalgizaa", password: "123"})
  }catch(e){console.log(e)}
}