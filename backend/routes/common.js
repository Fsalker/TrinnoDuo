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
  createSession: async(Sessions, user) => {
    let crypto = require("crypto")
    let session = crypto.randomBytes(32).toString("hex")
    let S = await Sessions.create({session})
    await S.setUser(user)

    return session
  },
  authentificateUserWithSession: async(Sessions, session) =>
    await Sessions.findOne({where: {session}}),
  authentificateUserWithUsernamePassword: async(Sessions, Users, username, password) => {
    password_hashed = module.exports.hashify()
    // let r = await client.query("SELECT id FROM users WHERE username = $1 AND password = $2", [username, password_hashed])
    let user = await Users.findOne({where: {username, password}})
    if(!user)
      return false
    return await module.exports.createSession(Sessions, user)
  },
  getIdFromSession: async(client, session) => (await client.query("SELECT user_id FROM sessions WHERE session = $1", [session])).rows[0].user_id,
  validateBoardOwnership: async(client, user_id, board_id) => {
    return (await client.query("SELECT id FROM boards WHERE id = $1 AND user_id = $2", [board_id, user_id])).rows.length > 0
  },
  validateBoardParticipation: async(client, user_id, board_id) => {
    return (await client.query("SELECT id FROM user_to_board WHERE user_id = $1 AND board_id = $2", [user_id, board_id])).rows.length > 0
  },
  joinUserIntoBoard: async(client, user_id, board_id) => {
    await client.query("INSERT INTO user_to_board(user_id, board_id) VALUES($1, $2)", [user_id, board_id])
  }
}