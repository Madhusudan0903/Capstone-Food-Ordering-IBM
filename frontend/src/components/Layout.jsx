import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Layout.css';

export default function Layout() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="layout">
      <header className="header">
        <div className="container header-inner">
          <Link to="/" className="logo">
            <span className="logo-icon">🍔</span>
            FoodEase
          </Link>
          <nav className="nav">
            <Link to="/restaurants">Restaurants</Link>
            {isAuthenticated ? (
              <>
                <Link to="/cart">Cart</Link>
                <Link to="/orders">Orders</Link>
                <Link to="/profile" data-testid="nav-profile">
                  Profile
                </Link>
                <span className="user-name">{user?.firstName}</span>
                <button onClick={handleLogout} className="btn btn-outline btn-sm">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login">Login</Link>
                <Link to="/register" className="btn btn-primary btn-sm">
                  Sign Up
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>
      <main className="main">
        <Outlet />
      </main>
      <footer className="footer">
        <div className="container">
          <p>© 2025 FoodEase - Capstone Food Ordering Platform</p>
        </div>
      </footer>
    </div>
  );
}
