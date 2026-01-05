const bcrypt = require('bcryptjs');
const { db } = require('../db');
const { users } = require('../db/schema');
const { eq } = require('drizzle-orm');

// Find user by email
async function findByEmail(email) {
  if (!email) return null;

  try {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.email, email.toLowerCase().trim()))
      .limit(1);

    return result[0] || null;
  } catch (error) {
    console.error('Error finding user by email:', error);
    throw error;
  }
}

// Create a new user
async function createUser({ name, email, password, role = 'user' }) {
  try {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const result = await db
      .insert(users)
      .values({
        name,
        email: email.toLowerCase().trim(),
        passwordHash,
        role,
        isActive: true,
        phone: '',
        address: '',
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
      })
      .returning();

    const user = result[0];
    return { ...user, passwordHash: undefined };
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

// Validate user credentials
async function validateUser(email, password) {
  try {
    const user = await findByEmail(email);

    if (!user) {
      console.log(`User not found: ${email}`);
      return null;
    }

    if (!user.isActive) {
      console.log(`User inactive: ${email}`);
      return null;
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.passwordHash);

    if (!isValid) {
      return null;
    }

    // Update last login
    await db
      .update(users)
      .set({ lastLogin: new Date() })
      .where(eq(users.id, user.id));

    return { ...user, passwordHash: undefined };
  } catch (error) {
    console.error('Error validating user:', error);
    throw error;
  }
}

// Find user by ID
async function findById(id) {
  try {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.id, Number(id)))
      .limit(1);

    return result[0] || null;
  } catch (error) {
    console.error('Error finding user by ID:', error);
    throw error;
  }
}

// Update user
async function updateUser(id, patch) {
  try {
    const result = await db
      .update(users)
      .set({ ...patch, updatedAt: new Date() })
      .where(eq(users.id, Number(id)))
      .returning();

    const user = result[0];
    if (!user) return null;

    return { ...user, passwordHash: undefined };
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
}

// List all users
async function listUsers() {
  try {
    const result = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        isActive: users.isActive,
        lastLogin: users.lastLogin,
      })
      .from(users);

    return result;
  } catch (error) {
    console.error('Error listing users:', error);
    throw error;
  }
}

module.exports = {
  createUser,
  validateUser,
  findByEmail,
  findById,
  listUsers,
  updateUser,
};
