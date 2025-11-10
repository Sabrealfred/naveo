import { Card, Progress, Row, Col } from 'antd';

interface ProgressItem {
  label: string;
  value: number;
  color?: string;
  format?: (percent?: number) => React.ReactNode;
}

interface ProgressRingProps {
  title: string;
  items: ProgressItem[];
}

const ProgressRing = ({ title, items }: ProgressRingProps) => {
  return (
    <Card title={title} bordered={false}>
      <Row gutter={[16, 16]}>
        {items.map((item, index) => (
          <Col xs={24} sm={12} md={items.length > 2 ? 8 : 12} key={index}>
            <div style={{ textAlign: 'center' }}>
              <Progress
                type="circle"
                percent={item.value}
                strokeColor={item.color || '#1890ff'}
                format={item.format || ((percent) => `${percent}%`)}
              />
              <div style={{ marginTop: 12, fontWeight: 500 }}>{item.label}</div>
            </div>
          </Col>
        ))}
      </Row>
    </Card>
  );
};

export default ProgressRing;
