import { useNavigate, useLocation } from 'react-router-dom';

export default function Navbar_24BCE0034_Akhileswar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      padding: '0 32px',
      height: 52,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: '#ffffff',
      borderBottom: '1px solid #e5e7eb',
      boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
    }}>

      {/* Logo */}
      <div
        onClick={() => navigate('/')}
        style={{
          fontWeight: 900,
          fontSize: 18,
          letterSpacing: '-0.06em',
          color: '#111827',
          cursor: 'pointer',
          userSelect: 'none',
        }}
      >
        KAR
      </div>

      {/* Links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        {[
          { label: 'Home', path: '/' },
          { label: 'Planner', path: '/planner' },
        ].map(({ label, path }) => {
          const isActive = location.pathname === path;
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              style={{
                padding: '5px 14px',
                borderRadius: 6,
                fontSize: 13,
                fontWeight: isActive ? 600 : 500,
                border: 'none',
                cursor: 'pointer',
                backgroundColor: isActive ? '#eef2ff' : 'transparent',
                color: isActive ? '#4f46e5' : '#6b7280',
                transition: 'all 0.15s ease',
              }}
            >
              {label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}