module.exports = async(sequelizeConnection) => {
  try{
    let Sequelize = require("sequelize")
    class Users extends Sequelize.Model{}
    Users.init({
      id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
      username: {type: Sequelize.TEXT, allowNull: false, unique: true},
      password: {type: Sequelize.TEXT, allowNull: false},
    }, {sequelize: sequelizeConnection})

    // await Users.sync()
    // await users.create({username: "adalgizaa", password: "123"})
    return Users
  }catch(e){console.log(e)}
}