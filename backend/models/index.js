module.exports = async(sequelize) => {
  try {
    let readDir = require("util").promisify(require("fs").readdir)

    let modelFiles = (await readDir(__dirname)).filter(fileName => fileName != "index.js")
    let models = []
    for(let modelFile of modelFiles){
      let model = await require(`./${modelFile}`)(sequelize)
      models[model.name] = model
    }
    await models.Sessions.belongsTo(models.Users)
    await models.Boards.belongsToMany(models.Users, {through: "UsersBoards"})
    await models.Users.belongsToMany(models.Boards, {through: "UsersBoards"})
    await models.Lists.belongsTo(models.Boards)
    await models.Cards.belongsTo(models.Lists)
    await sequelize.sync()

    return models
  }catch(e){console.log(e)}
}