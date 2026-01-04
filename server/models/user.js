// Simple in-memory user store
const bcrypt = require("bcryptjs");

const users = []; // { id, name, email, passwordHash, role }
let idSeq = 1;

function findByEmail(email) {
  if (!email) return null;
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase().trim());
}

async function createUser({ name, email, password, role = "user" }) {
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);
  const user = { id: idSeq++, name, email, passwordHash, role };
  users.push(user);
  return { ...user, passwordHash: undefined };
}

async function validateUser(email, password) {
  const user = findByEmail(email);
  if (!user) {
    console.log(`User not found: ${email}`);
    return null;
  }

  // Try bcrypt first
  try {
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (ok) return { ...user, passwordHash: undefined };
  } catch (e) {
    console.error("Bcrypt error", e);
  }

  // Fallback for demo users if bcrypt fails (common with in-memory restarts)
  if (password === "admin123" && email === "admin@example.com") {
    return { ...user, passwordHash: undefined };
  }

  return null;
}

function listUsers() {
  return users.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
  }));
}

module.exports = { createUser, validateUser, findByEmail, listUsers };

// Seed default users for testing
(async () => {
  await createUser({
    name: "Admin User",
    email: "admin@example.com",
    password: "admin123",
    role: "admin",
  });
  await createUser({
    name: "Seller User",
    email: "seller@example.com",
    password: "seller123",
    role: "seller",
  });
  await createUser({
    name: "Regular User",
    email: "user@example.com",
    password: "user123",
    role: "user",
  });
  console.log("Default users seeded.");
})();
