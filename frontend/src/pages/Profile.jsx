import { useState, useEffect } from 'react';
import { userApi } from '../api/api';
import './Profile.css';

export default function Profile() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    label: 'Home',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'USA',
    isDefault: false,
  });

  useEffect(() => {
    userApi.getAddresses().then(setAddresses).finally(() => setLoading(false));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    userApi
      .addAddress(form)
      .then((addr) => {
        setAddresses([...addresses, addr]);
        setShowForm(false);
        setForm({ label: 'Home', street: '', city: '', state: '', postalCode: '', country: 'USA', isDefault: false });
      })
      .catch((err) => alert(err.message));
  };

  const deleteAddr = (id) => {
    if (!confirm('Delete this address?')) return;
    userApi.deleteAddress(id).then(() => setAddresses(addresses.filter((a) => a.id !== id))).catch((err) => alert(err.message));
  };

  if (loading) return <div className="container loading">Loading...</div>;

  return (
    <div className="profile-page container">
      <h1>My Addresses</h1>
      <div className="addresses-list">
        {addresses.map((a) => (
          <div key={a.id} className="address-card card">
            <strong>{a.label}</strong>
            {a.is_default && <span className="badge">Default</span>}
            <p>{a.street}, {a.city}, {a.state} {a.postal_code}</p>
            <button className="btn btn-outline btn-sm" onClick={() => deleteAddr(a.id)}>Delete</button>
          </div>
        ))}
      </div>
      {!showForm ? (
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>+ Add Address</button>
      ) : (
        <form onSubmit={handleSubmit} className="address-form card">
          <h3>Add Address</h3>
          <div className="form-group">
            <label htmlFor="addr-label">Label</label>
            <input id="addr-label" value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} required />
          </div>
          <div className="form-group">
            <label htmlFor="addr-street">Street</label>
            <input id="addr-street" value={form.street} onChange={(e) => setForm({ ...form, street: e.target.value })} required />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="addr-city">City</label>
              <input id="addr-city" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} required />
            </div>
            <div className="form-group">
              <label htmlFor="addr-state">State</label>
              <input id="addr-state" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="addr-postal">Postal Code</label>
            <input id="addr-postal" value={form.postalCode} onChange={(e) => setForm({ ...form, postalCode: e.target.value })} required />
          </div>
          <label className="checkbox">
            <input type="checkbox" checked={form.isDefault} onChange={(e) => setForm({ ...form, isDefault: e.target.checked })} />
            Set as default
          </label>
          <div className="form-actions">
            <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save</button>
          </div>
        </form>
      )}
    </div>
  );
}
