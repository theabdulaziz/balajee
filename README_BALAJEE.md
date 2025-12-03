# Balajee Trade Link - B2B Wholesale Grocery Portal

A complete production-ready B2B wholesale ordering portal for South-Asian grocery products.

## 🚀 Tech Stack

- **Frontend**: Next.js 14 (App Router), React, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes
- **Database**: MongoDB
- **Authentication**: JWT with bcryptjs
- **UI Components**: shadcn/ui with Radix UI

## 📁 Project Structure

```
/app/
├── app/
│   ├── api/[[...path]]/route.js    # All API endpoints
│   ├── page.js                     # Home page
│   ├── login/page.js               # Login page
│   ├── signup/page.js              # Signup page
│   ├── products/page.js            # Products listing
│   ├── cart/page.js                # Shopping cart
│   ├── orders/page.js              # Customer orders
│   ├── contact/page.js             # Contact form
│   ├── admin/page.js               # Admin dashboard
│   ├── dashboard/page.js           # Customer dashboard
│   ├── layout.js                   # Root layout
│   └── globals.css                 # Global styles
├── components/
│   ├── Navbar.js                   # Navigation bar
│   ├── Footer.js                   # Footer component
│   ├── HeroBanner.js               # Hero section
│   ├── FeatureBrands.js            # Brand showcase
│   ├── ProductCard.js              # Product display card
│   ├── OrderTable.js               # Orders table
│   ├── ProtectedRoute.js           # Route protection
│   └── ui/                         # shadcn/ui components
├── lib/
│   ├── mongodb.js                  # MongoDB connection
│   └── auth.js                     # JWT utilities
└── package.json                    # Dependencies
```

## 🎨 Features

### Public Features
- **Landing Page**: Hero banner with "The Original Taste of Nepal" theme
- **Brand Showcase**: Featured brands (WaiWai, Rum Pum, Current, Druk, Rato Bhale, Aama Ko Achar)
- **Products Page**: Browse all products with search and category filters
- **Contact Form**: Submit inquiries (saved to database)

### Customer Features
- **Authentication**: Signup/Login with JWT
- **Shopping Cart**: Add/remove products, adjust quantities
- **Order Placement**: Submit orders from cart
- **Order Tracking**: View order history and status
- **Customer Dashboard**: Overview of orders and account

### Admin Features
- **Product Management**: Create, update, delete products
- **Order Management**: View all orders, update order status
- **Admin Dashboard**: Statistics and management interface

## 📊 Database Schema

### Collections

#### users
```javascript
{
  id: String (UUID),
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String ('admin' | 'customer'),
  company: String,
  createdAt: Date
}
```

#### products
```javascript
{
  id: String (UUID),
  name: String,
  description: String,
  price: Number,
  stock: Number,
  category: String,
  brand: String,
  imageUrl: String
}
```

#### orders
```javascript
{
  id: String (UUID),
  userId: String,
  userEmail: String,
  items: Array[{
    id: String,
    name: String,
    price: Number,
    quantity: Number
  }],
  status: String ('Pending' | 'Approved' | 'Completed' | 'Cancelled'),
  createdAt: Date
}
```

#### contact_messages
```javascript
{
  id: String (UUID),
  name: String,
  email: String,
  phone: String,
  company: String,
  location: String,
  message: String,
  createdAt: Date
}
```

## 🔐 Authentication

The app uses JWT (JSON Web Tokens) for authentication:

- Tokens are stored in localStorage
- Protected routes check for valid token
- Admin routes require role === 'admin'
- Default admin credentials:
  - **Email**: `admin@balajee.com`
  - **Password**: `admin123`

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+ 
- MongoDB instance running
- Yarn package manager

### Step 1: Install Dependencies
```bash
cd /app
yarn install
```

### Step 2: Environment Variables
Create or verify `.env` file:
```env
MONGO_URL=mongodb://localhost:27017
NEXT_PUBLIC_BASE_URL=http://localhost:3000
JWT_SECRET=balajee-trade-link-secret-key-2024
```

### Step 3: Start Development Server
```bash
yarn dev
```

The app will be available at `http://localhost:3000`

## 🚀 Running the Application

### Development Mode
```bash
yarn dev
```
- Hot reload enabled
- Runs on port 3000
- Auto-seeds sample data on first run

### Production Build
```bash
yarn build
yarn start
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new customer account
- `POST /api/auth/login` - Login and get JWT token

### Products (Public)
- `GET /api/products` - Get all products

### Orders (Protected)
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get user's orders

### Contact
- `POST /api/contact` - Submit contact form

### Admin (Protected - Admin Only)
- `POST /api/admin/products` - Create product
- `PUT /api/admin/products?id=xxx` - Update product
- `DELETE /api/admin/products?id=xxx` - Delete product
- `GET /api/admin/orders` - Get all orders
- `PUT /api/admin/orders?id=xxx` - Update order status

## 🎨 UI/UX Features

### Design System
- Clean, modern wholesale business aesthetic
- Responsive design (mobile + desktop)
- Tailwind CSS for styling
- shadcn/ui components for consistency

### Background Images
- **Home Page**: Nepal food culture hero banner
- **Products Page**: Grocery store shelves background
- **Cart Page**: Warehouse pallet/logistics background
- **Contact Page**: Warehouse distribution background

### Color Scheme
- Primary: Blue (#2563eb)
- Secondary: Gray shades
- Accents: Yellow for pending, Green for completed, Red for errors

## 🔄 Cart System

- Stored in browser's localStorage
- Persists across page refreshes
- Real-time cart count in navbar
- Add/remove/update quantity functionality
- Validates stock availability

## 📱 Responsive Design

- Mobile-first approach
- Hamburger menu for mobile (built-in with shadcn)
- Responsive grids for products
- Touch-friendly buttons and inputs

## 🔒 Security Features

- Password hashing with bcryptjs
- JWT token expiration (7 days)
- Protected API routes
- Role-based access control
- Input validation on forms

## 🌱 Sample Data

The application auto-seeds sample data on first run:

### Products (9 items)
- Wai Wai Instant Noodles (Chicken & Vegetable)
- Rum Pum Potato Chips
- Current Noodles - Masala
- Druk Momo Sauce
- Rato Bhale Mixed Pickles
- Aama Ko Achar - Mango
- Basmati Rice Premium
- Druk Cheese Balls

### Admin User
- Email: `admin@balajee.com`
- Password: `admin123`

## 🧪 Testing the Application

### Test Customer Flow
1. Go to `/signup` and create a customer account
2. Browse products at `/products`
3. Add products to cart
4. Go to `/cart` and place order
5. View orders at `/orders` or `/dashboard`

### Test Admin Flow
1. Login with admin credentials at `/login`
2. Go to `/admin` dashboard
3. Add/edit/delete products in Products tab
4. Manage orders in Orders tab
5. Update order status

## 🐛 Troubleshooting

### MongoDB Connection Issues
```bash
# Check if MongoDB is running
sudo systemctl status mongodb
# or
mongo --eval "db.adminCommand('ping')"
```

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Module Not Found Errors
```bash
# Reinstall dependencies
rm -rf node_modules
yarn install
```

## 📈 Future Enhancements

- Email notifications for orders
- PDF invoice generation
- Advanced search and filters
- Wishlist functionality
- Bulk order discounts
- Customer reviews and ratings
- Product inventory alerts
- Payment gateway integration (Stripe/PayPal)
- Order tracking with shipping status
- Multi-language support

## 👥 User Roles

### Customer
- Browse products
- Place orders
- View order history
- Manage account

### Admin
- All customer permissions
- Manage products (CRUD)
- View all orders
- Update order status
- Access admin dashboard

## 📞 Support

For issues or questions:
- Email: info@balajeetradelink.com
- Phone: +1 (555) 123-4567

## 📄 License

Proprietary - Balajee Trade Link © 2024

---

**Built with ❤️ for authentic South-Asian grocery distribution**
