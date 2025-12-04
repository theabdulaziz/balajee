'use client';

import { ExternalLink } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function OnlinePartners() {
  const partners = [
    {
      name: 'Nepale Market',
      url: 'https://www.nepalemarket.com/',
      logo: 'https://balajeetradelink.com/wp-content/uploads/2021/02/nepalemarket-logo.png',
      description: 'Premier online marketplace for authentic Nepalese products and groceries'
    },
    {
      name: 'Mallko Store',
      url: 'https://mallko.store/',
      logo: 'https://balajeetradelink.com/wp-content/uploads/2021/02/Mallko_logo_new_Green_and_yellow_360x.png',
      description: 'Your trusted source for South Asian specialty foods and household items'
    },
    {
      name: 'Dhaka Topi Online Store',
      url: 'https://dhakatopi.store/',
      logo: 'https://balajeetradelink.com/wp-content/uploads/2025/11/Dhaka-Topi.png',
      description: 'Traditional Nepalese cultural items and authentic food products'
    }
  ];

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Online Partners</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            We're proud to partner with leading online retailers who share our commitment to bringing 
            authentic Nepalese and Bhutanese products to customers across North America. Shop our 
            products through these trusted online platforms.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {partners.map((partner, index) => (
            <Card key={index} className="bg-card border border-border hover:border-primary transition-all duration-300 group">
              <CardContent className="p-6">
                <a 
                  href={partner.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block"
                >
                  {/* Logo Container */}
                  <div className="aspect-square relative overflow-hidden rounded-lg bg-white p-8 mb-6 group-hover:scale-105 transition-transform duration-300">
                    <img
                      src={partner.logo}
                      alt={partner.name}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=400&fit=crop';
                      }}
                    />
                  </div>

                  {/* Partner Info */}
                  <div className="text-center">
                    <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {partner.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {partner.description}
                    </p>
                    <div className="inline-flex items-center gap-2 text-primary font-medium">
                      <span>Visit Store</span>
                      <ExternalLink className="h-4 w-4" />
                    </div>
                  </div>
                </a>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center bg-card border border-border rounded-lg p-8 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Want to Partner With Us?
          </h2>
          <p className="text-muted-foreground mb-6">
            Are you an online retailer interested in offering our authentic Nepalese and Bhutanese 
            products to your customers? We'd love to hear from you!
          </p>
          <a
            href="/contact"
            className="inline-block px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
          >
            Get in Touch
          </a>
        </div>
      </div>
    </div>
  );
}
