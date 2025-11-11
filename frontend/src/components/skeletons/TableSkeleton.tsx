import { Card, Skeleton, Space } from 'antd';

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
}

/**
 * Skeleton loader for table content
 * @param rows - Number of table rows to show (default: 5)
 * @param columns - Number of columns to simulate (default: 4)
 */
export default function TableSkeleton({ rows = 5, columns = 4 }: TableSkeletonProps) {
  return (
    <Card>
      {/* Table header */}
      <Space style={{ width: '100%', marginBottom: 16 }}>
        {Array.from({ length: columns }).map((_, index) => (
          <Skeleton.Input
            key={`header-${index}`}
            active
            size="small"
            style={{ width: 120 }}
          />
        ))}
      </Space>

      {/* Table rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <Space
          key={`row-${rowIndex}`}
          style={{ width: '100%', marginBottom: 12 }}
        >
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton.Input
              key={`cell-${rowIndex}-${colIndex}`}
              active
              size="small"
              style={{ width: 120 }}
            />
          ))}
        </Space>
      ))}
    </Card>
  );
}
