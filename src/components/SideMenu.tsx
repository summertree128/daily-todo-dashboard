import { useState } from 'react';

interface SideMenuProps {
  onClose: () => void;
  isOpen: boolean;
}

export const SideMenu: React.FC<SideMenuProps> = ({ onClose, isOpen }) => {
  return (
    <>
      {/* Overlay */}
      <div
        className={`menu-overlay ${isOpen ? 'active' : ''}`}
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          opacity: isOpen ? 1 : 0,
          visibility: isOpen ? 'visible' : 'hidden',
          transition: 'opacity 0.3s ease, visibility 0.3s ease',
          zIndex: 1000,
        }}
      />

      {/* Menu Panel */}
      <div
        className={`side-menu ${isOpen ? 'open' : ''}`}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          width: '250px',
          backgroundColor: 'white',
          boxShadow: '2px 0 5px rgba(0, 0, 0, 0.1)',
          transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.3s ease',
          zIndex: 1001,
          padding: '20px',
        }}
      >
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ margin: 0, fontSize: '1.5rem' }}>Menu</h2>
        </div>
        <nav>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <li style={{ marginBottom: '15px' }}>
              <a href="#" style={{ textDecoration: 'none', color: '#333' }}>About</a>
            </li>
            <li style={{ marginBottom: '15px' }}>
              <a href="#" style={{ textDecoration: 'none', color: '#333' }}>利用規約</a>
            </li>
            <li style={{ marginBottom: '15px' }}>
              <a 
                href="https://github.com/summertree128/daily-todo-dashboard" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ 
                  textDecoration: 'none', 
                  color: '#333',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
};

export const MenuButton: React.FC<{ onClick: () => void; isOpen: boolean }> = ({ onClick, isOpen }) => {
  return (
    <button
      onClick={onClick}
      style={{
        position: 'fixed',
        top: '20px',
        left: '20px',
        zIndex: 1002,
        background: 'none',
        border: 'none',
        padding: '10px',
        cursor: 'pointer',
        opacity: isOpen ? 0 : 1,
        visibility: isOpen ? 'hidden' : 'visible',
        transition: 'opacity 0.3s ease, visibility 0.3s ease',
      }}
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="3" y1="12" x2="21" y2="12" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <line x1="3" y1="18" x2="21" y2="18" />
      </svg>
    </button>
  );
}; 