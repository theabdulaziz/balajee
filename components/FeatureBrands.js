export default function FeatureBrands() {
  const brands = [
    {
      name: 'Wai Wai',
      image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=400&fit=crop',
    },
    {
      name: 'Current',
      image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=400&h=400&fit=crop',
    },
    {
      name: 'Rum Pum',
      image: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=400&h=400&fit=crop',
    },
    {
      name: 'Druk',
      image: 'https://images.unsplash.com/photo-1604999333679-b86d54738315?w=400&h=400&fit=crop',
    },
    {
      name: 'Rato Bhale',
      image: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=400&h=400&fit=crop',
    },
    {
      name: 'Aama Ko Achar',
      image: 'https://images.unsplash.com/photo-1596040033229-a0b3b6087c97?w=400&h=400&fit=crop',
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