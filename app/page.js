import HeroBanner from '@/components/HeroBanner';
import FeatureBrands from '@/components/FeatureBrands';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Package, Truck, Shield, Clock } from 'lucide-react';

export default function Home() {
  return (
    <div>
      <HeroBanner />

      {/* Mission Statement */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <h2 className="text-4xl font-bold mb-6">Welcome to Balajee Trade Link</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            We are a premier wholesale importer and distributor of authentic South-Asian grocery products in the United States. 
            With decades of experience, we bring you the finest selection of traditional foods from Nepal, India, Bhutan, and across the region. 
            Our commitment is to deliver quality products that bring the authentic taste of home to your customers.
          </p>
        </div>
      </section>

      <FeatureBrands />

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Why Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Quality Products</h3>
              <p className="text-muted-foreground">Authentic brands directly from manufacturers</p>
            </div>
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
              <p className="text-muted-foreground">Reliable logistics and timely distribution</p>
            </div>
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Trusted Partner</h3>
              <p className="text-muted-foreground">Decades of experience in wholesale trade</p>
            </div>
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
              <p className="text-muted-foreground">Dedicated customer service team</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section 
        className="py-24 relative"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1627915589334-14a3c3e3a741?w=1600)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-70"></div>
        <div className="container mx-auto px-4 relative z-10 text-center text-white">
          <h2 className="text-4xl font-bold mb-6">Ready to Start Ordering?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join hundreds of retailers who trust Balajee Trade Link for their South-Asian grocery needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" className="text-lg px-8 py-6">
                Create Account
              </Button>
            </Link>
            <Link href="/products">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 bg-white text-black hover:bg-gray-100">
                Browse Products
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}