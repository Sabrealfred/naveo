import { Card } from 'antd';
import { Column } from '@ant-design/charts';

interface ComparisonData {
  category: string;
  type: string;
  value: number;
}

interface ComparisonChartProps {
  title: string;
  data: ComparisonData[];
  height?: number;
}

const ComparisonChart = ({ title, data, height = 300 }: ComparisonChartProps) => {
  const config = {
    data,
    xField: 'category',
    yField: 'value',
    seriesField: 'type',
    isGroup: true,
    columnStyle: {
      radius: [4, 4, 0, 0],
    },
    label: {
      position: 'top' as const,
      style: {
        fill: '#000000',
        opacity: 0.6,
      },
    },
    legend: {
      position: 'top' as const,
    },
  };

  return (
    <Card title={title} bordered={false}>
      <Column {...config} height={height} />
    </Card>
  );
};

export default ComparisonChart;
