'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ShoppingCart, User, LogOut, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import NotificationBadge from '@/components/NotificationBadge';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    // Check for user in localStorage
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setUser(JSON.parse(userData));
    }

    // Check cart count
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartCount(cart.reduce((sum, item) => sum + item.quantity, 0));

    // Listen for cart updates
    const handleCartUpdate = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      setCartCount(cart.reduce((sum, item) => sum + item.quantity, 0));
    };

    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => window.removeEventListener('cartUpdated', handleCartUpdate);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    router.push('/login');
  };

  return (
    <nav className="bg-card border-b border-border shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3">
            <img 
              src="/logo-btl.jpg" 
              alt="BTL Logo" 
              className="h-10 w-10 rounded-lg shadow-md"
            />
            <span className="text-2xl font-bold text-primary">
              Balajee Trade Link
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <Link href="/" className={`hover:text-primary transition ${pathname === '/' ? 'text-primary font-semibold' : 'text-foreground'}`}>
              Home
            </Link>
            <Link href="/products" className={`hover:text-primary transition ${pathname === '/products' ? 'text-primary font-semibold' : 'text-foreground'}`}>
              Products
            </Link>
            <Link href="/online-partners" className={`hover:text-primary transition ${pathname === '/online-partners' ? 'text-primary font-semibold' : 'text-foreground'}`}>
              Online Partners
            </Link>
            <Link href="/our-network" className={`hover:text-primary transition ${pathname === '/our-network' ? 'text-primary font-semibold' : 'text-foreground'}`}>
              Our Network
            </Link>
            <Link href="/contact" className={`hover:text-primary transition ${pathname === '/contact' ? 'text-primary font-semibold' : 'text-foreground'}`}>
              Contact
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link href="/cart" className="relative">
              <Button variant="ghost" size="icon">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Button>
            </Link>

            {user ? (
              <>
                <NotificationBadge />
                {user.role === 'admin' && (
                  <>
                    <Link href="/admin/place-order">
                      <Button variant="ghost" size="sm" className="text-xs">Place Order</Button>
                    </Link>
                    <Link href="/admin/products-list">
                      <Button variant="ghost" size="sm" className="text-xs">Inventory</Button>
                    </Link>
                  </>
                )}
                <Link href={user.role === 'admin' ? '/admin' : '/dashboard'}>
                  <Button variant="ghost" size="icon">
                    <LayoutDashboard className="h-5 w-5" />
                  </Button>
                </Link>
                <Button variant="ghost" size="icon" onClick={handleLogout}>
                  <LogOut className="h-5 w-5" />
                </Button>
                <span className="text-sm text-foreground font-medium">{user.name}</span>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="outline">Login</Button>
                </Link>
                <Link href="/signup">
                  <Button>Sign Up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}