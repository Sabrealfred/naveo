import { Card, Skeleton, Space } from 'antd';

interface FormSkeletonProps {
  fields?: number;
  rows?: number;
}

/**
 * Skeleton loader for form content
 * @param fields - Number of form fields to show (default: 6)
 * @param rows - Number of rows for textarea fields (default: 2)
 */
export default function FormSkeleton({ fields = 6, rows = 2 }: FormSkeletonProps) {
  return (
    <Card>
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        {Array.from({ length: fields }).map((_, index) => (
          <div key={index}>
            <Skeleton.Input
              active
              size="small"
              style={{ width: 100, marginBottom: 8 }}
            />
            {index % 3 === 2 ? (
              // Every 3rd field is a textarea
              <Skeleton.Input
                active
                block
                style={{ height: 80 }}
              />
            ) : (
              <Skeleton.Input active block />
            )}
          </div>
        ))}

        {/* Action buttons */}
        <Space style={{ marginTop: 16 }}>
          <Skeleton.Button active size="large" style={{ width: 100 }} />
          <Skeleton.Button active size="large" style={{ width: 100 }} />
        </Space>
      </Space>
    </Card>
  );
}
