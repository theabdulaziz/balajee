import { MongoClient } from 'mongodb';
import { v4 as uuidv4 } from 'uuid';
import { NextResponse } from 'next/server';
import { hashPassword, comparePassword, generateToken, verifyToken, getTokenFromHeader } from '@/lib/auth';
import { productSeeds } from '@/lib/productSeeds';

// MongoDB connection
let client;
let db;

async function connectToMongo() {
  if (!client) {
    client = new MongoClient(process.env.MONGO_URL);
    await client.connect();
    db = client.db(process.env.DB_NAME || 'balajee_trade_link');
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
  
  // Auto-seeding disabled - products imported via bulk import script
  // if (productsCount === 0) {
  //   await db.collection('products').insertMany(productSeeds);
  //   console.log(`Seeded ${productSeeds.length} products from Balajee Trade Link inventory`);
  // }
  
  // Legacy sample products (keeping for reference, not used)
  if (false) {
    const sampleProducts = [
      // Noodles
      {
        id: uuidv4(),
        name: 'Wai Wai Instant Noodles - Chicken',
        description: 'Authentic Nepalese instant noodles with chicken flavor',
        price: 24.99,
        stock: 100,
        category: 'Noodles',
        brand: 'Wai Wai',
        imageUrl: 'https://balajeetradelink.com/wp-content/uploads/2025/11/Screenshot-2025-11-12-225709.png',
      },
      {
        id: uuidv4(),
        name: 'Wai Wai Instant Noodles - Vegetable',
        description: 'Vegetarian instant noodles with mixed vegetables',
        price: 23.99,
        stock: 110,
        category: 'Noodles',
        brand: 'Wai Wai',
        imageUrl: 'https://balajeetradelink.com/wp-content/uploads/2025/11/Screenshot-2025-11-12-230037.png',
      },
      {
        id: uuidv4(),
        name: 'Current 3X Spicy Noodles',
        description: 'Extra spicy instant noodles for those who love heat',
        price: 25.99,
        stock: 120,
        category: 'Noodles',
        brand: 'Current',
        imageUrl: 'https://balajeetradelink.com/wp-content/uploads/2025/11/Screenshot-2025-11-12-220801-1.png',
      },
      {
        id: uuidv4(),
        name: 'Current Chicken Flavored Noodles',
        description: 'Delicious chicken flavored instant noodles',
        price: 24.50,
        stock: 115,
        category: 'Noodles',
        brand: 'Current',
        imageUrl: 'https://balajeetradelink.com/wp-content/uploads/2025/11/Screenshot-2025-11-12-220748-1.png',
      },
      {
        id: uuidv4(),
        name: 'Current Hot n Lemon Noodles',
        description: 'Spicy instant noodles with a tangy lemon twist',
        price: 24.50,
        stock: 100,
        category: 'Noodles',
        brand: 'Current',
        imageUrl: 'https://balajeetradelink.com/wp-content/uploads/2025/11/Screenshot-2025-11-12-220738-1.png',
      },
      {
        id: uuidv4(),
        name: 'Rum Pum Chicken Noodles',
        description: 'Premium chicken flavored instant noodles',
        price: 23.99,
        stock: 95,
        category: 'Noodles',
        brand: 'Rum Pum',
        imageUrl: 'https://balajeetradelink.com/wp-content/uploads/2025/11/Screenshot-2025-11-12-225603.png',
      },
      {
        id: uuidv4(),
        name: 'Rum Pum Vegetable Noodles',
        description: 'Vegetarian instant noodles with vegetable seasoning',
        price: 22.99,
        stock: 90,
        category: 'Noodles',
        brand: 'Rum Pum',
        imageUrl: 'https://balajeetradelink.com/wp-content/uploads/2025/11/Screenshot-2025-11-12-225459.png',
      },
      {
        id: uuidv4(),
        name: '2PM Korean Ramen',
        description: 'Authentic Korean-style spicy ramen noodles',
        price: 27.99,
        stock: 85,
        category: 'Noodles',
        brand: '2PM',
        imageUrl: 'https://balajeetradelink.com/wp-content/uploads/2025/11/2PM-Korean-Ramen.jpg',
      },
      // Pickles
      {
        id: uuidv4(),
        name: 'Dalla in Brine (Hot Cherry Pepper)',
        description: 'Traditional hot cherry pepper pickle in brine',
        price: 15.99,
        stock: 70,
        category: 'Pickles',
        brand: 'Aama Ko Achar',
        imageUrl: 'https://balajeetradelink.com/wp-content/uploads/2021/02/dalla-in-brine.jpg',
      },
      {
        id: uuidv4(),
        name: 'Hot & Sweet Mango Pickle',
        description: 'Perfect blend of hot and sweet mango pickle',
        price: 16.50,
        stock: 80,
        category: 'Pickles',
        brand: 'Aama Ko Achar',
        imageUrl: 'https://balajeetradelink.com/wp-content/uploads/2025/11/Hot-Mango-Pickle-1-1024x1024.webp',
      },
      {
        id: uuidv4(),
        name: 'Nepali Cucumber Pickle',
        description: 'Traditional Nepalese cucumber pickle with spices',
        price: 14.99,
        stock: 65,
        category: 'Pickles',
        brand: 'Aama Ko Achar',
        imageUrl: 'https://balajeetradelink.com/wp-content/uploads/2021/02/kakro.jpg',
      },
      {
        id: uuidv4(),
        name: 'Bamboo Shoot Pickle',
        description: 'Authentic bamboo shoot pickle - a Nepalese delicacy',
        price: 17.99,
        stock: 55,
        category: 'Pickles',
        brand: 'Aama Ko Achar',
        imageUrl: 'https://balajeetradelink.com/wp-content/uploads/2025/11/Bamboo-Shoot-1-1024x1021.webp',
      },
      {
        id: uuidv4(),
        name: 'Dalla & Garlic Paste Pickle',
        description: 'Hot cherry pepper and garlic paste pickle',
        price: 15.50,
        stock: 70,
        category: 'Pickles',
        brand: 'Aama Ko Achar',
        imageUrl: 'https://balajeetradelink.com/wp-content/uploads/2021/02/dallagarlic.jpg',
      },
      // Snacks
      {
        id: uuidv4(),
        name: 'Current Spicy Cheese Balls',
        description: 'Crunchy cheese balls with spicy seasoning',
        price: 18.99,
        stock: 100,
        category: 'Snacks',
        brand: 'Current',
        imageUrl: 'https://balajeetradelink.com/wp-content/uploads/2025/11/Screenshot-2025-11-12-220621.png',
      },
      {
        id: uuidv4(),
        name: 'Current Achari Sticks',
        description: 'Crispy sticks with tangy pickle flavoring',
        price: 17.50,
        stock: 95,
        category: 'Snacks',
        brand: 'Current',
        imageUrl: 'https://balajeetradelink.com/wp-content/uploads/2025/11/Screenshot-2025-11-12-220632.png',
      },
      {
        id: uuidv4(),
        name: 'Wai Wai Bhujiya',
        description: 'Traditional Indian savory snack mix',
        price: 16.99,
        stock: 110,
        category: 'Snacks',
        brand: 'Wai Wai',
        imageUrl: 'https://balajeetradelink.com/wp-content/uploads/2025/11/Screenshot-2025-11-12-220652.png',
      },
      {
        id: uuidv4(),
        name: '2PM Akbare Twigs',
        description: 'Spicy twigs snack with authentic Nepali flavor',
        price: 19.99,
        stock: 75,
        category: 'Snacks',
        brand: '2PM',
        imageUrl: 'https://balajeetradelink.com/wp-content/uploads/2025/11/Screenshot-2025-11-12-220558.png',
      },
      // Rato Bhale Products
      {
        id: uuidv4(),
        name: 'Rato Bhale Churpi',
        description: 'Traditional Nepalese hard cheese snack',
        price: 21.99,
        stock: 50,
        category: 'Rato Bhale',
        brand: 'Rato Bhale',
        imageUrl: 'https://balajeetradelink.com/wp-content/uploads/2021/02/churpiRATO.jpg',
      },
      {
        id: uuidv4(),
        name: 'Rato Bhale Fapar',
        description: 'Buckwheat flour - gluten free and nutritious',
        price: 12.99,
        stock: 60,
        category: 'Rato Bhale',
        brand: 'Rato Bhale',
        imageUrl: 'https://balajeetradelink.com/wp-content/uploads/2021/02/fapar.jpg',
      },
      {
        id: uuidv4(),
        name: 'Rato Bhale Masala Papad',
        description: 'Spiced papadum - perfect appetizer',
        price: 11.50,
        stock: 85,
        category: 'Rato Bhale',
        brand: 'Rato Bhale',
        imageUrl: 'https://balajeetradelink.com/wp-content/uploads/2021/02/masalaPapad.jpg',
      },
      {
        id: uuidv4(),
        name: 'Rato Bhale Nepali Bhuja',
        description: 'Traditional Nepali snack mix',
        price: 15.99,
        stock: 90,
        category: 'Rato Bhale',
        brand: 'Rato Bhale',
        imageUrl: 'https://balajeetradelink.com/wp-content/uploads/2021/02/Nepali-Bhuja.jpg',
      },
      {
        id: uuidv4(),
        name: 'Rato Bhale Spicy Dalmoth',
        description: 'Spicy lentil and nut mixture',
        price: 17.50,
        stock: 80,
        category: 'Rato Bhale',
        brand: 'Rato Bhale',
        imageUrl: 'https://balajeetradelink.com/wp-content/uploads/2025/11/Screenshot-2025-11-05-141256.png',
      },
      // Spices
      {
        id: uuidv4(),
        name: 'Rato Bhale Timur (Sichuan Pepper)',
        description: 'Authentic Nepali Sichuan pepper - whole',
        price: 19.99,
        stock: 45,
        category: 'Spices',
        brand: 'Rato Bhale',
        imageUrl: 'https://balajeetradelink.com/wp-content/uploads/2021/02/RatoBhaletimurwhole.jpg',
      },
      {
        id: uuidv4(),
        name: 'Bajeko Momo Masala',
        description: 'Traditional Nepali momo spice blend',
        price: 8.99,
        stock: 120,
        category: 'Spices',
        brand: 'Bajeko',
        imageUrl: 'https://balajeetradelink.com/wp-content/uploads/2021/02/bajekomomo.jpg',
      },
      {
        id: uuidv4(),
        name: 'Bajeko Chicken Curry Masala',
        description: 'Aromatic chicken curry spice mix',
        price: 9.50,
        stock: 100,
        category: 'Spices',
        brand: 'Bajeko',
        imageUrl: 'https://balajeetradelink.com/wp-content/uploads/2021/02/bajekoChicken.jpg',
      },
      // Confectioneries
      {
        id: uuidv4(),
        name: 'Lapsi Chini Titaura',
        description: 'Sweet and sour Nepali candy made from hog plum',
        price: 7.99,
        stock: 150,
        category: 'Confectioneries',
        brand: 'Traditional',
        imageUrl: 'https://balajeetradelink.com/wp-content/uploads/2021/02/00004-lapsi-chini-titaura.png',
      },
      {
        id: uuidv4(),
        name: 'Lapsi Candy',
        description: 'Traditional Nepali lapsi fruit candy',
        price: 6.99,
        stock: 140,
        category: 'Confectioneries',
        brand: 'Traditional',
        imageUrl: 'https://balajeetradelink.com/wp-content/uploads/2021/02/lapsi-candy.png',
      },
      {
        id: uuidv4(),
        name: 'Masala Candy',
        description: 'Spicy and tangy flavored candy',
        price: 6.50,
        stock: 160,
        category: 'Confectioneries',
        brand: 'Traditional',
        imageUrl: 'https://balajeetradelink.com/wp-content/uploads/2021/02/masala-candy.png',
      },
      // Tea
      {
        id: uuidv4(),
        name: 'Society Masala Tea',
        description: 'Premium spiced tea blend with authentic flavor',
        price: 13.99,
        stock: 65,
        category: 'Tea',
        brand: 'Society',
        imageUrl: 'https://balajeetradelink.com/wp-content/uploads/2025/11/Screenshot-2025-11-12-222937.png',
      },
      {
        id: uuidv4(),
        name: 'Tokla Tea',
        description: 'Traditional Nepali black tea',
        price: 12.50,
        stock: 70,
        category: 'Tea',
        brand: 'Tokla',
        imageUrl: 'https://balajeetradelink.com/wp-content/uploads/2025/11/Screenshot-2025-11-12-222950.png',
      },
    ];
    // Legacy sample products not used anymore - using productSeeds from inventory Excel
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
      const products = await db.collection('products')
        .find({})
        .project({ _id: 0 }) // Exclude MongoDB _id
        .limit(1000) // Limit to prevent performance issues
        .toArray();
      return handleCORS(NextResponse.json({ products: products }));
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
        .project({ _id: 0 }) // Exclude MongoDB _id
        .sort({ createdAt: -1 })
        .limit(100) // Limit user orders for performance
        .toArray();

      return handleCORS(NextResponse.json({ orders: orders }));
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
        .project({ _id: 0 }) // Exclude MongoDB _id
        .sort({ createdAt: -1 })
        .limit(500) // Limit to prevent performance issues
        .toArray();

      return handleCORS(NextResponse.json({ orders: orders }));
    }

    // PUT /api/admin/orders?id=xxx - Update order (status, items, shipping, notes)
    if (route === '/admin/orders' && method === 'PUT') {
      const url = new URL(request.url);
      const orderId = url.searchParams.get('id');

      if (!orderId) {
        return handleCORS(NextResponse.json({ error: 'Order ID required' }, { status: 400 }));
      }

      const body = await request.json();
      
      // Build update object with only provided fields
      const updateData = {};
      if (body.status) updateData.status = body.status;
      if (body.items) updateData.items = body.items;
      if (body.shippingCharge !== undefined) updateData.shippingCharge = parseFloat(body.shippingCharge);
      if (body.notes !== undefined) updateData.notes = body.notes;
      if (body.total !== undefined) updateData.total = parseFloat(body.total);
      
      // Add updated timestamp
      updateData.updatedAt = new Date();

      const result = await db.collection('orders').updateOne(
        { id: orderId },
        { $set: updateData }
      );

      if (result.matchedCount === 0) {
        return handleCORS(NextResponse.json({ error: 'Order not found' }, { status: 404 }));
      }

      return handleCORS(NextResponse.json({ message: 'Order updated successfully' }));
    }

    // POST /api/auth/forgot-password - Send password reset email
    if (route === '/auth/forgot-password' && method === 'POST') {
      const body = await request.json();
      const { email } = body;

      if (!email) {
        return handleCORS(NextResponse.json({ success: false, message: 'Email is required' }, { status: 400 }));
      }

      const user = await db.collection('users').findOne({ email });
      
      // Always return success for security (don't reveal if email exists)
      // In production, send actual email with reset link here using nodemailer
      
      if (user) {
        // TODO: Generate reset token and send email
        const resetToken = uuidv4();
        const resetExpiry = new Date(Date.now() + 3600000); // 1 hour from now
        
        await db.collection('users').updateOne(
          { email },
          { $set: { resetToken, resetExpiry } }
        );
        
        console.log(`Password reset token for ${email}: ${resetToken}`);
        // In production: Send email with reset link containing this token
      }
      
      return handleCORS(NextResponse.json({ success: true, message: 'If the email exists, reset instructions have been sent' }));
    }

    // GET /api/admin/customers - Get all customers
    if (route === '/admin/customers' && method === 'GET') {
      const customers = await db.collection('users')
        .find({ role: 'customer' })
        .project({ _id: 0, password: 0, resetToken: 0, resetExpiry: 0 })
        .sort({ createdAt: -1 })
        .toArray();

      return handleCORS(NextResponse.json({ success: true, customers }));
    }

    // POST /api/admin/place-order - Admin places order for customer
    if (route === '/admin/place-order' && method === 'POST') {
      const body = await request.json();
      const { customerId, items } = body;

      if (!customerId || !items || items.length === 0) {
        return handleCORS(NextResponse.json({ success: false, message: 'Customer ID and items required' }, { status: 400 }));
      }

      const customer = await db.collection('users').findOne({ id: customerId });
      if (!customer) {
        return handleCORS(NextResponse.json({ success: false, message: 'Customer not found' }, { status: 404 }));
      }

      const order = {
        id: uuidv4(),
        userId: customerId,
        userEmail: customer.email,
        items,
        status: 'Pending',
        placedBy: 'admin',
        createdAt: new Date(),
      };

      await db.collection('orders').insertOne(order);
      
      // Create notification for customer
      await db.collection('notifications').insertOne({
        id: uuidv4(),
        userId: customerId,
        title: 'New Order Placed',
        message: `An order has been placed on your behalf by admin. Order ID: ${order.id}`,
        read: false,
        createdAt: new Date()
      });

      const { _id, ...cleanedOrder } = order;
      return handleCORS(NextResponse.json({ success: true, order: cleanedOrder }));
    }

    // GET /api/notifications - Get user notifications
    if (route === '/notifications' && method === 'GET') {
      const token = getTokenFromHeader(request);
      const decoded = verifyToken(token);

      if (!decoded) {
        return handleCORS(NextResponse.json({ error: 'Unauthorized' }, { status: 401 }));
      }

      const notifications = await db.collection('notifications')
        .find({ userId: decoded.userId })
        .project({ _id: 0 })
        .sort({ createdAt: -1 })
        .limit(50)
        .toArray();

      return handleCORS(NextResponse.json({ success: true, notifications }));
    }

    // PUT /api/notifications/:id/read - Mark notification as read
    if (route.startsWith('/notifications/') && route.endsWith('/read') && method === 'PUT') {
      const token = getTokenFromHeader(request);
      const decoded = verifyToken(token);

      if (!decoded) {
        return handleCORS(NextResponse.json({ error: 'Unauthorized' }, { status: 401 }));
      }

      const notificationId = route.split('/')[2];
      
      const result = await db.collection('notifications').updateOne(
        { id: notificationId, userId: decoded.userId },
        { $set: { read: true } }
      );

      if (result.matchedCount === 0) {
        return handleCORS(NextResponse.json({ success: false, message: 'Notification not found' }, { status: 404 }));
      }

      return handleCORS(NextResponse.json({ success: true, message: 'Notification marked as read' }));
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