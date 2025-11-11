import { Card, Skeleton, Space } from 'antd';

interface ChartSkeletonProps {
  height?: number;
  title?: boolean;
}

/**
 * Skeleton loader for chart/graph content
 * @param height - Height of the chart skeleton (default: 300)
 * @param title - Whether to show title skeleton (default: true)
 */
export default function ChartSkeleton({ height = 300, title = true }: ChartSkeletonProps) {
  return (
    <Card>
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        {title && (
          <Skeleton.Input active size="default" style={{ width: 200 }} />
        )}
        <Skeleton.Node active style={{ width: '100%', height }}>
          <div style={{
            width: '100%',
            height,
            display: 'flex',
            alignItems: 'flex-end',
            gap: 8,
            padding: 16
          }}>
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                style={{
                  flex: 1,
                  height: `${Math.random() * 80 + 20}%`,
                  backgroundColor: '#f0f0f0',
                  borderRadius: 4,
                }}
              />
            ))}
          </div>
        </Skeleton.Node>
      </Space>
    </Card>
  );
}
