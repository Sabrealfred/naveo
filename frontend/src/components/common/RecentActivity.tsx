import { Card, List, Tag, Avatar } from 'antd';
import {
  SwapOutlined,
  DollarOutlined,
  UserAddOutlined,
  FileTextOutlined,
} from '@ant-design/icons';

interface Activity {
  id: string;
  type: 'transaction' | 'deposit' | 'withdrawal' | 'kyc' | 'document';
  title: string;
  description: string;
  timestamp: string;
  status: 'success' | 'pending' | 'failed';
  amount?: string;
}

interface RecentActivityProps {
  activities: Activity[];
  loading?: boolean;
}

const getActivityIcon = (type: Activity['type']) => {
  const iconMap = {
    transaction: <SwapOutlined />,
    deposit: <DollarOutlined style={{ color: '#52c41a' }} />,
    withdrawal: <DollarOutlined style={{ color: '#f5222d' }} />,
    kyc: <UserAddOutlined />,
    document: <FileTextOutlined />,
  };
  return iconMap[type];
};

const getStatusColor = (status: Activity['status']) => {
  const colorMap = {
    success: 'success',
    pending: 'warning',
    failed: 'error',
  };
  return colorMap[status];
};

const RecentActivity = ({ activities, loading }: RecentActivityProps) => {
  return (
    <Card title="Actividad Reciente" bordered={false}>
      <List
        loading={loading}
        itemLayout="horizontal"
        dataSource={activities}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              avatar={
                <Avatar style={{ backgroundColor: '#f0f2f5', color: '#1890ff' }}>
                  {getActivityIcon(item.type)}
                </Avatar>
              }
              title={
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>{item.title}</span>
                  {item.amount && (
                    <span style={{ fontWeight: 600, color: '#1890ff' }}>{item.amount}</span>
                  )}
                </div>
              }
              description={
                <div>
                  <div>{item.description}</div>
                  <div style={{ marginTop: 4 }}>
                    <Tag color={getStatusColor(item.status)}>
                      {item.status === 'success' ? 'Completado' : item.status === 'pending' ? 'Pendiente' : 'Fallido'}
                    </Tag>
                    <span style={{ color: '#999', fontSize: '12px' }}>{item.timestamp}</span>
                  </div>
                </div>
              }
            />
          </List.Item>
        )}
      />
    </Card>
  );
};

export default RecentActivity;
