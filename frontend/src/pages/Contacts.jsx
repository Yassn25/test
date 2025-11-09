import { useEffect, useState } from 'react';
import Layout from '../components/Layout.jsx';
import {
  createContact,
  deleteContact,
  getContacts,
  updateContact,
} from '../services/contactService.js';

const initialForm = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  tags: '',
};

const ContactsPage = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedContactId, setSelectedContactId] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');

  const loadContacts = async () => {
    try {
      setLoading(true);
      const list = await getContacts();
      setContacts(list);
    } catch (err) {
      console.error(err);
      setError('Unable to fetch contacts.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContacts();
  }, []);

  const resetForm = () => {
    setForm(initialForm);
    setSelectedContactId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');

    const payload = {
      ...form,
      tags: form.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
    };

    try {
      if (selectedContactId) {
        await updateContact(selectedContactId, payload);
      } else {
        await createContact(payload);
      }
      await loadContacts();
      resetForm();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Unable to save contact.');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (contact) => {
    setSelectedContactId(contact.id);
    setForm({
      firstName: contact.first_name,
      lastName: contact.last_name || '',
      email: contact.email || '',
      phone: contact.phone || '',
      tags: contact.tags?.join(', ') || '',
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this contact?')) return;

    try {
      await deleteContact(id);
      await loadContacts();
    } catch (err) {
      console.error(err);
      setError('Unable to delete contact.');
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Layout>
      <div className="stack">
        <div>
          <h1 style={{ margin: 0 }}>Contacts</h1>
          <p style={{ color: '#6b7280' }}>
            Manage the audience for your SMS, WhatsApp, and Email campaigns.
          </p>
        </div>

        <section className="card">
          <div className="card-header">
            <h2 style={{ margin: 0 }}>{selectedContactId ? 'Update contact' : 'Add new contact'}</h2>
            {selectedContactId && (
              <button type="button" className="button secondary" onClick={resetForm}>
                Cancel edit
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="stack-horizontal" style={{ alignItems: 'end' }}>
            <div style={{ flex: 1 }}>
              <label htmlFor="firstName">First name</label>
              <input
                id="firstName"
                name="firstName"
                className="input"
                value={form.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div style={{ flex: 1 }}>
              <label htmlFor="lastName">Last name</label>
              <input
                id="lastName"
                name="lastName"
                className="input"
                value={form.lastName}
                onChange={handleChange}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                className="input"
                value={form.email}
                onChange={handleChange}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label htmlFor="phone">Phone</label>
              <input
                id="phone"
                name="phone"
                className="input"
                value={form.phone}
                onChange={handleChange}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label htmlFor="tags">Tags (comma separated)</label>
              <input
                id="tags"
                name="tags"
                className="input"
                value={form.tags}
                onChange={handleChange}
              />
            </div>
            <div>
              <button type="submit" className="button" disabled={saving}>
                {saving ? 'Saving...' : selectedContactId ? 'Update contact' : 'Add contact'}
              </button>
            </div>
          </form>

          {error && <div className="error-text">{error}</div>}
        </section>

        <section className="card">
          <div className="card-header">
            <h2 style={{ margin: 0 }}>All contacts</h2>
          </div>
          {loading ? (
            <p style={{ margin: 0, color: '#6b7280' }}>Loading contacts...</p>
          ) : contacts.length === 0 ? (
            <p style={{ margin: 0, color: '#6b7280' }}>No contacts yet. Create your first one.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Tags</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {contacts.map((contact) => (
                    <tr key={contact.id}>
                      <td>
                        {contact.first_name} {contact.last_name}
                      </td>
                      <td>{contact.email || '-'}</td>
                      <td>{contact.phone || '-'}</td>
                      <td>
                        {contact.tags?.length ? (
                          <div className="stack-horizontal">
                            {contact.tags.map((tag) => (
                              <span key={tag} className="pill">
                                {tag}
                              </span>
                            ))}
                          </div>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td>
                        <div className="stack-horizontal">
                          <button type="button" className="button secondary" onClick={() => handleEdit(contact)}>
                            Edit
                          </button>
                          <button
                            type="button"
                            className="button secondary"
                            onClick={() => handleDelete(contact.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </Layout>
  );
};

export default ContactsPage;
