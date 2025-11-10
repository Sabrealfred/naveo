import { Card } from 'antd';
import { Pie } from '@ant-design/charts';

interface AssetDistributionProps {
  title: string;
  data: Array<{ type: string; value: number }>;
  height?: number;
}

const AssetDistribution = ({ title, data, height = 300 }: AssetDistributionProps) => {
  const config = {
    data,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    innerRadius: 0.6,
    label: {
      type: 'inner',
      offset: '-50%',
      content: '{value}',
      style: {
        textAlign: 'center',
        fontSize: 14,
      },
    },
    interactions: [
      {
        type: 'element-selected',
      },
      {
        type: 'element-active',
      },
    ],
    statistic: {
      title: false,
      content: {
        style: {
          whiteSpace: 'pre-wrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        },
        content: 'Total',
      },
    },
  };

  return (
    <Card title={title} bordered={false}>
      <Pie {...config} height={height} />
    </Card>
  );
};

export default AssetDistribution;
