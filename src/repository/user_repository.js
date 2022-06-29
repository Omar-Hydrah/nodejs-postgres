const { Client } = require("pg");

const client = new Client({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
});

const userRepository = {};

userRepository.create = async function ({ user, groupName }) {
  let query = "insert into users (first_name, last_name, email, group_id) ";
  query += "values (";
  query += "$1, $2, $3, (select group_id from grops where group_name = '$4')) ";
  query += "returning *";
  const values = [user.firstName, user.lastName, user.email, groupName];
  try {
    const newUser = await client.query(query, values);
    return newUser;
  } catch (err) {
    throw new Error(`Failed to insert user with groupName ${groupName}`);
  }
};

userRepository.updateByEmail = async function ({ email, newUser, groupName }) {
  let query = "update users set first_name = $1, last_name = $2, email = $3 ";
  query += "group_id = (select group_id from groups where group_name = '$4') ";
  query += "where email = $5";
  const values = [
    newUser.firstName,
    newUser.lastName,
    newUser.email,
    groupName,
    email,
  ];
  try {
    await client.query(query, values);
  } catch (err) {
    throw new Error(
      `Failed to update user ${email} with groupName ${groupName}`
    );
  }
};

userRepository.queryByGroup = async function ({ groupName }) {
  let query = "select * from users where group_id = ";
  query += "(select group_id from grops where group_name = $1)";
  let values = [groupName];
  try {
    const usersArray = await client.query(query, values);
    return usersArray;
  } catch (err) {
    throw new Error(`Group name ${groupName} not found`);
  }
};

userRepository.getByEmail = async function ({ email }) {
  let query = "select * from users where email = $1";
  let values = [email];
  try {
    const user = await client.query(query, values);
    return user;
  } catch (err) {
    throw new Error(`No email found in database - ${email}`);
  }
};

userRepository.delete = async function ({ email }) {
  let query = "delete from users where email = $1";
  const values = [email];
  try {
    await client.query(query, values);
  } catch (err) {
    throw new Error(`User by email ${email} not deleted`);
  }
};

module.exports = userRepository;
