import { MongoClient } from 'mongodb';
import { v4 as uuidv4 } from 'uuid';
import { NextResponse } from 'next/server';
import { hashPassword, comparePassword, generateToken, verifyToken, getTokenFromHeader } from '@/lib/auth';

// MongoDB connection
let client;
let db;

async function connectToMongo() {
  if (!client) {
    client = new MongoClient(process.env.MONGO_URL);
    await client.connect();
    db = client.db('balajee_trade_link');
  }
  return db;
}

// Helper function to handle CORS
function handleCORS(response) {
  response.headers.set('Access-Control-Allow-Origin', process.env.CORS_ORIGINS || '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  return response;
}

// OPTIONS handler for CORS
export async function OPTIONS() {
  return handleCORS(new NextResponse(null, { status: 200 }));
}

// Seed initial data
async function seedData(db) {
  const productsCount = await db.collection('products').countDocuments();
  
  if (productsCount === 0) {
    const sampleProducts = [
      {
        id: uuidv4(),
        name: 'Wai Wai Instant Noodles - Chicken',
        description: 'Authentic Nepalese instant noodles with chicken flavor',
        price: 24.99,
        stock: 100,
        category: 'Noodles',
        brand: 'Wai Wai',
        imageUrl: 'https://images.unsplash.com/photo-1762898842219-ca8136061b76?w=400',
      },
      {
        id: uuidv4(),
        name: 'Rum Pum Potato Chips',
        description: 'Crispy potato chips with authentic spices',
        price: 18.50,
        stock: 150,
        category: 'Snacks',
        brand: 'Rum Pum',
        imageUrl: 'https://images.unsplash.com/photo-1758346973244-4979d432025a?w=400',
      },
      {
        id: uuidv4(),
        name: 'Current Noodles - Masala',
        description: 'Spicy masala flavored instant noodles',
        price: 22.99,
        stock: 120,
        category: 'Noodles',
        brand: 'Current',
        imageUrl: 'https://images.unsplash.com/photo-1762898842219-ca8136061b76?w=400',
      },
      {
        id: uuidv4(),
        name: 'Druk Momo Sauce',
        description: 'Traditional Bhutanese momo dipping sauce',
        price: 12.99,
        stock: 80,
        category: 'Condiments',
        brand: 'Druk',
        imageUrl: 'https://images.pexels.com/photos/17390914/pexels-photo-17390914.jpeg?w=400',
      },
      {
        id: uuidv4(),
        name: 'Rato Bhale Mixed Pickles',
        description: 'Traditional Nepalese mixed vegetable pickle',
        price: 15.99,
        stock: 60,
        category: 'Pickles',
        brand: 'Rato Bhale',
        imageUrl: 'https://images.pexels.com/photos/13220344/pexels-photo-13220344.jpeg?w=400',
      },
      {
        id: uuidv4(),
        name: 'Aama Ko Achar - Mango',
        description: 'Homestyle mango pickle with authentic spices',
        price: 14.50,
        stock: 90,
        category: 'Pickles',
        brand: 'Aama Ko Achar',
        imageUrl: 'https://images.pexels.com/photos/15014921/pexels-photo-15014921.jpeg?w=400',
      },
      {
        id: uuidv4(),
        name: 'Basmati Rice Premium',
        description: 'Long grain aromatic basmati rice - 25lb bag',
        price: 45.99,
        stock: 50,
        category: 'Rice',
        brand: 'Premium Select',
        imageUrl: 'https://images.unsplash.com/photo-1641470787994-3f4dfd90d7d4?w=400',
      },
      {
        id: uuidv4(),
        name: 'Wai Wai Noodles - Vegetable',
        description: 'Vegetarian instant noodles with mixed vegetables',
        price: 23.99,
        stock: 110,
        category: 'Noodles',
        brand: 'Wai Wai',
        imageUrl: 'https://images.unsplash.com/photo-1762898842219-ca8136061b76?w=400',
      },
      {
        id: uuidv4(),
        name: 'Druk Cheese Balls',
        description: 'Crunchy cheese-flavored snack balls',
        price: 16.99,
        stock: 70,
        category: 'Snacks',
        brand: 'Druk',
        imageUrl: 'https://images.unsplash.com/photo-1758346973244-4979d432025a?w=400',
      },
    ];

    await db.collection('products').insertMany(sampleProducts);
    console.log('Seeded sample products');
  }

  // Create admin user if doesn't exist
  const adminUser = await db.collection('users').findOne({ email: 'admin@balajee.com' });
  if (!adminUser) {
    await db.collection('users').insertOne({
      id: uuidv4(),
      name: 'Admin User',
      email: 'admin@balajee.com',
      password: hashPassword('admin123'),
      role: 'admin',
      company: 'Balajee Trade Link',
      createdAt: new Date(),
    });
    console.log('Created admin user: admin@balajee.com / admin123');
  }
}

// Route handler function
async function handleRoute(request, { params }) {
  const { path = [] } = params;
  const route = `/${path.join('/')}`;
  const method = request.method;

  try {
    const db = await connectToMongo();
    
    // Seed data on first request
    await seedData(db);

    // ==================== AUTH ROUTES ====================
    
    // POST /api/auth/signup
    if (route === '/auth/signup' && method === 'POST') {
      const body = await request.json();
      const { name, email, password, company } = body;

      if (!name || !email || !password) {
        return handleCORS(NextResponse.json({ error: 'Missing required fields' }, { status: 400 }));
      }

      const existingUser = await db.collection('users').findOne({ email });
      if (existingUser) {
        return handleCORS(NextResponse.json({ error: 'Email already exists' }, { status: 400 }));
      }

      const user = {
        id: uuidv4(),
        name,
        email,
        password: hashPassword(password),
        role: 'customer',
        company: company || '',
        createdAt: new Date(),
      };

      await db.collection('users').insertOne(user);

      const token = generateToken(user);
      const { password: _, ...userWithoutPassword } = user;

      return handleCORS(NextResponse.json({ token, user: userWithoutPassword }));
    }

    // POST /api/auth/login
    if (route === '/auth/login' && method === 'POST') {
      const body = await request.json();
      const { email, password } = body;

      if (!email || !password) {
        return handleCORS(NextResponse.json({ error: 'Email and password required' }, { status: 400 }));
      }

      const user = await db.collection('users').findOne({ email });
      if (!user || !comparePassword(password, user.password)) {
        return handleCORS(NextResponse.json({ error: 'Invalid credentials' }, { status: 401 }));
      }

      const token = generateToken(user);
      const { password: _, ...userWithoutPassword } = user;

      return handleCORS(NextResponse.json({ token, user: userWithoutPassword }));
    }

    // ==================== PRODUCT ROUTES ====================
    
    // GET /api/products - Public
    if (route === '/products' && method === 'GET') {
      const products = await db.collection('products').find({}).toArray();
      const cleanedProducts = products.map(({ _id, ...rest }) => rest);
      return handleCORS(NextResponse.json({ products: cleanedProducts }));
    }

    // ==================== ORDER ROUTES ====================
    
    // POST /api/orders - Create order (protected)
    if (route === '/orders' && method === 'POST') {
      const token = getTokenFromHeader(request);
      const decoded = verifyToken(token);

      if (!decoded) {
        return handleCORS(NextResponse.json({ error: 'Unauthorized' }, { status: 401 }));
      }

      const body = await request.json();
      const { items } = body;

      if (!items || items.length === 0) {
        return handleCORS(NextResponse.json({ error: 'No items in order' }, { status: 400 }));
      }

      const order = {
        id: uuidv4(),
        userId: decoded.userId,
        userEmail: decoded.email,
        items,
        status: 'Pending',
        createdAt: new Date(),
      };

      await db.collection('orders').insertOne(order);
      const { _id, ...cleanedOrder } = order;

      return handleCORS(NextResponse.json({ order: cleanedOrder }));
    }

    // GET /api/orders - Get user's orders (protected)
    if (route === '/orders' && method === 'GET') {
      const token = getTokenFromHeader(request);
      const decoded = verifyToken(token);

      if (!decoded) {
        return handleCORS(NextResponse.json({ error: 'Unauthorized' }, { status: 401 }));
      }

      const orders = await db.collection('orders')
        .find({ userId: decoded.userId })
        .sort({ createdAt: -1 })
        .toArray();

      const cleanedOrders = orders.map(({ _id, ...rest }) => rest);
      return handleCORS(NextResponse.json({ orders: cleanedOrders }));
    }

    // ==================== CONTACT ROUTES ====================
    
    // POST /api/contact
    if (route === '/contact' && method === 'POST') {
      const body = await request.json();
      const { name, email, phone, company, location, message } = body;

      if (!name || !email || !message) {
        return handleCORS(NextResponse.json({ error: 'Missing required fields' }, { status: 400 }));
      }

      const contactMessage = {
        id: uuidv4(),
        name,
        email,
        phone: phone || '',
        company: company || '',
        location: location || '',
        message,
        createdAt: new Date(),
      };

      await db.collection('contact_messages').insertOne(contactMessage);
      const { _id, ...cleaned } = contactMessage;

      return handleCORS(NextResponse.json({ message: 'Message sent successfully', data: cleaned }));
    }

    // ==================== ADMIN ROUTES ====================
    
    // Admin middleware check
    const isAdminRoute = route.startsWith('/admin/');
    if (isAdminRoute) {
      const token = getTokenFromHeader(request);
      const decoded = verifyToken(token);

      if (!decoded || decoded.role !== 'admin') {
        return handleCORS(NextResponse.json({ error: 'Admin access required' }, { status: 403 }));
      }
    }

    // POST /api/admin/products - Create product
    if (route === '/admin/products' && method === 'POST') {
      const body = await request.json();
      const { name, description, price, stock, category, brand, imageUrl } = body;

      if (!name || !description || price === undefined || stock === undefined || !category) {
        return handleCORS(NextResponse.json({ error: 'Missing required fields' }, { status: 400 }));
      }

      const product = {
        id: uuidv4(),
        name,
        description,
        price: parseFloat(price),
        stock: parseInt(stock),
        category,
        brand: brand || '',
        imageUrl: imageUrl || '',
      };

      await db.collection('products').insertOne(product);
      const { _id, ...cleaned } = product;

      return handleCORS(NextResponse.json({ product: cleaned }));
    }

    // PUT /api/admin/products?id=xxx - Update product
    if (route === '/admin/products' && method === 'PUT') {
      const url = new URL(request.url);
      const productId = url.searchParams.get('id');

      if (!productId) {
        return handleCORS(NextResponse.json({ error: 'Product ID required' }, { status: 400 }));
      }

      const body = await request.json();
      const { name, description, price, stock, category, brand, imageUrl } = body;

      const updateData = {
        name,
        description,
        price: parseFloat(price),
        stock: parseInt(stock),
        category,
        brand,
        imageUrl,
      };

      const result = await db.collection('products').updateOne(
        { id: productId },
        { $set: updateData }
      );

      if (result.matchedCount === 0) {
        return handleCORS(NextResponse.json({ error: 'Product not found' }, { status: 404 }));
      }

      return handleCORS(NextResponse.json({ message: 'Product updated successfully' }));
    }

    // DELETE /api/admin/products?id=xxx - Delete product
    if (route === '/admin/products' && method === 'DELETE') {
      const url = new URL(request.url);
      const productId = url.searchParams.get('id');

      if (!productId) {
        return handleCORS(NextResponse.json({ error: 'Product ID required' }, { status: 400 }));
      }

      const result = await db.collection('products').deleteOne({ id: productId });

      if (result.deletedCount === 0) {
        return handleCORS(NextResponse.json({ error: 'Product not found' }, { status: 404 }));
      }

      return handleCORS(NextResponse.json({ message: 'Product deleted successfully' }));
    }

    // GET /api/admin/orders - Get all orders
    if (route === '/admin/orders' && method === 'GET') {
      const orders = await db.collection('orders')
        .find({})
        .sort({ createdAt: -1 })
        .toArray();

      const cleanedOrders = orders.map(({ _id, ...rest }) => rest);
      return handleCORS(NextResponse.json({ orders: cleanedOrders }));
    }

    // PUT /api/admin/orders?id=xxx - Update order status
    if (route === '/admin/orders' && method === 'PUT') {
      const url = new URL(request.url);
      const orderId = url.searchParams.get('id');

      if (!orderId) {
        return handleCORS(NextResponse.json({ error: 'Order ID required' }, { status: 400 }));
      }

      const body = await request.json();
      const { status } = body;

      if (!status) {
        return handleCORS(NextResponse.json({ error: 'Status required' }, { status: 400 }));
      }

      const result = await db.collection('orders').updateOne(
        { id: orderId },
        { $set: { status } }
      );

      if (result.matchedCount === 0) {
        return handleCORS(NextResponse.json({ error: 'Order not found' }, { status: 404 }));
      }

      return handleCORS(NextResponse.json({ message: 'Order updated successfully' }));
    }

    // Route not found
    return handleCORS(NextResponse.json({ error: `Route ${route} not found` }, { status: 404 }));

  } catch (error) {
    console.error('API Error:', error);
    return handleCORS(NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 }));
  }
}

// Export all HTTP methods
export const GET = handleRoute;
export const POST = handleRoute;
export const PUT = handleRoute;
export const DELETE = handleRoute;
export const PATCH = handleRoute;