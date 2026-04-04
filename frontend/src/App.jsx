import React, { useState } from 'react';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import SidebarFilters from './components/SidebarFilters';
import ProductCard from './components/ProductCard';
import Pagination from './components/Pagination';
import CartPage from './components/CartPage';

const mockProducts = [
  {
    id: '30245617',
    title: 'Флеш-диск USB 64Гб, USB 3.0, металл, серебристый',
    category: 'Носители информации',
    model: 'Kingston DataTraveler',
    price: '850',
    image: 'https://images.unsplash.com/photo-1622340576352-73138b0be141?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: '32551908',
    title: 'Флешка 32 Гб USB 2.0, пластик, черный',
    category: 'Носители информации',
    model: 'SanDisk Cruzer Blade',
    price: '420',
    image: 'https://images.unsplash.com/photo-1622340576352-73138b0be141?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: '15882341',
    title: 'Внешний жесткий диск 1Тб, 2.5", USB 3.0, черный',
    category: 'Носители информации',
    model: 'WD Elements Portable',
    price: '5200',
    image: 'https://images.unsplash.com/photo-1531053270060-6643c5e729fc?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: '22998410',
    title: 'Карта памяти MicroSDXC 128Гб UHS-I U3 V30 A2',
    category: 'Носители информации',
    model: 'Samsung EVO Plus',
    price: '1890',
    image: 'https://images.unsplash.com/photo-1563821010777-62f48d35f79b?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: '44110928',
    title: 'Кабель USB 2.0 A (m) - Micro B (m), 1.0м, черный',
    category: 'Аксессуары',
    model: 'Buro USB 2.0',
    price: '150',
    image: 'https://images.unsplash.com/photo-1589939705384-5185138a04b9?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: '55667788',
    title: 'Мышь беспроводная оптическая, 1000 dpi, USB',
    category: 'Компьютерная периферия',
    model: 'Logitech M185',
    price: '1250',
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?q=80&w=400&auto=format&fit=crop'
  }
];

function App() {
  const [currentPage, setCurrentPage] = useState('catalog');

  const renderContent = () => {
    if (currentPage === 'cart') {
      return <CartPage setPage={setCurrentPage} />;
    }

    return (
      <main className="main-content container">
        <div className="catalog-layout">
          <SidebarFilters />
          <div className="catalog-main">
            <div className="product-grid">
              {mockProducts.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          </div>
        </div>
        <Pagination />
      </main>
    );
  };

  return (
    <div className="app-wrapper">
      <Header setPage={setCurrentPage} />
      <SearchBar />
      
      {renderContent()}

      <footer className="site-footer">
        <div className="container">
          <p>© 2024 Портал поставщиков. Все права защищены.</p>
        </div>
      </footer>

      <style>{`
        .app-wrapper {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          width: 100%;
        }
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 16px;
        }
        .main-content {
          padding-top: 24px;
          flex: 1;
        }
        .page-header {
          margin-bottom: 12px;
        }

        .catalog-layout {
          display: flex;
          gap: 32px;
          margin-top: 12px;
          align-items: flex-start;
        }
        .catalog-main {
          flex: 1;
        }
        .product-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }
        .site-footer {
          background-color: #FFFFFF;
          border-top: 1px solid var(--border-light);
          padding: 40px 0;
          margin-top: 60px;
          color: var(--text-muted);
          font-size: 14px;
          text-align: center;
        }

        @media (max-width: 1024px) {
          .product-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .catalog-layout {
            flex-direction: column;
          }
          .sidebar-filters {
            width: 100%;
          }
          .product-grid {
            grid-template-columns: 1fr;
          }
          .catalog-actions {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}

export default App;
