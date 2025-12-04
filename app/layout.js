import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AnimatedBackground from '@/components/AnimatedBackground';

export const metadata = {
  title: 'Balajee Trade Link - Wholesale South-Asian Grocery',
  description: 'Premium wholesale importer of authentic South-Asian grocery products in the United States',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen relative">
        <AnimatedBackground />
        <div className="relative z-10 flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}