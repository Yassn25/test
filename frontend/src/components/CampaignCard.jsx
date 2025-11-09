import dayjs from 'dayjs';

const channelCopy = {
  sms: 'SMS',
  whatsapp: 'WhatsApp',
  email: 'Email',
};

const statusColours = {
  draft: '#6366f1',
  scheduled: '#0ea5e9',
  sending: '#f59e0b',
  sent: '#22c55e',
  failed: '#ef4444',
};

const CampaignCard = ({ campaign }) => {
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <div className="card-header">
        <h2 style={{ margin: 0 }}>{campaign.name}</h2>
        <span
          className="pill"
          style={{
            background: `${statusColours[campaign.status] || '#64748b'}15`,
            color: statusColours[campaign.status] || '#1f2937',
          }}
        >
          {campaign.status.toUpperCase()}
        </span>
      </div>
      <div className="stack-horizontal">
        <div>
          <strong>Channel</strong>
          <div>{channelCopy[campaign.channel] || campaign.channel}</div>
        </div>
        <div>
          <strong>Scheduled</strong>
          <div>
            {campaign.scheduled_at
              ? dayjs(campaign.scheduled_at).format('MMM D, YYYY HH:mm')
              : 'Not scheduled'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignCard;
