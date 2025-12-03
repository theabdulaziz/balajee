'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ShoppingCart, User, LogOut, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-2xl font-bold text-primary">
            Balajee Trade Link
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <Link href="/" className={`hover:text-primary transition ${pathname === '/' ? 'text-primary font-semibold' : 'text-gray-700'}`}>
              Home
            </Link>
            <Link href="/products" className={`hover:text-primary transition ${pathname === '/products' ? 'text-primary font-semibold' : 'text-gray-700'}`}>
              Products
            </Link>
            <Link href="/contact" className={`hover:text-primary transition ${pathname === '/contact' ? 'text-primary font-semibold' : 'text-gray-700'}`}>
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
                <Link href={user.role === 'admin' ? '/admin' : '/dashboard'}>
                  <Button variant="ghost" size="icon">
                    <LayoutDashboard className="h-5 w-5" />
                  </Button>
                </Link>
                <Button variant="ghost" size="icon" onClick={handleLogout}>
                  <LogOut className="h-5 w-5" />
                </Button>
                <span className="text-sm text-gray-600">{user.name}</span>
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