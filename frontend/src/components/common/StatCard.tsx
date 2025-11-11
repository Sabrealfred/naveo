import type { ReactNode } from 'react';
import { Card, Statistic, Row, Col } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';

interface StatCardProps {
  title: string;
  value: number | string;
  prefix?: string;
  suffix?: string;
  trend?:
    | {
        value: number;
        isPositive: boolean;
      }
    | 'up'
    | 'down';
  trendValue?: number;
  icon?: ReactNode;
  color?: string;
  loading?: boolean;
}

const StatCard = ({
  title,
  value,
  prefix,
  suffix,
  trend,
  trendValue,
  icon,
  color = '#1890ff',
  loading = false,
}: StatCardProps) => {
  let trendDirection: 'up' | 'down' | undefined;
  let trendAmount: number | undefined;

  if (trend && typeof trend === 'object') {
    trendDirection = trend.isPositive ? 'up' : 'down';
    trendAmount = trend.value;
  } else if (typeof trend === 'string') {
    trendDirection = trend;
    trendAmount = trendValue;
  } else if (trendValue !== undefined) {
    trendDirection = trendValue >= 0 ? 'up' : 'down';
    trendAmount = Math.abs(trendValue);
  }

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
              color: trendDirection === 'down' ? '#cf1322' : color,
              fontSize: '24px',
              fontWeight: 600,
            }}
          />
          {trendDirection && (
            <div style={{ marginTop: 8 }}>
              <span
                style={{
                  color: trendDirection === 'up' ? '#3f8600' : '#cf1322',
                  fontSize: '14px',
                }}
              >
                {trendDirection === 'up' ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                {trendAmount !== undefined && (
                  <>
                    {' '}
                    {trendDirection === 'down' && trendAmount > 0 ? '-' : ''}
                    {trendAmount}%
                  </>
                )}
                <span style={{ color: '#666', marginLeft: 8 }}>vs last period</span>
              </span>
            </div>
          )}
        </Col>
        {icon && (
          <Col>
            <div
              style={{
                fontSize: '40px',
                color,
                opacity: 0.8,
              }}
            >
              {icon}
            </div>
          </Col>
        )}
      </Row>
    </Card>
  );
};

export default StatCard;
