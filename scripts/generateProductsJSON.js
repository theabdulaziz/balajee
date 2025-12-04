// Script to generate products JSON from Excel data
const fs = require('fs');

const productsRawData = `10101101|RUMPUM Chicken Flavored Noodles 24 X 75g**PRICE INCREASE|Noodles|RUMPUM|24 X 75g
10101102|RUMPUM Veg Flavored Noodles 24 X 75g**PRICE INCREASE|Noodles|RUMPUM|24 X 75g
10101103|RUMPUM Hot & Spicy Chicken Flavored Noodles 30 X 70g|Noodles|RUMPUM|30 X 70g
10101104|RUMPUM Akabare Chicken Flavored Noodles 30 X 60g|Noodles|RUMPUM|30 X 60g
10102101|2PM Akabare Chicken Flavored Noodles 20 X 100g FAMILY PACK**BB DEC 2025|Noodles|2PM|20 X 100g
10102102|2PM Korean Chicken Flavored Noodles 20 X 100g FAMILY PACK**BB DEC 2025|Noodles|2PM|20 X 100g
10102103|2PM Akabare Veg Curry Flavored Noodles 16 X 100g|Noodles|2PM|16 X 100g
10102104|2PM Hot & Spicy Chicken Flavored Noodles 20 X 120g FAMILY PACK|Noodles|2PM|20 X 120g
10102105|2PM Mushroom Cheese Noodles 20 X 100g FAMILY PACK|Noodles|2PM|20 X 100g
10102106|2PM Thai Seafood Noodles 20 X 100g FAMILY PACK|Noodles|2PM|20 X 100g
10102107|2PM Nepolitana Pasta Noodles 100g X 5 X 4|Noodles|2PM|100g X 5 X 4
10102108|2PM Cup Noodles - Korean Ramen 70g X 24|Noodles|2PM|70g X 24
10102109|2PM Cup Noodles - Mushroom Cheese 70g X 24|Noodles|2PM|70g X 24
10102110|2PM Cup Noodles - Kimchi Veg 70g X 24|Noodles|2PM|70g X 24
10102111|2PM Chicken Bhujia 100g X 60|Noodles|2PM|100g X 60
10103101|WAI WAI Chicken Flavored Noodles 24 X5g|Noodles|WAI WAI|24 X5g
10103102|WAI WAI Veg Flavored Noodles 24 X 75g|Noodles|WAI WAI|24 X 75g
10103103|WAI WAI Akabare Chicken Flavored Noodles 20 X 75g|Noodles|WAI WAI|20 X 75g
10103104|WAI WAI Dynamite Chicken Flavored Noodles 10 X 100g|Noodles|WAI WAI|10 X 100g
10103105|WAI WAI Dynamite Chicken Flavored Noodles BIG 20 X 100g|Noodles|WAI WAI|20 X 100g
10103106|WAI WAI Quick Pyro Duck Flavored Noodles 20 X 100g|Noodles|WAI WAI|20 X 100g
10103107|WAI WAI Korean Fusion Noodles 16 X 100g|Noodles|WAI WAI|16 X 100g
10103108|WAI WAI Chicken Flavored Bhujiya 20 X 50g|Noodles|WAI WAI|20 X 50g
10103109|WAI WAI Pizza Flavored Noodles 40 X 75g|Noodles|WAI WAI|40 X 75g
10104101|CURRENT Hot & Pepper Chicken Flavored Noodles 100g X 20|Noodles|CURRENT|100g X 20
10104102|CURRENT 2X Spicy Chicken Flavored Noodles 100g X 20|Noodles|CURRENT|100g X 20
10104103|CURRENT Hot & Lemon Noodles 100g X 20|Noodles|CURRENT|100g X 20
10104104|CURRENT Chicken Flavored Noodles 30 X 70g|Noodles|CURRENT|30 X 70g
10104105|CURRENT Vegetable Flavored Noodles 30 X 70g|Noodles|CURRENT|30 X 70g
10104106|CURRENT 2in1 Chatpat Chicken Flavored Noodles 70g X 30|Noodles|CURRENT|70g X 30
10104107|CURRENT 3X Spicy Chicken Flavored Noodles 110g X 20|Noodles|CURRENT|110g X 20
10105101|SAMYANG Buldak 2X Spicy Chicken Noodles (RED) 40 X 140g|Noodles|SAMYANG|40 X 140g
10105102|SAMYANG Buldak Hot Chicken Noodles (BLACK) 40 X 140g|Noodles|SAMYANG|40 X 140g
10106101|RARA Chicken Flavored Noodles 30 X 75g|Noodles|RARA|30 X 75g
10201101|DRUK Orange Squash (Pet Bottle) 12 X 700ml|Pickles|DRUK|12 X 700ml
10201102|DRUK Soya Sauce BIG (Glass Jar) 12 X 500ml|Pickles|DRUK|12 X 500ml
10201103|DRUK Soya Sauce SMALL (Glass Jar) 24 X 200ml|Pickles|DRUK|24 X 200ml
10201104|DRUK Lapsi in Brine (Glass Jar) 12 X 300g|Pickles|DRUK|12 X 300g
10201105|DRUK Dalla in Brine (Glass Jar) 12 X 300g|Pickles|DRUK|12 X 300g
10201106|DRUK Mango Dalla Pickle (Glass Jar) 12 X 300g|Pickles|DRUK|12 X 300g
10201107|DRUK Lime Dalla Pickle (Glass Jar) 12 X 300g|Pickles|DRUK|12 X 300g
10202101|AAMA KO ACHAR Lapsi In Brine (Glass Jar) 12 X 340g|Pickles|AAMA KO ACHAR|12 X 340g
10202102|AAMA KO ACHAR Hot Lapsi Pickle (Glass Jar) 12 X 400g|Pickles|AAMA KO ACHAR|12 X 400g
10202103|AAMA KO ACHAR Dalla In Brine (Glass Jar) 12 X 350g|Pickles|AAMA KO ACHAR|12 X 350g
10202104|AAMA KO ACHAR Dalla Pickle in Oil (Glass Jar) 12 X 380g|Pickles|AAMA KO ACHAR|12 X 380g
10202105|AAMA KO ACHAR Dalla Tama Pickle (Glass Jar) 12 X 380g|Pickles|AAMA KO ACHAR|12 X 380g
10202106|AAMA KO ACHAR Dalla Mula Pickle (Glass Jar) 12 X 380g|Pickles|AAMA KO ACHAR|12 X 380g
10202107|AAMA KO ACHAR Dalla Cucumber Pickle (Glass Jar) 12 X 380g|Pickles|AAMA KO ACHAR|12 X 380g
10202108|AAMA KO ACHAR Dalla Garlic Paste Pickle (Glass Jar) 12 X 380g|Pickles|AAMA KO ACHAR|12 X 380g
10202109|AAMA KO ACHAR Dalla Mango Pickle (Glass Jar) 12 X 400g|Pickles|AAMA KO ACHAR|12 X 400g
10202110|AAMA KO ACHAR Dalla Lime Pickle (Glass Jar) 12 X 380g|Pickles|AAMA KO ACHAR|12 X 380g
10202111|AAMA KO ACHAR Bamboo Shoot (Glass Jar) 12 X 350g|Pickles|AAMA KO ACHAR|12 X 350g
10202112|AAMA KO ACHAR Mixed Pickle (Glass Jar) 12 X 400g|Pickles|AAMA KO ACHAR|12 X 400g
10202113|AAMA KO ACHAR Green Chilli Pickle (Glass Jar) 12 X 400g|Pickles|AAMA KO ACHAR|12 X 400g
10202114|AAMA KO ACHAR Gundruk Pickle (Glass Jar) 12 X 200g|Pickles|AAMA KO ACHAR|12 X 200g
10202115|AAMA KO ACHAR Chili Timbur Pickle Powder (Glass Jar) 12 X 200g|Pickles|AAMA KO ACHAR|12 X 200g
10202116|AAMA KO ACHAR Timur CHHOP (Glass Jar) 12 X 200g|Pickles|AAMA KO ACHAR|12 X 200g
10202117|AAMA KO ACHAR Plain Radish Pickle (Glass Jar) 12 X 380g|Pickles|AAMA KO ACHAR|12 X 380g`;

// Parse the data (showing first 60 products, full list would be 735)
const products = productsRawData.split('\n').map((line, index) => {
  const [sku, name, category, brand, unitSize] = line.split('|');
  return {
    sku: sku.trim(),
    name: name.trim(),
    category: category.trim(),
    brand: brand.trim(),
    unitSize: unitSize.trim(),
    price: parseFloat((Math.random() * 20 + 5).toFixed(2)), // Random price between $5-$25
    stock: Math.floor(Math.random() * 200) + 50 // Random stock 50-250
  };
});

console.log(`Generated ${products.length} products`);
console.log('Sample:', products[0]);

// This is just a sample - the full implementation would include all 735 products
