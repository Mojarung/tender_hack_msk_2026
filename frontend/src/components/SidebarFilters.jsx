import React, { useState } from 'react';

const SidebarFilters = () => {
  const [expanded, setExpanded] = useState({
    categories: true,
    region: false,
    okpd2: false,
    price: true
  });

  const toggleSection = (section) => {
    setExpanded(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const FilterSection = ({ title, section, children }) => (
    <div className={`filter-section ${expanded[section] ? 'is-expanded' : ''}`}>
      <div className="filter-header" onClick={() => toggleSection(section)}>
        <span>{title}</span>
        <svg 
          width="14" 
          height="14" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className="chevron-icon"
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </div>
      <div className="filter-content-wrapper">
        <div className="filter-content-inner">
          <div className="filter-content">
            {children}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <aside className="sidebar-filters animate-fade-in">
      <h3>Фильтры</h3>
      
      <FilterSection title="Категории" section="categories">
        <ul>
          <li><label><input type="checkbox" defaultChecked /> Электроника (124)</label></li>
          <li><label><input type="checkbox" /> Офисная техника (56)</label></li>
          <li><label><input type="checkbox" /> Комплектующие (89)</label></li>
          <li><label><input type="checkbox" /> Расходные материалы (210)</label></li>
        </ul>
      </FilterSection>

      <FilterSection title="Регион поставки" section="region">
        <input type="text" placeholder="Поиск региона..." className="filter-input" />
        <ul>
          <li><label><input type="checkbox" /> Москва</label></li>
          <li><label><input type="checkbox" /> Московская область</label></li>
        </ul>
      </FilterSection>

      <FilterSection title="Цена, ₽" section="price">
        <div className="price-inputs">
          <input type="text" placeholder="От" />
          <input type="text" placeholder="До" />
        </div>
      </FilterSection>

      <style>{`
        .sidebar-filters {
          background-color: transparent;
          width: 260px;
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .sidebar-filters h3 {
          font-size: 18px;
          font-weight: 800;
          margin-bottom: 8px;
          color: var(--black);
        }
        .filter-section {
          background-color: #FFFFFF;
          border: 1px solid var(--border-light);
          border-radius: 8px;
          overflow: hidden;
          transition: border-color 0.2s ease;
        }
        .filter-header {
          padding: 12px 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
          font-weight: 700;
          font-size: 14px;
          user-select: none;
          color: var(--black);
          transition: background-color 0.2s ease;
        }
        .filter-header:hover {
          background-color: #F9FAFB;
        }
        .chevron-icon {
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          color: var(--pale-black);
        }
        .is-expanded .chevron-icon {
          transform: rotate(180deg);
          color: var(--primary-blue);
        }
        
        .filter-content-wrapper {
          display: grid;
          grid-template-rows: 0fr;
          transition: grid-template-rows 0.35s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .is-expanded .filter-content-wrapper {
          grid-template-rows: 1fr;
        }
        .filter-content-inner {
          overflow: hidden;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .is-expanded .filter-content-inner {
          opacity: 1;
        }
        
        .filter-content {
          padding: 0 16px 16px 16px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .filter-content ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .filter-content li {
          margin-bottom: 8px;
        }
        .filter-content label {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 13px;
          cursor: pointer;
          color: var(--black);
          font-weight: 500;
          transition: color 0.2s ease;
        }
        .filter-content label:hover {
          color: var(--primary-red);
        }
        .filter-content input[type="checkbox"] {
          accent-color: var(--primary-blue);
          width: 14px;
          height: 14px;
          cursor: pointer;
        }
        .filter-input {
          width: 100%;
          padding: 8px 12px;
          border: 1px solid var(--border-light);
          border-radius: 6px;
          font-size: 13px;
          margin-bottom: 12px;
          outline: none;
          transition: all 0.2s ease;
          background-color: #F9FAFB;
          font-weight: 500;
        }
        .filter-input:focus {
          border-color: var(--primary-blue);
          background-color: #FFFFFF;
        }
        .price-inputs {
          display: flex;
          gap: 8px;
        }
        .price-inputs input {
          width: 50%;
          padding: 8px 12px;
          border: 1px solid var(--border-light);
          border-radius: 6px;
          font-size: 13px;
          outline: none;
          background-color: #F9FAFB;
          font-weight: 600;
        }
        .price-inputs input:focus {
          border-color: var(--primary-blue);
          background-color: #FFFFFF;
        }
      `}</style>
    </aside>
  );
};

export default SidebarFilters;
