// Bulk Product Import Script
// Run with: node scripts/bulkImportProducts.js

const { MongoClient } = require('mongodb');
const { v4: uuidv4 } = require('uuid');

// All 600+ products from Excel
const productsData = require('./productData.json'); // We'll create this

async function bulkImport() {
  const client = new MongoClient(process.env.MONGO_URL || 'mongodb://localhost:27017');
  
  try {
    await client.connect();
    const db = client.db('balajee_trade_link');
    
    // Clear existing products
    await db.collection('products').deleteMany({});
    console.log('Cleared existing products');
    
    // Prepare products with UUIDs and image URLs
    const products = productsData.map(product => ({
      id: uuidv4(),
      sku: product.sku || '',
      name: product.name,
      description: product.description || product.name,
      price: parseFloat(product.price) || 0,
      stock: parseInt(product.stock) || 0,
      unitSize: product.unitSize || '',
      category: product.category || 'Other',
      brand: product.brand || '',
      imageUrl: getCategoryImage(product.category),
    }));
    
    // Insert in batches of 100
    const batchSize = 100;
    for (let i = 0; i < products.length; i += batchSize) {
      const batch = products.slice(i, i + batchSize);
      await db.collection('products').insertMany(batch);
      console.log(`Inserted batch ${Math.floor(i / batchSize) + 1}: ${batch.length} products`);
    }
    
    console.log(`✅ Successfully imported ${products.length} products!`);
    
  } catch (error) {
    console.error('Error importing products:', error);
  } finally {
    await client.close();
  }
}

function getCategoryImage(category) {
  const imageMap = {
    'Noodles': 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&h=600&fit=crop',
    'Pickles': 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=600&h=600&fit=crop',
    'Pulses': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&h=600&fit=crop',
    'Snacks': 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=600&h=600&fit=crop',
    'Spices': 'https://images.unsplash.com/photo-1596040033229-a0b3b6087c97?w=600&h=600&fit=crop',
    'Confectioneries': 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=600&h=600&fit=crop',
    'Tea': 'https://images.unsplash.com/photo-1597318130238-c31c2b095f6e?w=600&h=600&fit=crop',
    'Herbs': 'https://images.unsplash.com/photo-1599974364908-a8aa6e9a6c8b?w=600&h=600&fit=crop',
    'Oils': 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&h=600&fit=crop',
    'Beverages': 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=600&h=600&fit=crop',
    'Condiments': 'https://images.unsplash.com/photo-1604999333679-b86d54738315?w=600&h=600&fit=crop',
    'Utensil': 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=600&h=600&fit=crop',
    'Health & Beauty': 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&h=600&fit=crop',
  };
  
  return imageMap[category] || 'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?w=600&h=600&fit=crop';
}

bulkImport();
