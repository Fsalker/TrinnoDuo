module.exports = async(sequelizeConnection) => {
  try {
    let readDir = require("util").promisify(require("fs").readdir)

    let models = (await readDir(__dirname)).filter(fileName => fileName != "index.js")
    for(let model of models){
      await require(`./${model}`)(sequelizeConnection)
    }
  }catch(e){console.log(e)}
}