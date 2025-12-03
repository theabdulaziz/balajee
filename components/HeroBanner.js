import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function HeroBanner() {
  return (
    <div className="relative h-[600px] flex items-center justify-center overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1763480005787-67c0fe4ee8f2?w=1600)',
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
      </div>
      
      <div className="relative z-10 text-center text-white px-4 max-w-4xl">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 drop-shadow-lg">
          The Original Taste of Nepal
        </h1>
        <p className="text-xl md:text-2xl mb-8 drop-shadow-md">
          Premium South-Asian Grocery Products for Your Business
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/products">
            <Button size="lg" className="text-lg px-8 py-6">
              View Products
            </Button>
          </Link>
          <Link href="/contact">
            <Button size="lg" variant="outline" className="text-lg px-8 py-6 bg-white text-black hover:bg-gray-100">
              Contact Us
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}