import { Card, Skeleton } from 'antd';

interface CardSkeletonProps {
  loading?: boolean;
  children?: React.ReactNode;
  rows?: number;
  avatar?: boolean;
}

/**
 * Skeleton loader for card content
 * @param loading - Whether to show skeleton
 * @param children - Content to show when not loading
 * @param rows - Number of skeleton rows (default: 4)
 * @param avatar - Whether to show avatar skeleton (default: false)
 */
export default function CardSkeleton({
  loading = true,
  children,
  rows = 4,
  avatar = false
}: CardSkeletonProps) {
  if (!loading && children) {
    return <>{children}</>;
  }

  return (
    <Card>
      <Skeleton active avatar={avatar} paragraph={{ rows }} />
    </Card>
  );
}
