'use client';


import React from 'react';

interface Product {
  id: number;
  name: string;
  price: string;
  image: string;
  type: 'Buy' | 'Rent';
}

interface ProductItemProps {
  product: Product;
  theme:boolean | object;
}

interface TopProductsProps {
  theme: boolean | object;
  customerData: any; 
}

const ProductItem: React.FC<ProductItemProps> = ({ product,theme }) => {
 
  
  return (
    <div className={`flex items-center justify-between ${theme?"hover:bg-[#0000000F] text-[#2D333C]":"hover:bg-gray-700 text-[#FFFFFF]"} p-4 rounded-lg transition-colors`}>
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-600">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h4 className="font-medium">{product.name}</h4>
          <p className="text-sm">{product.price}</p>
        </div>
      </div>
      <button
        className={`px-3 py-1  text-xs  font-medium rounded-sm ${theme?"text-[#313A46] border border-[#313A46]":"text-white border border-white"}`}
      >
        {product.type}
      </button>
    </div>
  );
};

const TopProducts: React.FC<TopProductsProps> = ({ theme,customerData }) => {  
  const products =
    customerData?.data?.topProducts?.map((item: any) => ({
      id: item.id,
      name: item.title || 'Unnamed Product',
      price: `$${item.rental_price || '0.00'}`,
      image:
        item.coat?.images?.[0] ||
        item.coat?.collections?.details?.[0]?.image,
        type: item.rental_price ? 'Rent' : 'Buy',
    })) || [];

  return (
    <div className={`${theme?"bg-[#FFFFFF]":"bg-[#313A46]"} rounded-lg p-6`}>
      <h3 className={`text-lg font-semibold ${theme?"text-[#313A46]":"text-[#FFFFFF]"}`}>Top Sell/Buy Products</h3>
      <div className="space-y-2 ">
        {products.map((product) => (
          <ProductItem key={product.id} product={product} theme={theme} />
        ))}
      </div>
    </div>
  );
};

export default TopProducts;