import bcrypt from "bcrypt";
import { prisma } from "../../config/database.js";
import { invalidateToken, invalidateAllUserTokens } from "../../services/token.service.js";
// Import the prisma instance from your config file

const registerUser = async (fullName, email, password, phoneNumber, confirmPassword) => {
  const userExists = await prisma.user.findUnique({
    where: { email },
  });

  if (userExists) {
    throw new Error("User already exists");
  }

  if (password !== confirmPassword) {
    throw new Error("Passwords do not match");
  }
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      fullName: fullName,
      email: email,
      password: hashedPassword,
      phoneNumber: phoneNumber,
      isActive: true,
    },
  });

  // Business Logic: Never expose password in response
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: _pwd, ...userWithoutPassword } = user;

  // Return user data only - session will be created in controller/middleware
  return userWithoutPassword;
};

const loginUser = async ({ email, password }) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Invalid Password");
  }
  // Business Logic: Never expose password in response
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: _pwd, ...userWithoutPassword } = user;

  return userWithoutPassword;
};

// Logout from current device (invalidate single token)
const logoutUser = async (token) => {
  return await invalidateToken(token);
};

// Logout from all devices (invalidate all user tokens)
const logoutAllDevices = async (userId) => {
  return await invalidateAllUserTokens(userId);
};

export { registerUser, loginUser, logoutUser, logoutAllDevices };
