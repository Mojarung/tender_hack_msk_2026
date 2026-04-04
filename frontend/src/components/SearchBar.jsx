import React from 'react';

const SearchBar = () => {
  return (
    <div className="search-section animate-fade-in" style={{animationDelay: '0.1s'}}>
      <div className="container search-container">
        <div className="search-input-wrapper">
          <div className="input-group">
            <div className="search-main">
              <div className="search-icon-fixed">
                 <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              </div>
              <input 
                type="text" 
                placeholder="Поиск по наименованию, ID, категории, OKПД2..." 
                className="search-input"
              />
            </div>
            <div className="search-extra">
              <input 
                type="text" 
                placeholder="ИНН" 
                className="search-inn"
              />
              <button className="search-submit-btn">
                Найти
              </button>
            </div>
          </div>
          <div className="search-links">
            <a href="#" className="search-link">Найдено в 345 категориях</a>
            <span className="separator">•</span>
            <a href="#" className="search-link">Есть предложения</a>
          </div>
        </div>
      </div>
      <style>{`
        .search-section {
          background-color: #FFFFFF;
          padding: 24px 0;
          border-bottom: 1px solid var(--border-light);
        }
        .search-container {
          display: flex;
          justify-content: center;
        }
        .search-input-wrapper {
          flex: 1;
          max-width: 900px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .input-group {
          display: flex;
          width: 100%;
          min-height: 52px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.03);
          border-radius: 8px;
          overflow: hidden;
          border: 1px solid var(--border-light);
          background-color: white;
          transition: all 0.2s ease;
        }
        .input-group:focus-within {
          border-color: var(--primary-blue);
          box-shadow: 0 4px 15px rgba(31, 66, 136, 0.1);
        }
        .search-main {
          flex: 1;
          position: relative;
          display: flex;
          align-items: center;
        }
        .search-extra {
          display: flex;
          border-left: 1px solid var(--border-light);
        }
        .search-icon-fixed {
          position: absolute;
          left: 16px;
          color: var(--pale-black);
          z-index: 10;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
        }
        .search-input {
          flex: 1;
          width: 100%;
          padding: 10px 16px 10px 48px;
          font-size: 15px;
          font-weight: 500;
          border: none;
          outline: none;
          background-color: transparent;
          color: var(--black);
        }
        .search-input::placeholder {
          color: #A0AEC0;
          font-weight: 400;
        }
        .search-inn {
          width: 200px;
          border: none;
          border-left: 0;
          padding: 10px 20px;
          font-size: 15px;
          font-weight: 500;
          outline: none;
          background-color: #F9FAFB;
          transition: all 0.2s ease;
          color: var(--black);
        }
        .search-inn:focus {
          background-color: #FFFFFF;
        }
        .search-submit-btn {
          background-color: var(--primary-red);
          color: white;
          border: none;
          padding: 0 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-weight: 700;
          font-size: 15px;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .search-submit-btn:hover {
          background-color: var(--primary-red-hover);
        }
        .search-links {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
          align-items: center;
          padding-left: 4px;
        }
        .search-link {
          font-size: 13px;
          color: var(--primary-blue);
          font-weight: 600;
          text-decoration: none;
          transition: color 0.2s ease;
        }
        .search-link:hover {
          color: var(--primary-red);
        }
        .separator {
          color: #E2E8F0;
          font-size: 12px;
        }

        @media (max-width: 768px) {
          .input-group {
            flex-direction: column;
            height: auto;
          }
          .search-extra {
            border-left: none;
            border-top: 1px solid var(--border-light);
          }
          .search-inn {
            width: 100%;
            border-right: 1px solid var(--border-light);
          }
          .search-submit-btn {
            padding: 16px;
          }
        }
      `}</style>
    </div>
  );
};

export default SearchBar;
