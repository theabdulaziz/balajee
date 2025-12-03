export default function FeatureBrands() {
  const brands = [
    {
      name: 'Wai Wai',
      image: 'https://balajeetradelink.com/wp-content/uploads/2021/01/waiwai.jpg',
    },
    {
      name: 'Current',
      image: 'https://balajeetradelink.com/wp-content/uploads/2025/11/Current-Logo.png',
    },
    {
      name: 'Rum Pum',
      image: 'https://balajeetradelink.com/wp-content/uploads/2025/11/Rumpum-Logo.jpg',
    },
    {
      name: 'Druk',
      image: 'https://balajeetradelink.com/wp-content/uploads/2021/01/druk.jpg',
    },
    {
      name: 'Rato Bhale',
      image: 'https://balajeetradelink.com/wp-content/uploads/2025/11/Screenshot-2025-11-04-131607.jpg',
    },
    {
      name: 'Aama Ko Achar',
      image: 'https://balajeetradelink.com/wp-content/uploads/2025/11/AKA.jpg',
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