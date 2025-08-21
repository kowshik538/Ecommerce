import React, { useContext, useEffect, useRef, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Link } from 'react-router-dom';
import './ProductItem.css';

const ProductItem = ({ id, image, name, price, subCategory }) => {
  const { currency } = useContext(ShopContext);
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef(null);

  const imagesToShow = image.slice(0, 4); // First 4 images

  // Function to format product type for display
  const formatProductType = (type) => {
    if (!type) return '';
    
    // Handle new product types
    const typeMap = {
      'oversized_tshirt_male': 'Oversized T-Shirt',
      'hoodie_male': 'Hoodie',
      'hoodie_female': 'Hoodie',
      'compression_tshirt_male': 'Compression T-Shirt',
      'compression_tshirt_female': 'Compression T-Shirt',
      'compression_pants_male': 'Compression Pants',
      'compression_pants_female': 'Compression Pants',
      'joggers_male': 'Joggers',
      'joggers_female': 'Joggers',
      'leggings_female': 'Leggings',
      'crop_top_female': 'Crop Top'
    };
    
    return typeMap[type] || type;
  };

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % imagesToShow.length);
    }, 2000); // 2 seconds per slide

    return () => clearInterval(intervalRef.current); // Cleanup
  }, [imagesToShow.length]);

  return (
    <Link to={`/product/${id}`} onClick={() => scrollTo(0, 0)} className="text-gray-700 cursor-pointer">
      <div className="carousel-card">
        <img src={imagesToShow[currentIndex]} alt={name} className="carousel-image" />
      </div>
      <p className="pt-3 pb-1 text-sm">{name}</p>
      <p className="text-xs text-gray-500 mb-1">{formatProductType(subCategory)}</p>
      <p className="text-sm font-medium">{currency}{price}</p>
    </Link>
  );
};

export default ProductItem;
