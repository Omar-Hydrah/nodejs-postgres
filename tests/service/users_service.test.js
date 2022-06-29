const userService = require("../../src/service/user_service");

describe("Testing the Users Service", () => {
  const user = {
    firstName: "John",
    lastName: "Doe",
    email: "johndoe@email.com",
    groupName: "Support Agents",
  };
  const userRepository = {
    create: jest.fn(),
    delete: jest.fn(),
    updateByEmail: jest.fn(),
    getByEmail: jest.fn(),
    queryByGroup: jest.fn(),
  };
  userRepository.create.mockReturnValueOnce(user);
  userRepository.delete.mockReturnValueOnce(true);
  userRepository.updateByEmail.mockReturnValueOnce(user);
  userRepository.getByEmail.mockReturnValueOnce(user);
  userRepository.queryByGroup.mockReturnValueOnce(new Array(user));
  it("Should create a new user", async () => {
    const newUser = await userService.create(
      { user, groupName: user.groupName },
      { userRepository }
    );
    expect(newUser.email).toEqual(user.email);
    expect(userRepository.create.mock.calls.length).toBe(1);
  });
  it("Should delete a user by his email", async () => {
    await userService.delete({ email }, { userRepository });
    expect(userRepository.delete.mock.calls.length).toBe(1);
  });
  it("Should get a user by his email", async () => {
    const foundUser = await userService.getByEmail(
      { email: user.email },
      { userRepository }
    );
    expect(foundUser.email).toEqual(user.email);
    expect(userRepository.getByEmail.mock.calls.length).toBe(1);
  });
  it("Should update an existing user by its email", async () => {
    const updatedUser = await userService.updatedUser(
      { email: user.email, newUser: user },
      { userRepository }
    );
    expect(updatedUser.email).toEqual(user.email);
    expect(userRepository.updateByEmail.mock.calls.length).toBe(1);
  });
  it("Should query users by their group name", async () => {
    const usersArray = userService.queryByGroup(
      { groupName: user.groupName },
      { userRepository }
    );
    expect(usersArray.length).toBe(1);
    expect(usersArray[0].groupName).toEqual(user.groupName);
  });
});
