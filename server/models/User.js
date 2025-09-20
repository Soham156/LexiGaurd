const bcrypt = require("bcryptjs");

class User {
  constructor(userData) {
    this.id = userData.id || this.generateId();
    this.name = userData.name;
    this.email = userData.email?.toLowerCase()?.trim();
    this.password = userData.password;
    this.role = userData.role || "user";
    this.isVerified = userData.isVerified || false;
    this.createdAt = userData.createdAt || new Date();
    this.updatedAt = userData.updatedAt || new Date();
  }

  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Validate user data
  validate() {
    const errors = [];

    if (!this.name || this.name.trim().length === 0) {
      errors.push("Name is required");
    }
    if (this.name && this.name.length > 100) {
      errors.push("Name cannot exceed 100 characters");
    }

    if (!this.email || this.email.trim().length === 0) {
      errors.push("Email is required");
    }
    if (
      this.email &&
      !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(this.email)
    ) {
      errors.push("Please provide a valid email");
    }

    if (!this.password || this.password.length < 6) {
      errors.push("Password must be at least 6 characters");
    }

    if (!["user", "admin"].includes(this.role)) {
      errors.push("Role must be either 'user' or 'admin'");
    }

    return errors;
  }

  // Hash password
  async hashPassword() {
    if (this.password) {
      const salt = await bcrypt.genSalt(12);
      this.password = await bcrypt.hash(this.password, salt);
    }
  }

  // Compare password
  async comparePassword(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
  }

  // Update timestamp
  updateTimestamp() {
    this.updatedAt = new Date();
  }

  // Convert to JSON (excluding password)
  toJSON() {
    const { password, ...userWithoutPassword } = this;
    return userWithoutPassword;
  }
}

// In-memory storage for demonstration (replace with actual database later)
class UserStorage {
  constructor() {
    this.users = new Map();
  }

  async create(userData) {
    const user = new User(userData);
    const errors = user.validate();

    if (errors.length > 0) {
      throw new Error(errors.join(", "));
    }

    // Check if email already exists
    if (this.findByEmail(user.email)) {
      throw new Error("Email already exists");
    }

    await user.hashPassword();
    this.users.set(user.id, user);
    return user;
  }

  findById(id) {
    return this.users.get(id);
  }

  findByEmail(email) {
    return Array.from(this.users.values()).find(
      (user) => user.email === email?.toLowerCase()?.trim()
    );
  }

  update(id, updateData) {
    const user = this.users.get(id);
    if (!user) return null;

    Object.assign(user, updateData);
    user.updateTimestamp();
    return user;
  }

  delete(id) {
    return this.users.delete(id);
  }

  getAll() {
    return Array.from(this.users.values());
  }
}

// Export singleton instance
const userStorage = new UserStorage();

module.exports = { User, UserStorage: userStorage };
