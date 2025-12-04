'use client';

import { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';

export default function OurNetwork() {
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    // Load Mapbox script
    const script = document.createElement('script');
    script.src = 'https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.js';
    script.async = true;
    script.onload = () => initializeMap();
    document.head.appendChild(script);

    const link = document.createElement('link');
    link.href = 'https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.css';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(script);
      document.head.removeChild(link);
    };
  }, []);

  const initializeMap = () => {
    if (typeof window !== 'undefined' && window.mapboxgl) {
      window.mapboxgl.accessToken = 'pk.eyJ1IjoidHJhdmlzY29hbCIsImEiOiJjand0amFnNmUwNWR6NDRwZXVpOWp2azYwIn0.1vksrwPsV1bVlyYoALNROQ';
      
      const map = new window.mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/traviscoal/ckm0s6xif1zem18p569u4u64g',
        center: [-98.5795, 39.8283],
        zoom: 3.5
      });

      // Add network markers
      const locations = [
        // Major cities where Nepali/Bhutanese communities are present
        { coords: [-73.9352, 40.7306], name: 'New York Metro' },
        { coords: [-87.6298, 41.8781], name: 'Chicago' },
        { coords: [-75.5398, 39.7561], name: 'Wilmington, DE' },
        { coords: [-122.4194, 37.7749], name: 'San Francisco' },
        { coords: [-118.2437, 34.0522], name: 'Los Angeles' },
        { coords: [-80.1918, 25.7617], name: 'Miami' },
        { coords: [-95.3698, 29.7604], name: 'Houston' },
        { coords: [-104.9903, 39.7392], name: 'Denver' },
        { coords: [-122.3321, 47.6062], name: 'Seattle' },
        { coords: [-71.0589, 42.3601], name: 'Boston' },
        { coords: [-75.3751, 40.6023], name: 'Jessup, PA' },
        { coords: [-73.8760, 40.7282], name: 'Maspeth, NY' },
      ];

      locations.forEach(location => {
        const el = document.createElement('div');
        el.className = 'custom-marker';
        el.style.backgroundColor = '#dc267f';
        el.style.width = '15px';
        el.style.height = '15px';
        el.style.borderRadius = '50%';
        el.style.border = '2px solid white';
        el.style.cursor = 'pointer';

        new window.mapboxgl.Marker(el)
          .setLngLat(location.coords)
          .setPopup(
            new window.mapboxgl.Popup({ offset: 25 })
              .setHTML(`<div style="color: #1a0b2e; padding: 5px; font-weight: 600;">${location.name}</div>`)
          )
          .addTo(map);
      });

      setMapLoaded(true);
    }
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">Our Network</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Balajee Trade Link serves customers across North America with strategically located distribution 
            points and a wide network of retail partners. Our reach extends from coast to coast, ensuring 
            authentic Nepalese and Bhutanese products are available to communities nationwide.
          </p>
        </div>

        {/* Map Container */}
        <div className="bg-card border border-border rounded-lg shadow-lg overflow-hidden mb-8">
          <div 
            id="map" 
            style={{ width: '100%', height: '600px' }}
            className="relative"
          >
            {!mapLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-muted">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading network map...</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Network Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-card border border-border rounded-lg p-6 text-center">
            <MapPin className="h-12 w-12 text-primary mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-foreground mb-2">2 Warehouses</h3>
            <p className="text-muted-foreground">Strategically located in NY and PA</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-6 text-center">
            <MapPin className="h-12 w-12 text-secondary mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-foreground mb-2">12+ Cities</h3>
            <p className="text-muted-foreground">Serving major metropolitan areas</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-6 text-center">
            <MapPin className="h-12 w-12 text-accent mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-foreground mb-2">100+ Partners</h3>
            <p className="text-muted-foreground">Trusted retail locations nationwide</p>
          </div>
        </div>
      </div>
    </div>
  );
}
