const router = require("express").Router();
const userService = require("../service/user_service");
const userRepository = require("../repository/user_repository");

function validateUserFields(req, res, next) {
  if (
    !req.body.firstName ||
    !req.body.lastName ||
    !req.body.groupName ||
    !req.body.email
  ) {
    res.status(422);
    return res.send(
      "firstName, lastName, email and groupName are required fields"
    );
  }
  return next();
}

function getUserFromRequestBody(requestBody) {
  return {
    firstName: requestBody.firstName,
    lastName: requestBody.lastName,
    groupName: requestBody.groupName,
    email: requestBody.email,
  };
}

router.post("/", validateUserFields, async (req, res) => {
  const user = getUserFromRequestBody(req.body);
  try {
    await userService.create({ user }, { userRepository });
    return res.send("User created");
  } catch (err) {
    console.error(err);
    res.status(400);
    return res.send("Failed to create user");
  }
});

router.put("/", validateUserFields, async (req, res) => {
  const user = getUserFromRequestBody(req.body);
  try {
    const updatedUser = await userService.update(
      { email: user.email, user, groupName: user.groupName },
      { userRepository }
    );
    return updatedUser
      ? res.json(updatedUser)
      : res.send("Failed to updated user");
  } catch (err) {
    console.error(err);
    res.status(400);
    return res.send("Failed to update user");
  }
});

router.delete("/", async (req, res) => {
  if (!req.body.email) {
    res.status(422);
    return res.send("Field 'email' is a required field");
  }
  try {
    await userService.delete({ email: req.body.email }, { userRepository });
    return res.send("User deleted");
  } catch (err) {
    console.error(err);
    res.status(400);
    return res.send("Failed to delete user");
  }
});

router.get("/", async (req, res) => {
  try {
    const usersArray = await userService.get({ userRepository });
    return res.json(usersArray);
  } catch (err) {
    console.error(err);
    res.status(400);
    return res.send("Failed to get users");
  }
});

router.get("/by-group-name/:groupName", async (req, res) => {
  try {
    const usersArray = await userService.queryByGroup(
      {
        groupName: req.params.groupName,
      },
      { userRepository }
    );
    return res.json(usersArray);
  } catch (err) {
    console.error(err);
    res.status(400);
    return res.send("Failed to get groups");
  }
});

router.get("/:email", async (req, res) => {
  try {
    const user = await userService.getByEmail(
      { email: req.params.email },
      { userRepository }
    );
    return res.json(user);
  } catch (err) {
    console.error(err);
    res.status(400);
    return res.send(`Failed to find ${email}`);
  }
});

module.exports = router;
