import { useEffect, useState } from 'react';
import Layout from '../components/Layout.jsx';
import {
  createCampaign,
  getCampaigns,
  updateCampaignStatus,
} from '../services/campaignService.js';

const channels = [
  { value: 'sms', label: 'SMS' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'email', label: 'Email' },
];

const statuses = ['draft', 'scheduled', 'sending', 'sent', 'failed'];

const initialForm = {
  name: '',
  channel: 'sms',
  scheduledAt: '',
  content: '',
};

const CampaignsPage = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const loadCampaigns = async () => {
    try {
      setLoading(true);
      const list = await getCampaigns();
      setCampaigns(list);
    } catch (err) {
      console.error(err);
      setError('Unable to fetch campaigns.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCampaigns();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');

    const payload = {
      name: form.name,
      channel: form.channel,
      scheduledAt: form.scheduledAt ? new Date(form.scheduledAt).toISOString() : undefined,
      content: form.content,
    };

    try {
      await createCampaign(payload);
      await loadCampaigns();
      setForm(initialForm);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Unable to create campaign.');
    } finally {
      setSaving(false);
    }
  };

  const handleStatusUpdate = async (campaignId, status) => {
    try {
      await updateCampaignStatus(campaignId, status);
      await loadCampaigns();
    } catch (err) {
      console.error(err);
      setError('Unable to update campaign status.');
    }
  };

  return (
    <Layout>
      <div className="stack">
        <div>
          <h1 style={{ margin: 0 }}>Campaigns</h1>
          <p style={{ color: '#6b7280' }}>
            Design SMS, WhatsApp, and Email journeys from one place.
          </p>
        </div>

        <section className="card">
          <div className="card-header">
            <h2 style={{ margin: 0 }}>Launch new campaign</h2>
          </div>

          <form onSubmit={handleSubmit} className="stack">
            <div className="stack-horizontal">
              <div style={{ flex: 1 }}>
                <label htmlFor="name">Campaign name</label>
                <input
                  id="name"
                  name="name"
                  className="input"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div style={{ minWidth: 180 }}>
                <label htmlFor="channel">Channel</label>
                <select
                  id="channel"
                  name="channel"
                  className="input"
                  style={{ appearance: 'none' }}
                  value={form.channel}
                  onChange={handleChange}
                >
                  {channels.map((channel) => (
                    <option key={channel.value} value={channel.value}>
                      {channel.label}
                    </option>
                  ))}
                </select>
              </div>
              <div style={{ minWidth: 220 }}>
                <label htmlFor="scheduledAt">Schedule (optional)</label>
                <input
                  id="scheduledAt"
                  name="scheduledAt"
                  type="datetime-local"
                  className="input"
                  value={form.scheduledAt}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label htmlFor="content">Message preview</label>
              <textarea
                id="content"
                name="content"
                className="input"
                style={{ minHeight: 140 }}
                value={form.content}
                onChange={handleChange}
              />
            </div>

            {error && <div className="error-text">{error}</div>}

            <div>
              <button type="submit" className="button" disabled={saving}>
                {saving ? 'Creating...' : 'Create campaign'}
              </button>
            </div>
          </form>
        </section>

        <section className="card">
          <div className="card-header">
            <h2 style={{ margin: 0 }}>All campaigns</h2>
          </div>

          {loading ? (
            <p style={{ margin: 0, color: '#6b7280' }}>Loading campaigns...</p>
          ) : campaigns.length === 0 ? (
            <p style={{ margin: 0, color: '#6b7280' }}>
              No campaigns yet. Create one using the form above.
            </p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Channel</th>
                    <th>Status</th>
                    <th>Scheduled</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {campaigns.map((campaign) => (
                    <tr key={campaign.id}>
                      <td>{campaign.name}</td>
                      <td style={{ textTransform: 'uppercase' }}>{campaign.channel}</td>
                      <td>{campaign.status}</td>
                      <td>
                        {campaign.scheduled_at
                          ? new Date(campaign.scheduled_at).toLocaleString()
                          : '—'}
                      </td>
                      <td>
                        <select
                          className="input"
                          value={campaign.status}
                          onChange={(event) => handleStatusUpdate(campaign.id, event.target.value)}
                        >
                          {statuses.map((status) => (
                            <option key={status} value={status}>
                              {status.toUpperCase()}
                            </option>
                          ))}
                        </select>
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

export default CampaignsPage;
