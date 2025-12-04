import Link from 'next/link';
import { Facebook, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">Balajee Trade Link</h3>
            <p className="text-gray-400 mb-4">Your trusted wholesale importer of authentic South-Asian grocery products since 2011.</p>
            <div className="flex space-x-4">
              <a 
                href="https://www.facebook.com/balajeetradelink" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-primary transition"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a 
                href="https://www.linkedin.com/company/balajee-trade-link" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-primary transition"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-400 hover:text-white transition">Home</Link></li>
              <li><Link href="/products" className="text-gray-400 hover:text-white transition">Products</Link></li>
              <li><Link href="/online-partners" className="text-gray-400 hover:text-white transition">Online Partners</Link></li>
              <li><Link href="/our-network" className="text-gray-400 hover:text-white transition">Our Network</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-white transition">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Office Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start text-gray-400">
                <MapPin className="h-4 w-4 mr-2 mt-1 flex-shrink-0" />
                <span>805 South Main Street<br />Taylor, PA 18517</span>
              </li>
              <li className="flex items-center text-gray-400">
                <Phone className="h-4 w-4 mr-2 flex-shrink-0" />
                570-562-2777
              </li>
              <li className="flex items-center text-gray-400">
                <Phone className="h-4 w-4 mr-2 flex-shrink-0" />
                570-562-2775 (Fax)
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Warehouses</h4>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-semibold text-white mb-2">Maspeth, NY</p>
                <ul className="space-y-2">
                  <li className="flex items-start text-gray-400 text-sm">
                    <MapPin className="h-3 w-3 mr-2 mt-1 flex-shrink-0" />
                    <span>58-06 57th Road<br />Maspeth, NY 11378</span>
                  </li>
                  <li className="flex items-center text-gray-400 text-sm">
                    <Phone className="h-3 w-3 mr-2 flex-shrink-0" />
                    347-475-4299
                  </li>
                </ul>
              </div>
              <div>
                <p className="text-sm font-semibold text-white mb-2">Jessup, PA</p>
                <ul className="space-y-2">
                  <li className="flex items-start text-gray-400 text-sm">
                    <MapPin className="h-3 w-3 mr-2 mt-1 flex-shrink-0" />
                    <span>1318 Sen Robert Mellow Dr<br />Jessup, PA 18434</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Balajee Trade Link, LLC. All rights reserved. Established 2011.</p>
        </div>
      </div>
    </footer>
  );
}