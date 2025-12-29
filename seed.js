import mongoose from 'mongoose';
import Product from './src/models/Product.js';
import dotenv from 'dotenv';

dotenv.config();

const seedProducts = [
  {
    name: "Cotton Shirt",
    size: "M",
    mrp: 1200,
    stock: 50
  },
  {
    name: "Jeans",
    size: "32",
    mrp: 1800,
    stock: 30
  },
  {
    name: "T-Shirt",
    size: "L",
    mrp: 600,
    stock: 100
  },
  {
    name: "Jacket",
    size: "XL",
    mrp: 2500,
    stock: 20
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('🌱 Seeding database...');
    
    await Product.deleteMany({});
    await Product.insertMany(seedProducts);
    
    console.log('✅ Database seeded successfully!');
    console.log(`📦 Created ${seedProducts.length} sample products`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();