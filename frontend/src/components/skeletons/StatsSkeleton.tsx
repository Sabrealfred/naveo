import { Card, Skeleton, Row, Col, Space } from 'antd';

interface StatsSkeletonProps {
  count?: number;
}

/**
 * Skeleton loader for statistics/metrics cards
 * @param count - Number of stat cards to show (default: 4)
 */
export default function StatsSkeleton({ count = 4 }: StatsSkeletonProps) {
  return (
    <Row gutter={[16, 16]}>
      {Array.from({ length: count }).map((_, index) => (
        <Col key={index} xs={24} sm={12} lg={6}>
          <Card>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Skeleton.Input active size="small" style={{ width: 80 }} />
              <Skeleton.Input active size="large" style={{ width: 120 }} />
              <Skeleton.Input active size="small" style={{ width: 100 }} />
            </Space>
          </Card>
        </Col>
      ))}
    </Row>
  );
}
