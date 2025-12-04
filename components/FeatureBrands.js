export default function FeatureBrands() {
  const brands = [
    {
      name: 'Wai Wai',
      image: '/brands/waiwai-logo.jpg',
      url: 'https://waiwai.com.np/',
    },
    {
      name: 'Current',
      image: '/brands/current-logo.png',
      url: 'https://yashodafoods.com.np/',
    },
    {
      name: 'Rum Pum',
      image: '/brands/rumpum-logo.jpg',
      url: 'https://rumpumindia.com/faq/',
    },
    {
      name: 'Druk',
      image: '/brands/druk-logo.png',
      url: null,
    },
    {
      name: 'Rato Bhale',
      image: '/brands/rato-bhale-logo.png',
      url: null,
    },
    {
      name: 'Aama Ko Achar',
      image: '/brands/aama-logo.jpg',
      url: 'https://www.aamakoachar.com/',
    },
  ];

  return (
    <section className="py-16 bg-card/40 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12 text-foreground">Featured Brands</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {brands.map((brand, index) => {
            const CardContent = (
              <>
                <div className="aspect-square relative overflow-hidden bg-white">
                  <img
                    src={brand.image}
                    alt={brand.name}
                    className="w-full h-full object-contain p-4 group-hover:scale-110 transition duration-300"
                  />
                </div>
                <div className="p-4 text-center bg-card">
                  <h3 className="font-semibold text-lg text-foreground">{brand.name}</h3>
                </div>
              </>
            );

            return brand.url ? (
              <a
                key={index}
                href={brand.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-card border border-border rounded-lg shadow-md overflow-hidden hover:shadow-xl hover:border-primary transition group block"
              >
                {CardContent}
              </a>
            ) : (
              <div
                key={index}
                className="bg-card border border-border rounded-lg shadow-md overflow-hidden hover:shadow-xl transition group"
              >
                {CardContent}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}