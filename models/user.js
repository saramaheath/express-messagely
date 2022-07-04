"use strict";

/** User of the site. */

const { NotFoundError } = require("../expressError");
const db = require("../db");
const bcrypt = require("bcrypt");

class User {
  /** Register new user. Returns
   *    {username, password, first_name, last_name, phone}
   */

  static async register({ username, password, first_name, last_name, phone }) {
	const result = await db.query(
      `INSERT INTO users (username,
							password, 
							first_name, 
							last_name,
							phone,
							join_at)
				VALUES ($1, $2, $3, $4, $5, current_timestamp)
				RETURNING username, password, first_name, last_name, phone)`,
      [username, password, first_name, last_name, phone]
    );

	const user = result.rows[0];
	return new User(user);
  }

  /** Authenticate: is username/password valid? Returns boolean. */

  static async authenticate(username, password) {
	const result = await db.query(
		`SELECT username, password
			FROM users
			WHERE username = $1 AND password = $2`,
			[username, password]
	);
	const user = result.rows[0];
	if (!user){
		return false;
	}
	return true;
  }

  /** Update last_login_at for user
   * TODO: current timestamp to add timezone
   */
  static async updateLoginTimestamp(username) {
	const result = await db.query(
		`UPDATE users
			SET last_login_at = current_timestamp
			WHERE username = $1
			RETURNING last_login_at`,
			[username]
	);

	const user = result.rows[0];
	if (!user) throw new NotFoundError(`No such user: ${username}`);
	return user.last_login_at; 
  }

  /** All: basic info on all users:
   * [{username, first_name, last_name}, ...] */

  static async all() {}

  /** Get: get user by username
   *
   * returns {username,
   *          first_name,
   *          last_name,
   *          phone,
   *          join_at,
   *          last_login_at } */

  static async get(username) {}

  /** Return messages from this user.
   *
   * [{id, to_user, body, sent_at, read_at}]
   *
   * where to_user is
   *   {username, first_name, last_name, phone}
   */

  static async messagesFrom(username) {}

  /** Return messages to this user.
   *
   * [{id, from_user, body, sent_at, read_at}]
   *
   * where from_user is
   *   {id, first_name, last_name, phone}
   */

  static async messagesTo(username) {}
}

module.exports = User;
