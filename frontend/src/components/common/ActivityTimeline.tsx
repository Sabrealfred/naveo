import { Timeline, Card } from 'antd';
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  SyncOutlined,
} from '@ant-design/icons';

export interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  status: 'success' | 'processing' | 'error' | 'pending';
  details?: string;
}

interface ActivityTimelineProps {
  title?: string;
  events: TimelineEvent[];
}

const ActivityTimeline = ({ title = 'Timeline de Actividades', events }: ActivityTimelineProps) => {
  const getIcon = (status: TimelineEvent['status']) => {
    const iconMap = {
      success: <CheckCircleOutlined />,
      processing: <SyncOutlined spin />,
      error: <CloseCircleOutlined />,
      pending: <ClockCircleOutlined />,
    };
    return iconMap[status];
  };

  const getColor = (status: TimelineEvent['status']) => {
    const colorMap = {
      success: 'green',
      processing: 'blue',
      error: 'red',
      pending: 'gray',
    };
    return colorMap[status];
  };

  const items = events.map(event => ({
    color: getColor(event.status),
    dot: getIcon(event.status),
    children: (
      <div>
        <div style={{ fontWeight: 500, marginBottom: 4 }}>{event.title}</div>
        <div style={{ color: '#666', fontSize: 13, marginBottom: 4 }}>
          {event.description}
        </div>
        {event.details && (
          <div style={{ color: '#999', fontSize: 12, marginBottom: 4 }}>
            {event.details}
          </div>
        )}
        <div style={{ color: '#999', fontSize: 12 }}>{event.timestamp}</div>
      </div>
    ),
  }));

  return (
    <Card title={title} bordered={false}>
      <Timeline items={items} />
    </Card>
  );
};

export default ActivityTimeline;
