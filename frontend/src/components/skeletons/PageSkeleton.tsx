import { Space, Skeleton } from 'antd';
import StatsSkeleton from './StatsSkeleton';
import ChartSkeleton from './ChartSkeleton';
import TableSkeleton from './TableSkeleton';

/**
 * Full page skeleton loader for dashboard pages
 * Includes page header, stats, charts, and table
 */
export default function PageSkeleton() {
  return (
    <Space direction="vertical" style={{ width: '100%' }} size="large">
      {/* Page header */}
      <Space direction="vertical">
        <Skeleton.Input active size="large" style={{ width: 300 }} />
        <Skeleton.Input active size="small" style={{ width: 500 }} />
      </Space>

      {/* Stats cards */}
      <StatsSkeleton count={4} />

      {/* Charts section */}
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        <ChartSkeleton height={300} />
        <ChartSkeleton height={250} title={false} />
      </Space>

      {/* Table section */}
      <TableSkeleton rows={5} columns={5} />
    </Space>
  );
}
