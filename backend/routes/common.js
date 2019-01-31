module.exports = {
  thisApiName: (fileName) => `/${fileName.split("\\").pop().slice(0, -3)}`,
  log: (msg) => {
    console.log(msg)
  }
}