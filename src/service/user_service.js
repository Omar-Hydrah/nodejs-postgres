const userService = {};

userService.create = async function ({ user, groupName }, { userRepository }) {
  try {
    const newUser = await userRepository.create({ user, groupName });
    return newUser;
  } catch (err) {
    throw err;
  }
};
userService.delete = async function ({ email }, { userRepository }) {
  try {
    await userRepository.delete({ email });
  } catch (err) {
    throw err;
  }
};
userService.getByEmail = async function ({ email }, { userRepository }) {
  try {
    const user = await userRepository.getByEmail({ email });
    return user;
  } catch (err) {
    throw err;
  }
};
userService.update = async function ({ email, newUser }, { userRepository }) {
  try {
    const user = await userRepository.updateByEmail({ email, newUser });
    return user;
  } catch (err) {
    throw err;
  }
};
userService.queryByGroup = async function ({ groupName }, { userRepository }) {
  try {
    const usersArray = await userRepository.queryByGroup({ groupName });
    return usersArray;
  } catch (err) {
    throw err;
  }
};

userService.get = async function () {
  try {
    const usersArray = await userRepository.get();
    return usersArray;
  } catch (err) {
    throw err;
  }
};

module.exports = userService;
