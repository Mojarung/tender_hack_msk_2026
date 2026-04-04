import React, { useState } from 'react';

const ProductCard = ({ title, category, id, model, price, image }) => {
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  const increment = () => setQuantity(prev => prev + 1);
  const decrement = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  return (
    <div className="product-card card-lift-hover animate-fade-in">
      <div className="card-image">
        <img 
          src={image} 
          alt={title} 
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/180x150?text=Продукт';
          }}
        />
      </div>
      <div className="card-body">
        <a href="#" className="card-title">{title}</a>
        <div className="card-meta">
          <p><span className="label">ID СТЕ:</span> <span className="value">{id}</span></p>
          <p><span className="label">Категория:</span> <span className="value">{category}</span></p>
          <p><span className="label">Модель:</span> <span className="value">{model}</span></p>
        </div>
        <div className="price-section">
          <span className="price">{price.toLocaleString()} ₽</span>
          <span className="unit">за 1 шт</span>
        </div>
      </div>
      <div className="card-footer">
        {isAdded ? (
          <div className="quantity-selector">
            <button className="qty-btn" onClick={decrement}>-</button>
            <input 
              type="number" 
              className="qty-input" 
              value={quantity} 
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
            />
            <button className="qty-btn" onClick={increment}>+</button>
          </div>
        ) : (
          <button className="add-to-cart-btn" onClick={() => setIsAdded(true)}>В корзину</button>
        )}
        <button className="offers-btn-small">1 предложение</button>
      </div>
      <style>{`
        .product-card {
          background-color: #FFFFFF;
          border: 1px solid var(--border-light);
          border-radius: 10px;
          display: flex;
          flex-direction: column;
          height: 100%;
          padding: 16px;
          gap: 12px;
          will-change: transform, opacity;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.02);
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }
        .product-card:hover {
          border-color: var(--gray-blue);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
        }
        .card-image {
          height: 160px;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #fcfcfc;
          border-radius: 8px;
        }
        .card-image img {
          max-width: 85%;
          max-height: 85%;
          object-fit: contain;
          transition: transform 0.5s ease;
        }
        .product-card:hover .card-image img {
          transform: scale(1.05);
        }
        .card-body {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .card-title {
          font-size: 14px;
          font-weight: 700;
          color: var(--black);
          line-height: 1.4;
          height: 2.8em; 
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          text-decoration: none;
          transition: color 0.2s ease;
        }
        .card-title:hover {
          color: var(--primary-blue);
        }
        .card-meta {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .card-meta p {
          font-size: 12px;
          margin: 0;
          line-height: 1.3;
        }
        .label {
          color: var(--pale-black);
          font-weight: 500;
        }
        .value {
          color: var(--black);
          font-weight: 700;
        }
        .price-section {
          display: flex;
          flex-direction: column;
          gap: 2px;
          margin-top: 2px;
        }
        .price {
          font-size: 22px;
          font-weight: 800;
          color: var(--black);
          letter-spacing: -0.3px;
        }
        .unit {
          font-size: 10px;
          color: var(--pale-black);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-weight: 700;
        }
        .card-footer {
          margin-top: 4px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .quantity-selector {
          display: flex;
          align-items: center;
          border: 1px solid var(--border-light);
          border-radius: 8px;
          overflow: hidden;
          background-color: var(--pale-blue);
          height: 40px;
          transition: all 0.2s ease;
        }
        .qty-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          background: none;
          border: none;
          width: 40px;
          height: 100%;
          font-size: 18px;
          font-weight: 600;
          color: var(--primary-blue);
          cursor: pointer;
          transition: background-color 0.2s;
        }
        .qty-btn:hover {
          background-color: var(--border-light);
        }
        .qty-input {
          flex: 1;
          width: 100%;
          border: none;
          text-align: center;
          font-size: 14px;
          font-weight: 700;
          background: #FFFFFF;
          padding: 0;
          outline: none;
          color: var(--black);
          height: 100%;
        }
        .add-to-cart-btn {
          background-color: var(--primary-blue);
          color: white;
          border: none;
          padding: 12px;
          font-size: 14px;
          font-weight: 700;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 12px rgba(38, 75, 130, 0.15);
        }
        .add-to-cart-btn:hover {
          background-color: var(--primary-blue-hover);
          transform: translateY(-1px);
        }
        .offers-btn-small {
          background-color: transparent;
          color: var(--primary-red);
          border: 1px solid var(--primary-red);
          padding: 8px;
          font-size: 12px;
          font-weight: 700;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .offers-btn-small:hover {
          background-color: var(--primary-red);
          color: white;
        }
      `}</style>
    </div>
  );
};

export default ProductCard;
