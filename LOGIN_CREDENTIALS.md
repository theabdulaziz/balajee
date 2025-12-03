# Balajee Trade Link - Login Credentials

## Admin Account
- **Email:** admin@balajee.com
- **Password:** admin123
- **Role:** Administrator
- **Access:** Full admin dashboard, manage products, manage all orders, update order status

## Customer Test Accounts

### Customer 1
- **Email:** customer1@example.com
- **Password:** customer123
- **Name:** John Smith
- **Company:** Smith Grocery Store
- **Access:** Browse products, place orders, view own orders, customer dashboard

### Customer 2
- **Email:** customer2@example.com
- **Password:** customer123
- **Name:** Sarah Johnson
- **Company:** Johnson Asian Market
- **Access:** Browse products, place orders, view own orders, customer dashboard

### Customer 3
- **Email:** customer3@example.com
- **Password:** customer123
- **Name:** Mike Patel
- **Company:** Patel International Foods
- **Access:** Browse products, place orders, view own orders, customer dashboard

---

## How to Test

### Testing Customer Flow:
1. Go to `/login`
2. Login with any customer account (e.g., customer1@example.com / customer123)
3. Browse products at `/products`
4. Add items to cart
5. Go to `/cart` and place order
6. View orders at `/orders` or `/dashboard`

### Testing Admin Flow:
1. Go to `/login`
2. Login with admin account (admin@balajee.com / admin123)
3. Go to `/admin` dashboard
4. **Products Tab:** Add, edit, or delete products
5. **Orders Tab:** View all customer orders, update order status (Pending → Approved → Completed)

---

## Testing Scenarios

### Scenario 1: Customer Places Order
1. Login as customer1@example.com
2. Browse products, add 3 different items to cart
3. Checkout and place order
4. View order in customer dashboard
5. Status should show "Pending"

### Scenario 2: Admin Approves Order
1. Login as admin@balajee.com
2. Go to Admin Dashboard → Orders Tab
3. Find customer1's order
4. Change status from "Pending" to "Approved"
5. Customer can now see "Approved" status in their dashboard

### Scenario 3: Multiple Customers
1. Login as customer2@example.com, place an order
2. Login as customer3@example.com, place a different order
3. Login as admin to see all orders from all customers
4. Manage each order separately

---

## Security Notes
- All passwords are hashed with bcryptjs
- JWT tokens expire after 7 days
- Admin routes are protected with role-based access control
- Customer can only see their own orders
- Admin can see all orders

---

**For Production:**
- Change admin password immediately
- Use strong passwords for all accounts
- Consider implementing email verification
- Add password reset functionality
- Enable 2FA for admin accounts
