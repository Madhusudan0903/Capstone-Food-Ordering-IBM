import { Link } from 'react-router-dom';
import './Home.css';

export default function Home() {
  return (
    <div className="home">
      <section className="hero">
        <div className="container hero-content">
          <h1>Order delicious food to your doorstep</h1>
          <p className="hero-subtext">Browse restaurants, customize your order, and track delivery in real-time.</p>
          <Link to="/restaurants" className="btn btn-primary btn-lg">
            Browse Restaurants
          </Link>
        </div>
      </section>
      <section className="features container">
        <h2>Why FoodEase?</h2>
        <div className="features-grid">
          <div className="feature-card card">
            <span className="feature-icon">🔍</span>
            <h3>Search & Filter</h3>
            <p>Find by cuisine, rating, and price range</p>
          </div>
          <div className="feature-card card">
            <span className="feature-icon">🛒</span>
            <h3>Easy Cart</h3>
            <p>Add items, apply coupons, quick checkout</p>
          </div>
          <div className="feature-card card">
            <span className="feature-icon">📍</span>
            <h3>Track Order</h3>
            <p>Real-time status from preparing to delivered</p>
          </div>
        </div>
      </section>
    </div>
  );
}
