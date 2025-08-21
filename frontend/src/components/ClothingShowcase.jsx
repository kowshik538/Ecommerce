import React from 'react';
import './ClothingShowcase.css';
import shirtFront from '../assets/shirt_front.png';
// import jacketFront from '../assets/jacket_front.png';
// import tshirtFront from '../assets/tshirt_front.png';

const clothingItems = [
  {
    image: shirtFront,
    name: 'Casual Shirt',
  },
//   {
//     image: jacketFront,
//     name: 'Winter Jacket',
//   },
//   {
//     image: tshirtFront,
//     name: 'Graphic T-Shirt',
//   },
];

const ClothingShowcase = () => {
  return (
    <div className="clothing-showcase">
      <h2 className="clothing-heading">Explore Our 3D Display</h2>
      <div className="clothing-grid">
        {clothingItems.map((item, index) => (
          <div className="tilt-card" key={index}>
            <div className="tilt-inner">
              <img src={item.image} alt={item.name} />
              <div className="shine"></div>
              <p className="item-name">{item.name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClothingShowcase;
