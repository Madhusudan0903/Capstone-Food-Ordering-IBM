import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { menuApi, cartApi, reviewApi } from '../api/api';
import { useAuth } from '../context/AuthContext';
import './RestaurantDetail.css';

export default function RestaurantDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [restaurant, setRestaurant] = useState(null);
  const [menu, setMenu] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingItem, setAddingItem] = useState(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewError, setReviewError] = useState('');
  const [cartMessage, setCartMessage] = useState('');
  const [cartPopup, setCartPopup] = useState('');

  useEffect(() => {
    Promise.all([
      fetch(`/api/restaurants/${id}`).then((r) => r.json()),
      menuApi.getByRestaurant(id),
      reviewApi.getByRestaurant(id),
    ])
      .then(([rest, menuData, revData]) => {
        setRestaurant(rest);
        setMenu(menuData);
        setReviews(revData);
      })
      .catch(() => navigate('/restaurants'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const addToCart = (item, qty = 1) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setCartMessage('');
    setAddingItem(item.id);
    cartApi
      .add(item.id, qty)
      .then(() => {
        setCartPopup(`${item.name} added to cart`);
        setTimeout(() => setCartPopup(''), 1800);
      })
      .catch((err) => setCartMessage(err.message || 'Could not add to cart'))
      .finally(() => setAddingItem(null));
  };

  const submitReview = (e) => {
    e.preventDefault();
    if (!isAuthenticated) return;
    setReviewError('');
    reviewApi
      .create(parseInt(id), null, reviewRating, reviewComment)
      .then(() => {
        setShowReviewForm(false);
        setReviewComment('');
        setReviewRating(5);
        return reviewApi.getByRestaurant(id);
      })
      .then(setReviews)
      .catch((err) => setReviewError(err.message || 'Could not submit review'));
  };

  if (loading || !restaurant) return <div className="container loading">Loading...</div>;

  return (
    <div className="restaurant-detail container">
      {cartPopup && (
        <div className="cart-popup" role="status" aria-live="polite">
          {cartPopup}
        </div>
      )}
      <div className="restaurant-header card">
        <img src={restaurant.image_url || 'https://via.placeholder.com/800x300'} alt={restaurant.name} />
        <div className="restaurant-header-info">
          <h1>{restaurant.name}</h1>
          <p className="cuisine">{restaurant.cuisine}</p>
          <div className="rating">
            ⭐ {parseFloat(restaurant.avg_rating || 0).toFixed(1)} ({restaurant.review_count || 0} reviews)
          </div>
          <p className="delivery">~{restaurant.delivery_time_mins || 30} min • {restaurant.address}</p>
          {cartMessage && <p className="error-msg" role="alert">{cartMessage}</p>}
          <Link to="/cart" className="btn btn-primary">
            View Cart
          </Link>
        </div>
      </div>

      <div className="menu-section">
        <h2>Menu</h2>
        {menu.map((cat) => (
          <div key={cat.id} className="menu-category">
            <h3>{cat.name}</h3>
            <div className="menu-items">
              {cat.items.map((item) => (
                <div key={item.id} className="menu-item card">
                  <div className="menu-item-image">
                    <img src={item.image_url || 'https://via.placeholder.com/120?text=Food'} alt={item.name} />
                  </div>
                  <div className="menu-item-info">
                    <h4>{item.name}</h4>
                    {item.dietary_info && <span className="dietary">{item.dietary_info}</span>}
                    <p>{item.description}</p>
                    <div className="menu-item-footer">
                      <span className="price">${parseFloat(item.price).toFixed(2)}</span>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => addToCart(item)}
                        disabled={!item.is_available || addingItem === item.id}
                      >
                        {addingItem === item.id ? 'Adding...' : 'Add'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="reviews-section card">
        <h2>Reviews</h2>
        {isAuthenticated && (
          <button
            className="btn btn-outline btn-sm"
            onClick={() => {
              setReviewError('');
              setShowReviewForm(!showReviewForm);
            }}
          >
            {showReviewForm ? 'Cancel' : 'Write a Review'}
          </button>
        )}
        {showReviewForm && (
          <form onSubmit={submitReview} className="review-form">
            <div className="form-group">
              <label>Rating</label>
              <select value={reviewRating} onChange={(e) => setReviewRating(parseInt(e.target.value))}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>{n} Star{n > 1 ? 's' : ''}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Comment</label>
              <textarea value={reviewComment} onChange={(e) => setReviewComment(e.target.value)} />
            </div>
            <button type="submit" className="btn btn-primary">Submit Review</button>
            {reviewError && <p className="error-msg" role="alert">{reviewError}</p>}
          </form>
        )}
        <div className="reviews-list">
          {reviews.map((r) => (
            <div key={r.id} className="review-item">
              <div className="review-header">
                <strong>{r.first_name} {r.last_name}</strong>
                <span>⭐ {r.rating}</span>
              </div>
              {r.comment && <p>{r.comment}</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
