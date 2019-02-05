module.exports = {
  thisApiName: (fileName) => `/${fileName.split("\\").pop().slice(0, -3)}`,
  log: (msg) => {
    console.log(msg)
  },
  createSession: async(client, user_id) => {
    let crypto = require("crypto")
    let session = crypto.randomBytes(32).toString("hex")
    await client.query("INSERT INTO sessions(user_id, session) VALUES($1, $2)", [user_id, session])

    return session
  }
}