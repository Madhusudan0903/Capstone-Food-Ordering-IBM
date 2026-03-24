import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { orderApi } from '../api/api';
import './Orders.css';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderApi.getAll().then(setOrders).catch(() => setOrders([])).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="container loading">Loading orders...</div>;

  return (
    <div className="orders-page container">
      <h1>My Orders</h1>
      {orders.length === 0 ? (
        <div className="no-orders card">
          <p>You haven't placed any orders yet.</p>
          <Link to="/restaurants" className="btn btn-primary">Browse Restaurants</Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((o) => {
            const latestStatus = o.created_at;
            return (
              <Link to={`/orders/${o.id}`} key={o.id} className="order-card card">
                <div className="order-header">
                  <h3>{o.restaurant_name}</h3>
                  <span className="order-date">
                    {new Date(o.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="order-total">${parseFloat(o.total).toFixed(2)}</p>
                <p className="order-id">Order #{o.id}</p>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
