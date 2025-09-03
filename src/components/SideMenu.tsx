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
              <a href="#" style={{ textDecoration: 'none', color: '#333' }}>Settings</a>
            </li>
            <li style={{ marginBottom: '15px' }}>
              <a href="#" style={{ textDecoration: 'none', color: '#333' }}>Help</a>
            </li>
            <li>
              <a href="#" style={{ textDecoration: 'none', color: '#333' }}>About</a>
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