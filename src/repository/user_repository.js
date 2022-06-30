const { Client } = require("pg");

const client = new Client();
client
  .connect()
  .then(() => console.log("Connected to database"))
  .catch((err) => console.error("Connection error", err.stack));

const userRepository = {};

userRepository.create = async function ({ user }) {
  let query = "insert into users (first_name, last_name, email, group_id) ";
  query += "values (";
  query += "$1, $2, $3, (select group_id from groups where group_name = $4)) ";
  query += "returning *";
  const values = [user.firstName, user.lastName, user.email, user.groupName];
  try {
    const newUser = await client.query(query, values);
    return newUser.rows[0];
  } catch (err) {
    console.error(err);
    throw new Error(`Failed to insert user with groupName ${groupName}`);
  }
};

userRepository.updateByEmail = async function ({ email, user, groupName }) {
  let query = "update users set first_name = $1, last_name = $2, email = $3, ";
  query += "group_id = (select group_id from groups where group_name = $4) ";
  query += "where email = $5 returning *";
  const values = [user.firstName, user.lastName, user.email, groupName, email];
  try {
    const updatedUser = await client.query(query, values);
    return updatedUser.rows[0];
  } catch (err) {
    console.error(err);
    throw new Error(
      `Failed to update user ${email} with groupName ${groupName}`
    );
  }
};

userRepository.queryByGroup = async function ({ groupName }) {
  let query = "select * from users where group_id = ";
  query += "(select group_id from groups where group_name = $1)";
  let values = [groupName];
  try {
    const usersArray = await client.query(query, values);
    return usersArray.rows;
  } catch (err) {
    console.error(err);
    throw new Error(`Group name ${groupName} not found`);
  }
};

userRepository.getByEmail = async function ({ email }) {
  let query = "select * from users where email = $1";
  let values = [email];
  try {
    const user = await client.query(query, values);
    return user.rows[0];
  } catch (err) {
    console.error(err);
    throw new Error(`No email found in database - ${email}`);
  }
};

userRepository.get = async function () {
  let query = "select * from users";
  try {
    const usersArray = await client.query(query);
    return usersArray.rows;
  } catch (err) {
    console.error(err);
    throw new Error("Failed to fetch all users");
  }
};

userRepository.delete = async function ({ email }) {
  let query = "delete from users where email = $1";
  const values = [email];
  try {
    await client.query(query, values);
  } catch (err) {
    console.error(err);
    throw new Error(`User by email ${email} not deleted`);
  }
};

module.exports = userRepository;
