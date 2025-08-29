const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// MongoDB connection string - update this with your connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/complaint-management';

// Admin user data
const adminUser = {
  email: 'admin@example.com',
  password: 'admin123456',
  name: 'System Administrator',
  role: 'admin',
  createdAt: new Date()
};

async function seedAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if admin user already exists
    const existingAdmin = await mongoose.connection.db.collection('users').findOne({ email: adminUser.email });
    
    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminUser.password, salt);

    // Create admin user
    await mongoose.connection.db.collection('users').insertOne({
      ...adminUser,
      password: hashedPassword
    });

    console.log('Admin user created successfully!');
    console.log('Email:', adminUser.email);
    console.log('Password:', adminUser.password);
    console.log('Role:', adminUser.role);

  } catch (error) {
    console.error('Error seeding admin user:', error);
  } finally {
    // Close connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
}

// Run the seed function
seedAdmin();
