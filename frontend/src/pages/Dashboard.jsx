import { useEffect, useState } from 'react';
import Layout from '../components/Layout.jsx';
import { getCampaigns } from '../services/campaignService.js';
import { getContacts } from '../services/contactService.js';
import CampaignCard from '../components/CampaignCard.jsx';

const DashboardPage = () => {
  const [stats, setStats] = useState({
    totalContacts: 0,
    totalCampaigns: 0,
    activeCampaigns: 0,
  });
  const [recentCampaigns, setRecentCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const [contactsResponse, campaignsResponse] = await Promise.all([
          getContacts(),
          getCampaigns(),
        ]);

        setStats({
          totalContacts: contactsResponse.length,
          totalCampaigns: campaignsResponse.length,
          activeCampaigns: campaignsResponse.filter((c) => c.status !== 'draft').length,
        });

        setRecentCampaigns(campaignsResponse.slice(0, 3));
      } catch (err) {
        console.error(err);
        setError('Unable to fetch dashboard data.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <Layout>
      <div className="stack">
        <div>
          <h1 style={{ margin: 0 }}>Welcome back 👋</h1>
          <p style={{ color: '#6b7280' }}>
            See the health of your SMS, WhatsApp, and Email campaigns at a glance.
          </p>
        </div>

        {error && <div className="error-text">{error}</div>}

        <section className="stats-grid">
          <div className="stat-card">
            <h3>Total contacts</h3>
            <strong>{loading ? '...' : stats.totalContacts}</strong>
          </div>
          <div className="stat-card">
            <h3>Total campaigns</h3>
            <strong>{loading ? '...' : stats.totalCampaigns}</strong>
          </div>
          <div className="stat-card">
            <h3>Active campaigns</h3>
            <strong>{loading ? '...' : stats.activeCampaigns}</strong>
          </div>
        </section>

        <section className="card">
          <div className="card-header">
            <h2 style={{ margin: 0 }}>Recent campaigns</h2>
          </div>
          {loading ? (
            <p style={{ margin: 0, color: '#6b7280' }}>Loading campaigns...</p>
          ) : recentCampaigns.length === 0 ? (
            <p style={{ margin: 0, color: '#6b7280' }}>
              No campaigns yet. Launch your first SMS, WhatsApp, or Email campaign to see insights
              here.
            </p>
          ) : (
            <div className="stack">
              {recentCampaigns.map((campaign) => (
                <CampaignCard key={campaign.id} campaign={campaign} />
              ))}
            </div>
          )}
        </section>
      </div>
    </Layout>
  );
};

export default DashboardPage;
