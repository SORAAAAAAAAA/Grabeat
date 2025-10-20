async function validateLogin(req, res, next) {
  const { email, password } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  if (!password) {
    return res.status(400).json({ error: "Password is required" });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  next();
}

async function validateRegister(req, res, next) {
  const { fullName, email, password, confirmPassword, phoneNumber } = req.body;

  if (!fullName) {
    return res.status(400).json({ error: "Full Name is required" });
  }

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  if (!password) {
    return res.status(400).json({ error: "Password is required" });
  }

  if (!confirmPassword) {
    return res.status(400).json({ error: "Confirm Password is required" });
  }

  if (!phoneNumber) {
    return res.status(400).json({ error: "Phone Number is required" });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  if (password.length < 8) {
    return res.status(400).json({ error: "Password must be at least 8 characters" });
  }

  next();
}

export { validateLogin, validateRegister };
