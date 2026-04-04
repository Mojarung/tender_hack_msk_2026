import React from 'react';
import logo from '../assets/logo.png';

const Header = ({ setPage }) => {
  return (
    <header className="site-header">
      {/* Top Utility Bar */}
      <div className="utility-bar">
        <div className="container utility-content">
          <nav className="utility-nav">
            <a href="#" className="nav-link">О портале</a>
            <a href="#" className="nav-link">Поставщикам</a>
            <a href="#" className="nav-link">Заказчикам</a>
            <a href="#" className="nav-link">Новости</a>
            <a href="#" className="nav-link">Обучение</a>
          </nav>
          <div className="utility-right">
            <a href="#" className="region-link">Москва</a>
          </div>
        </div>
      </div>

      <div className="main-header">
        <div className="container header-content">
          <div className="logo-section">
            <div className="logo-wrapper" onClick={() => setPage('catalog')} style={{cursor: 'pointer'}}>
               <img src={logo} alt="Портал поставщиков" className="logo-img" />
            </div>
          </div>
          
          <div className="header-right">
            <button className="cart-btn-main" onClick={() => setPage('cart')}>
              <div className="cart-icon-wrapper">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="cart-svg"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                <span className="cart-badge">3</span>
              </div>
              <span className="cart-label">Корзина</span>
            </button>
          </div>
        </div>
      </div>
      <style>{`
        .site-header {
          background-color: #FFFFFF;
          border-bottom: 1px solid var(--border-light);
          position: sticky;
          top: 0;
          z-index: 100;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
        }
        .utility-bar {
          background-color: #F9FAFB;
          height: var(--utility-bar-height);
          border-bottom: 1px solid var(--border-light);
          display: flex;
          align-items: center;
          font-size: 13px;
        }
        .utility-content {
          display: flex;
          justify-content: space-between;
          width: 100%;
        }
        .utility-nav {
          display: flex;
          gap: 20px;
        }
        .nav-link {
          color: var(--pale-black);
          font-weight: 500;
          text-decoration: none;
          transition: color 0.2s ease;
        }
        .nav-link:hover {
          color: var(--primary-red);
        }
        .region-link {
          color: var(--primary-blue);
          font-weight: 700;
          text-decoration: none;
          transition: color 0.2s ease;
        }
        .region-link:hover {
          color: var(--primary-red);
        }
        .main-header {
          height: 72px;
          display: flex;
          align-items: center;
        }
        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
        }
        .logo-wrapper {
          display: flex;
          align-items: center;
        }
        .logo-img {
          height: 42px;
          object-fit: contain;
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .logo-wrapper:hover .logo-img {
          transform: scale(1.05);
        }
        
        .header-right {
          display: flex;
          align-items: center;
        }
        .cart-btn-main {
          background-color: #FFFFFF;
          border: 1px solid var(--border-light);
          border-radius: 10px;
          padding: 8px 20px;
          display: flex;
          align-items: center;
          gap: 12px;
          color: var(--primary-blue);
          font-weight: 700;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
        }
        .cart-btn-main:hover {
          background-color: var(--primary-blue);
          color: white;
          border-color: var(--primary-blue);
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(38, 75, 130, 0.2);
        }
        .cart-icon-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .cart-svg {
          transition: transform 0.3s ease;
        }
        .cart-btn-main:hover .cart-svg {
          transform: scale(1.1);
        }
        .cart-badge {
          position: absolute;
          top: -6px;
          right: -8px;
          background-color: var(--primary-red);
          color: white;
          font-size: 10px;
          min-width: 18px;
          height: 18px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          border: 2px solid white;
          transition: border-color 0.25s ease;
        }
        .cart-btn-main:hover .cart-badge {
          border-color: var(--primary-blue);
        }
        .cart-label {
          font-size: 15px;
        }

        @media (max-width: 768px) {
          .utility-bar {
            display: none;
          }
          .cart-label {
             display: none;
          }
          .cart-btn-main {
             padding: 8px;
             gap: 0;
          }
        }
      `}</style>
    </header>
  );
};

export default Header;
