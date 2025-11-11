import { Card, Skeleton, List } from 'antd';

interface ListSkeletonProps {
  items?: number;
  avatar?: boolean;
}

/**
 * Skeleton loader for list content
 * @param items - Number of list items to show (default: 5)
 * @param avatar - Whether to show avatar skeleton (default: true)
 */
export default function ListSkeleton({ items = 5, avatar = true }: ListSkeletonProps) {
  const data = Array.from({ length: items }).map((_, index) => ({
    id: index,
  }));

  return (
    <Card>
      <List
        dataSource={data}
        renderItem={() => (
          <List.Item>
            <Skeleton active avatar={avatar} paragraph={{ rows: 2 }} />
          </List.Item>
        )}
      />
    </Card>
  );
}
