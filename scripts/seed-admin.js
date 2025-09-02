require('dotenv').config({ path: '.env' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// MongoDB connection string - use the one from .env.local
const MONGODB_URI = process.env.MONGODB_URI;

// Admin user data
const adminUser = {
  email: 'manishdangi272004@gmail.com',
  password: 'Admin@2024#Secure',
  name: 'Manish Dangi',
  role: 'admin',
  createdAt: new Date()
};

async function seedAdmin() {
  try {
    // Check if MongoDB URI is loaded
    if (!MONGODB_URI) {
      console.error('MONGODB_URI not found in environment variables');
      console.error('Make sure you have a .env.local file with MONGODB_URI set');
      return;
    }
    
    console.log('Using MongoDB URI:', MONGODB_URI);
    
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
