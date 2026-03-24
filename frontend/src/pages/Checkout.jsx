import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { cartApi, orderApi, couponApi, userApi } from '../api/api';
import './Checkout.css';

export default function Checkout() {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [items, setItems] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [addressId, setAddressId] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [couponMsg, setCouponMsg] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [paymentError, setPaymentError] = useState('');
  const [paymentForm, setPaymentForm] = useState({
    cardHolderName: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
    upiId: '',
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [orderError, setOrderError] = useState('');

  useEffect(() => {
    Promise.all([cartApi.get(), userApi.getAddresses()])
      .then(([{ cart: c, items: i }, addrs]) => {
        setCart(c);
        setItems(i || []);
        setAddresses(addrs);
        if (addrs.length > 0) {
          const defaultAddr = addrs.find((a) => a.is_default) || addrs[0];
          setAddressId(String(defaultAddr.id));
        }
      })
      .catch(() => navigate('/cart'))
      .finally(() => setLoading(false));
  }, [navigate]);

  const subtotal = items.reduce((sum, i) => sum + parseFloat(i.price) * i.quantity, 0);
  const discount = couponDiscount;
  const deliveryFee = 3;
  const tax = Math.round((subtotal - discount + deliveryFee) * 0.09 * 100) / 100;
  const total = Math.round((subtotal - discount + deliveryFee + tax) * 100) / 100;

  const validateCoupon = () => {
    if (!couponCode.trim()) return;
    setCouponMsg('');
    couponApi
      .validate(couponCode.trim(), subtotal)
      .then((data) => {
        setCouponMsg(`Valid! You save $${data.discount.toFixed(2)}`);
        setCouponDiscount(data.discount);
      })
      .catch((err) => {
        setCouponMsg(err.message);
        setCouponDiscount(0);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setPaymentError('');
    setOrderError('');
    if (!addressId) {
      setOrderError('Please select a delivery address');
      return;
    }
    if (paymentMethod === 'card') {
      if (!paymentForm.cardHolderName || !paymentForm.cardNumber || !paymentForm.expiry || !paymentForm.cvv) {
        setPaymentError('Please fill all card details');
        return;
      }
    }
    if (paymentMethod === 'upi' && !paymentForm.upiId) {
      setPaymentError('Please enter a valid UPI ID');
      return;
    }
    setSubmitting(true);
    const paymentPayload = {
      method: paymentMethod,
      cardHolderName: paymentForm.cardHolderName,
      cardNumber: paymentForm.cardNumber,
      expiry: paymentForm.expiry,
      cvv: paymentForm.cvv,
      upiId: paymentForm.upiId,
    };
    orderApi
      .create(
        parseInt(addressId),
        couponCode.trim() || undefined,
        notes.trim() || undefined,
        paymentPayload
      )
      .then(({ order }) => {
        navigate(`/orders/${order.id}`);
      })
      .catch((err) => {
        setOrderError(err.message || 'Order failed');
        setSubmitting(false);
      });
  };

  if (loading) return <div className="container loading">Loading...</div>;

  if (!cart || items.length === 0) {
    return (
      <div className="container">
        <p>Your cart is empty.</p>
        <Link to="/restaurants">Browse Restaurants</Link>
      </div>
    );
  }

  return (
    <div className="checkout-page container">
      <h1>Checkout</h1>
      <form onSubmit={handleSubmit}>
        <div className="checkout-grid">
          <div className="checkout-main">
            <div className="card section">
              <h3>Delivery Address</h3>
              {addresses.length === 0 ? (
                <p>
                  <Link to="/profile">Add an address</Link> in your profile first, or we need an address form here.
                </p>
              ) : (
                addresses.map((a) => (
                  <label key={a.id} className="address-option">
                    <input
                      type="radio"
                      name="address"
                      value={a.id}
                      checked={addressId === String(a.id)}
                      onChange={() => setAddressId(String(a.id))}
                    />
                    <span>
                      <strong>{a.label}</strong> - {a.street}, {a.city}, {a.state} {a.postal_code}
                    </span>
                  </label>
                ))
              )}
              <Link to="/profile" className="add-address-link">+ Add new address</Link>
            </div>

            <div className="card section">
              <h3>Coupon</h3>
              <div className="coupon-row">
                <input
                  type="text"
                  placeholder="Enter coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                />
                <button type="button" className="btn btn-outline" onClick={validateCoupon}>
                  Apply
                </button>
              </div>
              {couponMsg && (
                <p className={couponDiscount > 0 ? 'coupon-success' : 'coupon-error'}>{couponMsg}</p>
              )}
            </div>

            <div className="card section">
              <h3>Payment (Mock)</h3>
              <div className="payment-methods">
                <label>
                  <input type="radio" name="paymentMethod" value="card" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} />
                  Card
                </label>
                <label>
                  <input type="radio" name="paymentMethod" value="upi" checked={paymentMethod === 'upi'} onChange={() => setPaymentMethod('upi')} />
                  UPI
                </label>
                <label>
                  <input type="radio" name="paymentMethod" value="wallet" checked={paymentMethod === 'wallet'} onChange={() => setPaymentMethod('wallet')} />
                  Wallet
                </label>
                <label>
                  <input type="radio" name="paymentMethod" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} />
                  Cash on Delivery
                </label>
              </div>

              {paymentMethod === 'card' && (
                <>
                  <div className="form-group">
                    <label>Card Holder Name</label>
                    <input
                      placeholder="John Doe"
                      value={paymentForm.cardHolderName}
                      onChange={(e) => setPaymentForm({ ...paymentForm, cardHolderName: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Card Number (Mock)</label>
                    <input
                      placeholder="4111111111111111"
                      value={paymentForm.cardNumber}
                      onChange={(e) => setPaymentForm({ ...paymentForm, cardNumber: e.target.value })}
                    />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Expiry</label>
                      <input
                        placeholder="12/30"
                        value={paymentForm.expiry}
                        onChange={(e) => setPaymentForm({ ...paymentForm, expiry: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label>CVV</label>
                      <input
                        placeholder="123"
                        value={paymentForm.cvv}
                        onChange={(e) => setPaymentForm({ ...paymentForm, cvv: e.target.value })}
                      />
                    </div>
                  </div>
                </>
              )}

              {paymentMethod === 'upi' && (
                <div className="form-group">
                  <label>UPI ID</label>
                  <input
                    placeholder="name@upi"
                    value={paymentForm.upiId}
                    onChange={(e) => setPaymentForm({ ...paymentForm, upiId: e.target.value })}
                  />
                </div>
              )}

              {paymentMethod === 'wallet' && <p className="payment-note">Mock wallet payment will be auto-approved.</p>}
              {paymentMethod === 'cod' && <p className="payment-note">Cash on Delivery - pay when order arrives.</p>}
              {paymentError && <p className="coupon-error">{paymentError}</p>}
            </div>

            <div className="card section">
              <h3>Order Notes</h3>
              <textarea
                placeholder="Delivery instructions (optional)"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <div className="checkout-sidebar card">
            <h3>Order Summary</h3>
            <div className="order-items">
              {items.map((i) => (
                <p key={i.id}>
                  {i.name} x{i.quantity} - ${(parseFloat(i.price) * i.quantity).toFixed(2)}
                </p>
              ))}
            </div>
            <div className="totals">
              <p>Subtotal: ${subtotal.toFixed(2)}</p>
              {discount > 0 && <p className="discount">Discount: -${discount.toFixed(2)}</p>}
              <p>Delivery: ${deliveryFee.toFixed(2)}</p>
              <p>Tax: ${tax.toFixed(2)}</p>
              <p className="total">Total: ${total.toFixed(2)}</p>
            </div>
            {orderError && (
              <p className="coupon-error" data-testid="order-error" role="alert">
                {orderError}
              </p>
            )}
            <button type="submit" className="btn btn-primary btn-block" disabled={submitting || addresses.length === 0}>
              {submitting ? 'Placing Order...' : 'Place Order'}
            </button>
            <p className="payment-note">Payment simulated - no real charge</p>
          </div>
        </div>
      </form>
    </div>
  );
}
