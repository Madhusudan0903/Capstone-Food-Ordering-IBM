import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { cartApi } from '../api/api';
import './Cart.css';

export default function Cart() {
  const [cart, setCart] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cartApi
      .get()
      .then(({ cart: c, items: i }) => {
        setCart(c);
        setItems(i || []);
      })
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  const updateQuantity = (id, quantity) => {
    if (quantity < 1) return;
    cartApi
      .updateItem(id, quantity)
      .then(({ items: i }) => setItems(i))
      .catch((err) => alert(err.message));
  };

  const removeItem = (id) => {
    cartApi
      .removeItem(id)
      .then(() => cartApi.get())
      .then(({ cart: c, items: i }) => {
        setCart(c);
        setItems(i || []);
      })
      .catch((err) => alert(err.message));
  };

  const clearCart = () => {
    if (!confirm('Clear all items from cart?')) return;
    cartApi
      .clear()
      .then(() => {
        setCart(null);
        setItems([]);
      })
      .catch((err) => alert(err.message));
  };

  const subtotal = items.reduce((sum, i) => sum + parseFloat(i.price) * i.quantity, 0);

  if (loading) return <div className="container loading">Loading cart...</div>;

  if (!cart || items.length === 0) {
    return (
      <div className="container cart-empty">
        <h2>Your cart is empty</h2>
        <Link to="/restaurants" className="btn btn-primary">
          Browse Restaurants
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-page container">
      <h1>Cart</h1>
      <p className="restaurant-name">{cart.restaurant_name}</p>
      <div className="cart-items">
        {items.map((item) => (
          <div key={item.id} className="cart-item card">
            <img src={item.image_url || 'https://via.placeholder.com/80?text=Item'} alt={item.name} />
            <div className="cart-item-details">
              <h4>{item.name}</h4>
              <p>${parseFloat(item.price).toFixed(2)} each</p>
              <div className="quantity-controls">
                <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                <span>{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
              </div>
            </div>
            <div className="cart-item-total">
              <span>${(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
              <button className="remove-btn" onClick={() => removeItem(item.id)}>Remove</button>
            </div>
          </div>
        ))}
      </div>
      <div className="cart-footer card">
        <p className="subtotal">Subtotal: ${subtotal.toFixed(2)}</p>
        <p className="note">Delivery fee and tax calculated at checkout</p>
        <div className="cart-actions">
          <button className="btn btn-outline" onClick={clearCart}>Clear Cart</button>
          <Link to="/checkout" className="btn btn-primary" data-testid="checkout-link">
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}
