module.exports = {
  initialiseDatabase: async(client) => {
    await client.query(`DROP TABLE IF EXISTS users`)
    await client.query(`DROP TABLE IF EXISTS boards`)
    await client.query(`DROP TABLE IF EXISTS board_lists`)
    await client.query(`DROP TABLE IF EXISTS cards`)
    await client.query(`DROP TABLE IF EXISTS user_to_board`)

    await client.query(`CREATE TABLE users(
      id SERIAL PRIMARY KEY,
      username TEXT NOT NULL,
      password TEXT NOT NULL,
      creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`)

    await client.query(`CREATE TABLE boards(
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`)

    await client.query(`CREATE TABLE board_lists(
      id SERIAL PRIMARY KEY,
      board_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`)

    await client.query(`CREATE TABLE cards(
      id SERIAL PRIMARY KEY,
      board_list_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`)

    await client.query(`CREATE TABLE user_to_board(
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL,
      board_id INTEGER NOT NULL,
      creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`)
  }
}