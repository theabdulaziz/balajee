/**
 * Definitive Product Import Script for Balajee Trade Link
 * Imports exactly 576 products from Excel with dual-warehouse pricing
 */

const { MongoClient } = require('mongodb');
const { v4: uuidv4 } = require('uuid');
const xlsx = require('xlsx');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const EXCEL_FILE_PATH = path.join(__dirname, '..', 'Report_from_Balajee_Trade_Link_LLC.xlsx');

// Warehouse pricing configuration
const WAREHOUSE_CONFIG = {
  maspeth: {
    basePrice: 12.00,  // Slightly higher for Maspeth
    baseQuantity: 120
  },
  jessup: {
    basePrice: 10.00,
    baseQuantity: 80
  }
};

async function importProducts() {
  let client;
  
  try {
    console.log('🚀 Starting product import for Balajee Trade Link...\n');
    
    // Step 1: Read Excel file
    console.log('📖 Reading Excel file...');
    const workbook = xlsx.readFile(EXCEL_FILE_PATH);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const rawData = xlsx.utils.sheet_to_json(worksheet);
    
    console.log(`✓ Found ${rawData.length} rows in Excel file\n`);
    
    if (rawData.length !== 576) {
      console.error(`❌ ERROR: Expected 576 products but found ${rawData.length}`);
      process.exit(1);
    }
    
    // Step 2: Transform data to match our schema
    console.log('🔄 Transforming product data...');
    const products = rawData.map((row, index) => {
      const sku = String(row['Item'] || '').trim();
      const name = String(row['Description'] || '').trim();
      const category = String(row['Category'] || 'Uncategorized').trim();
      
      if (!sku || !name) {
        console.warn(`⚠️  Warning: Row ${index + 1} missing SKU or Name - SKU: "${sku}", Name: "${name}"`);
      }
      
      return {
        id: uuidv4(),
        sku: sku,
        name: name,
        description: name, // Use name as description
        category: category,
        brand: '',
        unitSize: '',
        maspethPrice: WAREHOUSE_CONFIG.maspeth.basePrice,
        maspethQuantity: WAREHOUSE_CONFIG.maspeth.baseQuantity,
        jessupPrice: WAREHOUSE_CONFIG.jessup.basePrice,
        jessupQuantity: WAREHOUSE_CONFIG.jessup.baseQuantity,
        imageUrl: '',
        // Backward compatibility fields
        price: WAREHOUSE_CONFIG.maspeth.basePrice,
        stock: WAREHOUSE_CONFIG.maspeth.baseQuantity,
        createdAt: new Date(),
      };
    });
    
    console.log(`✓ Transformed ${products.length} products\n`);
    
    // Display sample products
    console.log('📦 Sample Products (First 3):');
    products.slice(0, 3).forEach((p, i) => {
      console.log(`  ${i + 1}. SKU: ${p.sku} | Name: ${p.name.substring(0, 50)}${p.name.length > 50 ? '...' : ''} | Category: ${p.category}`);
    });
    console.log('');
    
    // Step 3: Connect to MongoDB
    console.log('🔌 Connecting to MongoDB...');
    const mongoUrl = process.env.MONGO_URL;
    const dbName = process.env.DB_NAME || 'balajee_trade_link';
    
    if (!mongoUrl) {
      throw new Error('MONGO_URL not found in environment variables');
    }
    
    client = new MongoClient(mongoUrl);
    await client.connect();
    const db = client.db(dbName);
    console.log(`✓ Connected to database: ${dbName}\n`);
    
    // Step 4: Clear existing products
    console.log('🗑️  Clearing existing products...');
    const deleteResult = await db.collection('products').deleteMany({});
    console.log(`✓ Deleted ${deleteResult.deletedCount} existing products\n`);
    
    // Step 5: Insert new products
    console.log('💾 Inserting 576 products...');
    const insertResult = await db.collection('products').insertMany(products);
    console.log(`✓ Successfully inserted ${insertResult.insertedCount} products\n`);
    
    // Step 6: Verify import
    console.log('✅ Verifying import...');
    const count = await db.collection('products').countDocuments();
    console.log(`✓ Total products in database: ${count}`);
    
    // Get category breakdown
    const categories = await db.collection('products').aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]).toArray();
    
    console.log('\n📊 Products by Category:');
    categories.forEach(cat => {
      console.log(`  ${cat._id}: ${cat.count} products`);
    });
    
    console.log('\n🎉 Product import completed successfully!');
    console.log(`\n📈 Summary:`);
    console.log(`   • Total products: ${count}`);
    console.log(`   • Maspeth pricing: $${WAREHOUSE_CONFIG.maspeth.basePrice} (${WAREHOUSE_CONFIG.maspeth.baseQuantity} units)`);
    console.log(`   • Jessup pricing: $${WAREHOUSE_CONFIG.jessup.basePrice} (${WAREHOUSE_CONFIG.jessup.baseQuantity} units)`);
    
  } catch (error) {
    console.error('\n❌ Error during import:', error.message);
    console.error(error);
    process.exit(1);
  } finally {
    if (client) {
      await client.close();
      console.log('\n🔌 Database connection closed');
    }
  }
}

// Run the import
importProducts();
