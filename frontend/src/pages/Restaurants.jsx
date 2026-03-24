import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { restaurantApi } from '../api/api';
import './Restaurants.css';

export default function Restaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    cuisine: '',
    minRating: '',
    maxPrice: '',
    search: '',
  });

  useEffect(() => {
    const params = {};
    if (filters.cuisine) params.cuisine = filters.cuisine;
    if (filters.minRating) params.minRating = filters.minRating;
    if (filters.maxPrice) params.maxPrice = filters.maxPrice;
    if (filters.search) params.search = filters.search;

    restaurantApi
      .getAll(params)
      .then(setRestaurants)
      .catch(() => setRestaurants([]))
      .finally(() => setLoading(false));
  }, [filters]);

  return (
    <div className="restaurants-page container">
      <h1>Restaurants</h1>
      <div className="filters card">
        <input
          type="text"
          placeholder="Search by name or cuisine..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          className="search-input"
        />
        <select
          value={filters.cuisine}
          onChange={(e) => setFilters({ ...filters, cuisine: e.target.value })}
        >
          <option value="">All Cuisines</option>
          <option value="Italian">Italian</option>
          <option value="American">American</option>
          <option value="Japanese">Japanese</option>
          <option value="Mexican">Mexican</option>
        </select>
        <select
          value={filters.minRating}
          onChange={(e) => setFilters({ ...filters, minRating: e.target.value })}
        >
          <option value="">Any Rating</option>
          <option value="4">4+ Stars</option>
          <option value="4.5">4.5+ Stars</option>
        </select>
        <select
          value={filters.maxPrice}
          onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
        >
          <option value="">Any Price</option>
          <option value="15">Under $15</option>
          <option value="25">Under $25</option>
          <option value="50">Under $50</option>
        </select>
      </div>

      {loading ? (
        <div className="loading">Loading restaurants...</div>
      ) : (
        <div className="restaurant-grid">
          {restaurants.map((r) => (
            <Link to={`/restaurants/${r.id}`} key={r.id} className="restaurant-card card">
              <div className="restaurant-image">
                <img src={r.image_url || 'https://via.placeholder.com/400x200?text=Restaurant'} alt={r.name} />
              </div>
              <div className="restaurant-info">
                <h3>{r.name}</h3>
                <span className="cuisine">{r.cuisine}</span>
                <div className="rating">
                  ⭐ {parseFloat(r.avg_rating || 0).toFixed(1)} ({r.review_count || 0} reviews)
                </div>
                <p className="delivery">~{r.delivery_time_mins || 30} min delivery</p>
              </div>
            </Link>
          ))}
        </div>
      )}

      {!loading && restaurants.length === 0 && (
        <p className="no-results">No restaurants found. Try different filters.</p>
      )}
    </div>
  );
}
