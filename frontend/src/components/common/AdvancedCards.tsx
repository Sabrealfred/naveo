import { ReactNode } from 'react';
import { Card, Space, Typography, Tag, Button, Statistic, Row, Col } from 'antd';
import type { CardProps } from 'antd';
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  InfoCircleOutlined,
  MoreOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;

// Metric Card with trend indicator
export interface MetricCardProps extends CardProps {
  title: string;
  value: string | number;
  prefix?: ReactNode;
  suffix?: ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: number;
  description?: string;
  icon?: ReactNode;
  color?: string;
}

export const MetricCard = ({
  title,
  value,
  prefix,
  suffix,
  trend = 'neutral',
  trendValue,
  description,
  icon,
  color = '#1890ff',
  ...cardProps
}: MetricCardProps) => {
  const trendIcon =
    trend === 'up' ? (
      <ArrowUpOutlined style={{ color: '#52c41a' }} />
    ) : trend === 'down' ? (
      <ArrowDownOutlined style={{ color: '#ff4d4f' }} />
    ) : null;

  const trendColor = trend === 'up' ? '#52c41a' : trend === 'down' ? '#ff4d4f' : '#8c8c8c';

  return (
    <Card bordered={false} {...cardProps}>
      <Space direction="vertical" size="small" style={{ width: '100%' }}>
        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
          <Text type="secondary">{title}</Text>
          {icon && <div style={{ color }}>{icon}</div>}
        </Space>

        <Title level={3} style={{ margin: 0 }}>
          {prefix}
          {value}
          {suffix}
        </Title>

        {(trendValue !== undefined || description) && (
          <Space>
            {trendValue !== undefined && (
              <Space size={4}>
                {trendIcon}
                <Text style={{ color: trendColor }}>
                  {trendValue > 0 ? '+' : ''}
                  {trendValue}%
                </Text>
              </Space>
            )}
            {description && <Text type="secondary">{description}</Text>}
          </Space>
        )}
      </Space>
    </Card>
  );
};

// Info Card with icon and action button
export interface InfoCardProps extends CardProps {
  icon?: ReactNode;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  color?: string;
  badge?: string;
}

export const InfoCard = ({
  icon,
  title,
  description,
  actionText,
  onAction,
  color = '#1890ff',
  badge,
  ...cardProps
}: InfoCardProps) => {
  return (
    <Card bordered={false} {...cardProps}>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
          {icon && (
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 8,
                backgroundColor: `${color}15`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color,
                fontSize: 24,
              }}
            >
              {icon}
            </div>
          )}
          {badge && <Tag color={color}>{badge}</Tag>}
        </Space>

        <div>
          <Title level={5} style={{ marginBottom: 8 }}>
            {title}
          </Title>
          <Text type="secondary">{description}</Text>
        </div>

        {actionText && onAction && (
          <Button type="link" onClick={onAction} style={{ padding: 0 }}>
            {actionText}
          </Button>
        )}
      </Space>
    </Card>
  );
};

// Feature Card with stats
export interface FeatureCardProps extends CardProps {
  title: string;
  description: string;
  stats: Array<{ label: string; value: string | number }>;
  icon?: ReactNode;
  actionText?: string;
  onAction?: () => void;
}

export const FeatureCard = ({
  title,
  description,
  stats,
  icon,
  actionText,
  onAction,
  ...cardProps
}: FeatureCardProps) => {
  return (
    <Card
      bordered={false}
      title={
        <Space>
          {icon}
          <span>{title}</span>
        </Space>
      }
      extra={
        actionText && onAction ? (
          <Button type="link" onClick={onAction}>
            {actionText}
          </Button>
        ) : undefined
      }
      {...cardProps}
    >
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        <Text type="secondary">{description}</Text>

        <Row gutter={16}>
          {stats.map((stat, index) => (
            <Col span={24 / stats.length} key={index}>
              <Statistic title={stat.label} value={stat.value} />
            </Col>
          ))}
        </Row>
      </Space>
    </Card>
  );
};

// Compact Action Card
export interface ActionCardProps extends CardProps {
  title: string;
  subtitle?: string;
  actionText: string;
  onAction: () => void;
  icon?: ReactNode;
  disabled?: boolean;
}

export const ActionCard = ({
  title,
  subtitle,
  actionText,
  onAction,
  icon,
  disabled = false,
  ...cardProps
}: ActionCardProps) => {
  return (
    <Card
      bordered={false}
      hoverable={!disabled}
      style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
      onClick={!disabled ? onAction : undefined}
      {...cardProps}
    >
      <Space style={{ width: '100%', justifyContent: 'space-between' }}>
        <Space>
          {icon && <div style={{ fontSize: 24 }}>{icon}</div>}
          <div>
            <Title level={5} style={{ marginBottom: subtitle ? 4 : 0 }}>
              {title}
            </Title>
            {subtitle && <Text type="secondary">{subtitle}</Text>}
          </div>
        </Space>
        <Button type="primary" disabled={disabled}>
          {actionText}
        </Button>
      </Space>
    </Card>
  );
};

export default {
  MetricCard,
  InfoCard,
  FeatureCard,
  ActionCard,
};
