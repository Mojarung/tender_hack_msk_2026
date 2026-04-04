import React from 'react';

const CartPage = ({ setPage }) => {
  const cartItems = [
    {
      id: '570824',
      title: 'Маркер перманентный Uni Posca 1,8-2,5мм овальный (белый, 1 штука)',
      supplier: 'ООО «Первый Государственный Поставщий»',
      price: '12991',
      oldPrice: '14778',
      discount: '-5%',
      available: 250,
      quantity: 10,
      image: 'https://images.unsplash.com/photo-1583127812417-7c06e950a432?q=80&w=200&auto=format&fit=crop',
      expiry: '4 дек 2019',
      delivery: '5 дней',
      contracts: '4'
    }
  ];

  const subtotal = cartItems.reduce((acc, item) => acc + parseInt(item.price), 0);

  return (
    <div className="cart-page animate-fade-in">
      <div className="cart-container">
        <div className="cart-header">
          <h1>Корзина</h1>
          <button className="back-to-catalog" onClick={() => setPage('catalog')}>
            Вернуться в каталог
          </button>
        </div>

        <div className="cart-layout">
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="item-main">
                  <div className="item-image">
                    <img src={item.image} alt={item.title} />
                  </div>
                  <div className="item-info">
                    <h3 className="item-title">{item.title}</h3>
                    <p className="item-supplier">{item.supplier}</p>
                    
                    <div className="item-metadata">
                      <div className="meta-col">
                        <span className="meta-label">Срок действия:</span>
                        <span className="meta-value">{item.expiry}</span>
                      </div>
                      <div className="meta-col">
                        <span className="meta-label">Срок поставки:</span>
                        <span className="meta-value">{item.delivery}</span>
                      </div>
                      <div className="meta-col">
                        <span className="meta-label">Контракты:</span>
                        <span className="meta-value">{item.contracts}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="item-actions">
                  <div className="price-block">
                    <div className="price-top">
                      <span className="current-price">{item.price.toLocaleString()} ₽</span>
                      <div className="price-secondary">
                        <span className="discount">{item.discount}</span>
                        <span className="old-price">{item.oldPrice.toLocaleString()} ₽</span>
                      </div>
                    </div>
                    <p className="availability">Доступно: {item.available} шт.</p>
                  </div>

                  <div className="qty-row">
                    <span className="price-per-unit">678,10 ₽ за шт.</span>
                    <div className="qty-selector-square">
                      <button className="qty-btn-sq">-</button>
                      <div className="qty-val-sq">{item.quantity}</div>
                      <button className="qty-btn-sq">+</button>
                    </div>
                  </div>
                  
                  <button className="item-remove-link">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                    Удалить
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <div className="summary-card">
              <h3>Итого</h3>
              <div className="summary-row">
                <span>Товары ({cartItems.length})</span>
                <span>{subtotal.toLocaleString()} ₽</span>
              </div>
              <div className="summary-row total">
                <span>К оплате</span>
                <span className="total-val">{subtotal.toLocaleString()} ₽</span>
              </div>
              <button className="checkout-btn">
                Оформить заказ
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .cart-page {
          padding: 40px 0;
          background-color: #F9FAFB;
          min-height: calc(100vh - var(--utility-bar-height) - 72px);
        }
        .cart-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 16px;
        }
        .cart-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
        }
        .cart-header h1 {
          font-size: 28px;
          font-weight: 800;
          letter-spacing: -0.5px;
        }
        .back-to-catalog {
          background-color: transparent;
          border: 1px solid var(--primary-blue);
          color: var(--primary-blue);
          padding: 8px 24px;
          border-radius: 8px;
          font-weight: 700;
          font-size: 14px;
        }
        .back-to-catalog:hover {
          background-color: var(--primary-blue);
          color: white;
        }
        .cart-layout {
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: 32px;
          align-items: flex-start;
        }
        .cart-items {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .cart-item {
          background-color: white;
          border-radius: 12px;
          border: 1px solid var(--border-light);
          padding: 24px;
          display: flex;
          justify-content: space-between;
          gap: 24px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
          transition: border-color 0.3s ease;
        }
        .cart-item:hover {
          border-color: var(--gray-blue);
        }
        .item-main {
          display: flex;
          gap: 24px;
          flex: 1;
        }
        .item-image img {
          width: 120px;
          height: 120px;
          object-fit: contain;
          border-radius: 8px;
        }
        .item-info {
          flex: 1;
        }
        .item-title {
          font-size: 18px;
          font-weight: 800;
          color: var(--black);
          margin-bottom: 8px;
          line-height: 1.3;
        }
        .item-supplier {
          font-size: 14px;
          color: var(--pale-black);
          margin-bottom: 24px;
          font-weight: 600;
        }
        .item-metadata {
          display: flex;
          gap: 32px;
        }
        .meta-col {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .meta-label {
          font-size: 11px;
          color: var(--pale-black);
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .meta-value {
          font-size: 14px;
          font-weight: 700;
          color: var(--black);
        }
        
        .item-actions {
          width: 240px;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 16px;
        }
        .price-block {
          text-align: right;
        }
        .price-top {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          margin-bottom: 8px;
        }
        .current-price {
          font-size: 28px;
          font-weight: 800;
          color: var(--black);
          letter-spacing: -0.3px;
        }
        .price-secondary {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .discount {
          font-size: 11px;
          font-weight: 700;
          color: #38A169;
          background-color: #E6FFFA;
          padding: 2px 8px;
          border-radius: 4px;
        }
        .old-price {
          font-size: 14px;
          color: var(--pale-black);
          text-decoration: line-through;
          font-weight: 500;
        }
        .availability {
          font-size: 13px;
          color: var(--pale-black);
          font-weight: 600;
        }
        
        .qty-row {
           display: flex;
           flex-direction: column;
           align-items: flex-end;
           gap: 8px;
        }
        .price-per-unit {
          font-size: 12px;
          color: var(--pale-black);
          font-weight: 600;
        }
        .qty-selector-square {
          display: flex;
          border: 1px solid var(--border-light);
          border-radius: 6px;
          overflow: hidden;
          height: 44px;
        }
        .qty-btn-sq {
          width: 44px;
          border: none;
          background: white;
          font-size: 20px;
          color: var(--pale-black);
          cursor: pointer;
          transition: background-color 0.2s;
        }
        .qty-btn-sq:hover {
          background-color: #F8F9FA;
          color: var(--primary-blue);
        }
        .qty-val-sq {
          width: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: var(--pale-blue);
          font-weight: 700;
          font-size: 16px;
          color: var(--black);
        }
        
        .item-remove-link {
          display: flex;
          align-items: center;
          gap: 6px;
          background: none;
          border: none;
          color: var(--pale-black);
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          padding: 0;
          margin-top: 8px;
        }
        .item-remove-link:hover {
          color: var(--primary-red);
        }

        .summary-card {
          background-color: white;
          border-radius: 16px;
          border: 1px solid var(--border-light);
          padding: 32px;
          position: sticky;
          top: 104px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
        }
        .summary-card h3 {
          font-size: 22px;
          margin-bottom: 24px;
        }
        .summary-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 16px;
          font-size: 15px;
          color: var(--pale-black);
          font-weight: 600;
        }
        .summary-row.total {
          border-top: 1px solid var(--border-light);
          padding-top: 24px;
          margin-top: 24px;
          color: var(--black);
          font-size: 20px;
          font-weight: 800;
        }
        .total-val {
          font-size: 32px;
          color: var(--black);
          letter-spacing: -0.5px;
        }
        .checkout-btn {
          width: 100%;
          background-color: var(--primary-red);
          color: white;
          border: none;
          padding: 18px;
          border-radius: 10px;
          font-size: 18px;
          font-weight: 800;
          margin-top: 32px;
          cursor: pointer;
          box-shadow: 0 4px 15px rgba(219, 43, 33, 0.25);
        }
        .checkout-btn:hover {
          background-color: var(--primary-red-hover);
        }

        @media (max-width: 1100px) {
          .cart-item {
            flex-direction: column;
          }
          .item-actions {
            width: 100%;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            border-top: 1px solid var(--border-light);
            padding-top: 20px;
          }
          .price-block {
            text-align: left;
          }
          .price-top {
            flex-direction: row;
            align-items: center;
            gap: 16px;
          }
        }
        
        @media (max-width: 1024px) {
          .cart-layout {
            grid-template-columns: 1fr;
          }
        }
        
        @media (max-width: 768px) {
          .item-main {
            flex-direction: column;
          }
          .item-metadata {
            flex-direction: column;
            gap: 16px;
          }
          .item-actions {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>
    </div>
  );
};

export default CartPage;
