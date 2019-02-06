require("dotenv").config()

module.exports = {
  getApiNameFromFile: (fileName) => `/${fileName.split("\\").pop().slice(0, -3)}`,
  log: (msg) => {
    if(process.env.SUPPRESS_LOGS)
      return

    let d = new Date();
    let date_now = "[" + d.getFullYear() + "/" + ("0" + d.getMonth()).slice(-2) + "/" +  ("0" + d.getDate()).slice(-2) + " - "+("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2) + ":" + ("0" + d.getSeconds()).slice(-2) + "] "

    let stream = require("fs").createWriteStream("./backend/log.txt", {flags: "a"})
    stream.write(date_now + msg + "\n")
    stream.end()

    console.log(msg)
  },
  hashify: (word) => require("crypto").createHash("sha256").update(word).digest("hex"),
  createSession: async(client, user_id) => {
    let crypto = require("crypto")
    let session = crypto.randomBytes(32).toString("hex")
    await client.query("INSERT INTO sessions(user_id, session) VALUES($1, $2)", [user_id, session])

    return session
  },
  authentificateUserWithSession: async(client, session) =>
    (await client.query("SELECT id FROM sessions WHERE session = $1", [session])).rows.length > 0,
  authentificateUserWithUsernamePassword: async(client, username, password) => {
    password_hashed = module.exports.hashify()
    let r = await client.query("SELECT id FROM users WHERE username = $1 AND password = $2", [username, password_hashed])
    if(r.rows.length == 0)
      return false

    let user_id = r.rows[0].id
    return await module.exports.createSession(client, user_id)
  },
  getIdFromSession: async(client, session) => (await client.query("SELECT user_id FROM sessions WHERE session = $1", [session])).rows[0].user_id
}