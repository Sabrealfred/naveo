import { Card, Statistic, Row, Col } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';

interface StatCardProps {
  title: string;
  value: number | string;
  prefix?: string;
  suffix?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  icon?: React.ReactNode;
  color?: string;
  loading?: boolean;
}

const StatCard = ({
  title,
  value,
  prefix,
  suffix,
  trend,
  icon,
  color = '#1890ff',
  loading = false
}: StatCardProps) => {
  return (
    <Card bordered={false} loading={loading}>
      <Row gutter={16} align="middle">
        <Col flex="auto">
          <Statistic
            title={title}
            value={value}
            prefix={prefix}
            suffix={suffix}
            valueStyle={{
              color: trend && !trend.isPositive ? '#cf1322' : color,
              fontSize: '24px',
              fontWeight: 600
            }}
          />
          {trend && (
            <div style={{ marginTop: 8 }}>
              <span style={{
                color: trend.isPositive ? '#3f8600' : '#cf1322',
                fontSize: '14px'
              }}>
                {trend.isPositive ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                {' '}{trend.value}%
                <span style={{ color: '#666', marginLeft: 8 }}>vs mes anterior</span>
              </span>
            </div>
          )}
        </Col>
        {icon && (
          <Col>
            <div style={{
              fontSize: '40px',
              color,
              opacity: 0.8
            }}>
              {icon}
            </div>
          </Col>
        )}
      </Row>
    </Card>
  );
};

export default StatCard;
