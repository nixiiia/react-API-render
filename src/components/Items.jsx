import React from 'react';

const Items = ({ items }) => {
  return (
    <div>
      <ul className="items__list">
        {items.map((item) => (
          <div key={item.id}>
            <p>{item.brand}</p>
            <p>{item.price}</p>
            <p>{item.product}</p>
          </div>
        ))}
      </ul>
    </div>
  );
};

export default Items;
