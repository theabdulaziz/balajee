export default function FeatureBrands() {
  const brands = [
    {
      name: 'Wai Wai',
      image: 'https://images.unsplash.com/photo-1762898842219-ca8136061b76?w=400',
    },
    {
      name: 'Rum Pum',
      image: 'https://images.unsplash.com/photo-1758346973244-4979d432025a?w=400',
    },
    {
      name: 'Current',
      image: 'https://images.unsplash.com/photo-1641470787994-3f4dfd90d7d4?w=400',
    },
    {
      name: 'Druk',
      image: 'https://images.pexels.com/photos/17390914/pexels-photo-17390914.jpeg?w=400',
    },
    {
      name: 'Rato Bhale',
      image: 'https://images.pexels.com/photos/13220344/pexels-photo-13220344.jpeg?w=400',
    },
    {
      name: 'Aama Ko Achar',
      image: 'https://images.pexels.com/photos/15014921/pexels-photo-15014921.jpeg?w=400',
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12">Featured Brands</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {brands.map((brand, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition group">
              <div className="aspect-square relative overflow-hidden">
                <img
                  src={brand.image}
                  alt={brand.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                />
              </div>
              <div className="p-4 text-center">
                <h3 className="font-semibold text-lg">{brand.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}