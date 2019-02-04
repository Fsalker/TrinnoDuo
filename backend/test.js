'use strict'
let request = require("request-promise-native")
let server = require("./server")
let should = require("chai").should()

describe("CRUD APIs", async() => {
  //
  const HOST = `http://localhost:${process.env.BACKEND_ALTERNATIVE_PORT}`
  const USERNAME_1 = "MARIOZ0R"
  const USERNAME_2 = "LUIGIZ0R"
  const PASSWORD_1 = "S00P3RD00P3R"
  const PASSWORD_2 = "G00MB4ST00MP4"
  const BOARD_TITLE = "Super Duper Boarderino"
  const BOARD_TITLE_NEW = "SUPERER DUPERER BOARDERINOER :D"
  const BOARD_LIST_TITLE = "Boarderino Listerino"
  const BOARD_LIST_TITLE_NEW = "Boarderino Listerino Updated"
  const CARD_TITLE = "Hmmm"
  const CARD_TITLE_NEW = "HMMMmmmm...."
  const CARD_DESCRIPTION = "Hihi"
  const CARD_DESCRIPTION_NEW = "Hihihhhiihihii xd"
  let SESSION_1
  let SESSION_2
  let USER_ID_1
  let USER_ID_2
  let BOARD_ID_1
  let INVITATION_ID
  let BOARD_LIST_ID
  let CARD_ID

  //
  const SESSION_LENGTH = 64

  //
  before(async() => {
    await server()
  })

  // ========[ USERS ]========
  //
  it("Should Delete User 1", async() => {
    let data = {auth: {session: SESSION_1}}
    let r = await request.delete({uri: `${HOST}/users`, json: data})
  })

  it("Should Delete User 2", async() => {
    let data = {auth: {session: SESSION_2}}
    let r = await request.delete({uri: `${HOST}/users`, json: data})
  })

  it("Should Create (Register) User", async() => {
    let data = {username: USERNAME_1, password: PASSWORD_1}
    let r = await request.post({uri: `${HOST}/users`, json: data})
    SESSION_1 = r.session
    USER_ID_1 = r.user_id

    SESSION_1.should.be.a("String")
    SESSION_1.should.have.lengthOf(SESSION_LENGTH)

    USER_ID_1.should.be.a("Number")
  })

  it("Should Create (Register) Second User", async() => {
    let data = {username: USERNAME_2, password: PASSWORD_2}
    let r = await request.post({uri: `${HOST}/users`, json: data})
    SESSION_2 = r.session
    USER_ID_2 = r.user_id

    SESSION_2.should.be.a("String")
    SESSION_2.should.have.lengthOf(SESSION_LENGTH)

    USER_ID_2.should.be.a("Number")
  })

  it("Should Log In User", async() => {
    let data = {username: USERNAME_1, password: PASSWORD_1}
    let r = await request.post({uri: `${HOST}/login`, json: data})

    r.session.should.be.a("String")
    r.session.length.should.equal(SESSION_LENGTH)
    r.user_id.should.be.a("Number")
  })

  it("Should Read Users", async() => {
    let r = await request.get({uri: `${HOST}/users/${SESSION_1}`, json: data})

    r.users.should.be.a("Array")
    r.users.findAll(user => user.username == USERNAME_1 || user.username == USERNAME_2).should.have.lengthOf(2)
  })

  // ========[ BOARDS ]========
  //
  it("Should Create Board", async() => {
    let data = {auth: {session: SESSION_1}, data: {title: BOARD_TITLE}}
    let r = await request.post({uri: `${HOST}/boards`, json: data})
  })

  it("Should Read User 1's Boards (one single board)", async() => {
    let r = await request.get({uri: `${HOST}/boards/${SESSION_1}`})

    r.boards.should.have.lengthOf(1)
    r.boards[0].board_id.should.be.a("Number")
    r.boards[0].title.should.equal(BOARD_TITLE)
    BOARD_ID_1 = r.boards[0].board_id
  })

  it("Should Read User 2's Boards (no boards)", async() => {
    let r = await request.get({uri: `${HOST}/boards/${SESSION_2}`})

    r.boards.should.have.lengthOf(0)
  })

  it("Should Update User 1's Board's Title", async() => {
    let data = {auth: {session: SESSION_1}, data: {board_id: BOARD_ID_1, title: BOARD_TITLE_NEW}}
    let r = await request.PUT({uri: `${HOST}/boards`, json: data})
  })

  it("Should Read User 1's Boards and Board with New Title", async() => {
    let r = await request.get({uri: `${HOST}/boards/${SESSION_1}`})

    r.boards[0].title.should.equal(BOARD_TITLE_NEW)
  })

  // ========[ BOARD INVITATIONS ]========
  //
  it("Should Invite User 2 to User 1's Board", async() => {
    let data = {auth: {session: SESSION_1}, data: {board_id: BOARD_ID_1, username_invitee: USERNAME_2}}
    let r = await request.post({uri: `${HOST}/boardInvitations`, json: data})
  })

  it("Should Delete Board Invitation", async() => {
    let data = {auth: {session: SESSION_1}, data: {invitation_id: INVITATION_ID}}
    let r = await request.delete({uri: `${HOST}/boardInvitations`, json: data})
  })

  it("Should Invite User 2 to User 1's Board", async() => {
    let data = {auth: {session: SESSION_1}, data: {board_id: BOARD_ID_1, username_invitee: USERNAME_2}}
    let r = await request.post({uri: `${HOST}/boardInvitations`, json: data})
  })

  it("Should Read User 2's Board Invitations", async() => {
    let r = await request.get({uri: `${HOST}/boardInvitations/${SESSION_2}`})

    r.invitation_id.should.be.a("Number")
    INVITATION_ID = r.invitation_id
  })

  it("Should Decline User 1's Board Invitation", async() => {
    let data = {auth: {session: SESSION_2}, data: {invitation_id: INVITATION_ID, accepting: false}}
    let r = await request.put({uri: `${HOST}/boards`, json: data})
  })

  it("Should Invite User 2 to User 1's Board", async() => {
    let data = {auth: {session: SESSION_1}, data: {board_id: BOARD_ID_1, username_invitee: USERNAME_2}}
    let r = await request.post({uri: `${HOST}/boardInvitations`, json: data})
  })

  it("Should Not Invite User 2 to User 1's Board Twice", async() => {
    let data = {auth: {session: SESSION_1}, data: {board_id: BOARD_ID_1, username_invitee: USERNAME_2}}
    let r = await request.post({uri: `${HOST}/boardInvitations`, json: data})
    // [FIXME] Catch 409 here!
  })

  it("Should Read User 2's Board Invitations", async() => {
    let r = await request.get({uri: `${HOST}/boardInvitations/${SESSION_1}`})

    r.invitation_id.should.be.a("Number")
    INVITATION_ID = r.invitation_id
  })

  it("Should Accept User 1's Board Invitation", async() => {
    let data = {auth: {session: SESSION_2}, data: {invitation_id: INVITATION_ID, accepting: true}}
    let r = await request.put({uri: `${HOST}/boardInvitations`, json: data})
  })

  // ========[ BOARDLISTS ]========
  //
  it("Should Create BoardList for Board 1", async() => {
    let data = {auth: {session: SESSION_1}, data: {board_list_id: BOARD_LIST_ID, title: BOARD_LIST_TITLE}}
    let r = await request.post({uri: `${HOST}/boardLists`, json: data})

    r.board_list_id.should.be.a("Number")
    BOARD_LIST_ID = r.board_list_id
  })

  it("Should Update BoardList", async() => {
    let data = {auth: {session: SESSION_1}, data: {board_list_id: BOARD_LIST_ID, title: BOARD_LIST_TITLE_NEW}}
    let r = await request.put({uri: `${HOST}/boardLists`, json: data})
  })

  it("Should Read BoardLists and BoardList 1 with new title", async() => {
    let r = await request.get({uri: `${HOST}/boardLists/${SESSION_1}/${BOARD_ID}`})

    r.board_lists.should.have.lengthOf(1)
    r.board_lists[0].title.should.equal(BOARD_LIST_TITLE_NEW)
  })

  // ========[ CARDS ]========
  //
  it("Should Create Card for Board 1's BoardList", async() => {
    let data = {auth: {session: SESSION_1}, data: {board_list_id: BOARD_ID_1, title: CARD_TITLE, description: CARD_DESCRIPTION}}
    let r = await request.post({uri: `${HOST}/cards`, json: data})

    r.card_id.should.be.a("Number")
    CARD_ID = r.card_id
  })

  it("Should Update Card", async() => {
    let data = {auth: {session: SESSION_1}, data: {card_id: CARD_ID, title: CARD_TITLE_NEW, description: CARD_DESCRIPTION_NEW}}
    let r = await request.put({uri: `${HOST}/cards`, json: data})
  })

  it("Should Read Cards and Card with updated Title & Description", async() => {
    let r = await request.get({uri: `${HOST}/cards/${SESSION_1}`, json: data})

    r.cards.should.have.lengthOf(1)
    r.cards[0].title.should.equal(CARD_TITLE_NEW)
    r.cards[0].description.should.equal(CARD_DESCRIPTION_NEW)
  })

  // ========[ USERS, BOARDS, BOARD-LISTS, CARDS /get/id ]========
  //

  // ========[ USERS, BOARDS, BOARD-LISTS /deletion ]========
  //
  it("Should Delete Card 1", async () => {
    let data = {auth: {session: SESSION_1}, data: {card_id: CARD_ID}}
    let r = await request.delete({uri: `${HOST}/cards`, json: data})
  })

  it("Should Board 1's BoardList", async () => {
    let data = {auth: {session: SESSION_1}, data: {board_list_id: BOARD_LIST_ID}}
    let r = await request.delete({uri: `${HOST}/boardLists`, json: data})
  })

  it("Should Delete User 1's Board", async () => {
    let data = {auth: {session: SESSION_1}, data: {board_id: BOARD_ID_1}}
    let r = await request.delete({uri: `${HOST}/boards`, json: data})
  })

  it("Should Delete User 1", async() => {
    let data = {auth: {session: SESSION_1}}
    let r = await request.delete({uri: `${HOST}/users`, json: data})
  })

  it("Should Delete User 2", async() => {
    let data = {auth: {session: SESSION_2}}
    let r = await request.delete({uri: `${HOST}/users`, json: data})
  })
})