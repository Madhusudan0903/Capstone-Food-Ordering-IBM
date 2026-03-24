import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { orderApi, reviewApi } from '../api/api';
import { useAuth } from '../context/AuthContext';
import './OrderDetail.css';

const STATUS_LABELS = {
  pending: 'Order Placed',
  confirmed: 'Confirmed',
  preparing: 'Preparing',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

export default function OrderDetail() {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showReview, setShowReview] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  useEffect(() => {
    orderApi
      .getById(id)
      .then(setOrder)
      .catch(() => setOrder(null))
      .finally(() => setLoading(false));
  }, [id]);

  const submitReview = (e) => {
    e.preventDefault();
    if (!isAuthenticated) return;
    reviewApi
      .create(order.restaurant_id, parseInt(id), reviewRating, reviewComment)
      .then(() => {
        setShowReview(false);
        setOrder({ ...order });
      })
      .catch((err) => alert(err.message));
  };

  if (loading) return <div className="container loading">Loading order...</div>;
  if (!order) return <div className="container">Order not found.</div>;

  const currentStatus = order.statuses?.length ? order.statuses[order.statuses.length - 1].status : 'pending';
  const estimatedDelivery = order.estimated_delivery_at
    ? new Date(order.estimated_delivery_at).toLocaleString()
    : 'Calculating...';

  return (
    <div className="order-detail container">
      <h1>Order #{order.id}</h1>
      <div className="order-status-card card">
        <h3>Status: {STATUS_LABELS[currentStatus] || currentStatus}</h3>
        <p className="estimated-delivery">Estimated delivery: {estimatedDelivery}</p>
        <div className="status-timeline">
          {order.statuses?.map((s) => (
            <div key={s.id} className="status-step">
              <span className="status-dot"></span>
              <div>
                <strong>{STATUS_LABELS[s.status] || s.status}</strong>
                <p className="status-date">{new Date(s.created_at).toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="order-info card">
        <h3>{order.restaurant_name}</h3>
        <p className="delivery-address">
          Deliver to: {order.street}, {order.city}, {order.state} {order.postal_code}
        </p>
        <div className="order-items">
          {order.items?.map((i) => (
            <p key={i.id}>
              {i.name} x{i.quantity} - ${(parseFloat(i.price) * i.quantity).toFixed(2)}
            </p>
          ))}
        </div>
        <div className="order-totals">
          <p>Subtotal: ${parseFloat(order.subtotal).toFixed(2)}</p>
          {parseFloat(order.discount) > 0 && (
            <p>Discount: -${parseFloat(order.discount).toFixed(2)}</p>
          )}
          <p>Delivery: ${parseFloat(order.delivery_fee).toFixed(2)}</p>
          <p>Tax: ${parseFloat(order.tax).toFixed(2)}</p>
          <p className="total">Total: ${parseFloat(order.total).toFixed(2)}</p>
        </div>
      </div>

      {currentStatus === 'delivered' && isAuthenticated && (
        <div className="review-section card">
          <h3>Rate this order</h3>
          {!showReview ? (
            <button className="btn btn-primary" onClick={() => setShowReview(true)}>
              Write a Review
            </button>
          ) : (
            <form onSubmit={submitReview}>
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
            </form>
          )}
        </div>
      )}

      <Link to="/orders" className="btn btn-outline">Back to Orders</Link>
    </div>
  );
}
