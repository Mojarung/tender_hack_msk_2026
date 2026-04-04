import React from 'react';

const Pagination = () => {
  return (
    <div className="pagination">
      <button className="page-btn nav-btn prev">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
        <span className="nav-text">Назад</span>
      </button>
      
      <div className="page-numbers">
        <button className="page-btn active">1</button>
        <button className="page-btn">2</button>
        <button className="page-btn">3</button>
        <button className="page-btn">4</button>
        <span className="dots">...</span>
        <button className="page-btn">10</button>
      </div>

      <button className="page-btn nav-btn next">
        <span className="nav-text">Вперед</span>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
      </button>
      <style>{`
        .pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 24px;
          padding: 60px 0;
          width: 100%;
        }
        .page-numbers {
          display: flex;
          gap: 8px;
          align-items: center;
        }
        .page-btn {
          min-width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid var(--border-light);
          background-color: #FFFFFF;
          border-radius: 8px;
          color: var(--text-dark);
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
          padding: 0;
        }
        .page-btn:hover {
          background-color: var(--bg-search);
          border-color: var(--primary-blue);
          color: var(--primary-blue);
        }
        .page-btn.active {
          background-color: var(--primary-blue);
          color: #FFFFFF;
          border-color: var(--primary-blue);
          box-shadow: 0 4px 12px rgba(31, 66, 136, 0.2);
        }
        .nav-btn {
          padding: 0 16px;
          display: flex;
          gap: 8px;
          color: var(--primary-blue);
        }
        .nav-text {
          font-size: 14px;
          font-weight: 700;
        }
        .dots {
          color: var(--text-muted);
          padding: 0 8px;
          font-weight: 700;
        }

        @media (max-width: 600px) {
          .nav-text {
            display: none;
          }
          .pagination {
            gap: 12px;
          }
        }
      `}</style>
    </div>
  );
};

export default Pagination;
