import productModel from "../models/productModel";

export const getAllProducts = async () => {
  return await productModel.find();
};

export const seedInitialProducts = async () => {
  const products = [
    { title: "Asus Laptop", image: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse3.mm.bing.net%2Fth%3Fid%3DOIP.6jgtCW9M2LGi-ORQLmCgmgHaFb%26pid%3DApi&f=1&ipt=6aa0eec0c1ca3e8f6465c90bfba71df780b21529be2bfd130afd7ee174729587&ipo=images", price: 3800, stock: 100 }
  ];
  const allProducts = await getAllProducts();
  if (allProducts.length===0){
    await productModel.insertMany(products);
  }
};
