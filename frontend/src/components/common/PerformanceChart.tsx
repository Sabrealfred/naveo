import { Card } from 'antd';
import { Line } from '@ant-design/charts';

interface PerformanceChartProps {
  title: string;
  data: Array<{ date: string; value: number }>;
  height?: number;
}

const PerformanceChart = ({ title, data, height = 300 }: PerformanceChartProps) => {
  const config = {
    data,
    xField: 'date',
    yField: 'value',
    smooth: true,
    point: {
      size: 3,
      shape: 'circle',
    },
    areaStyle: {
      fill: 'l(270) 0:#ffffff 0.5:#7ec2f3 1:#1890ff',
      fillOpacity: 0.3,
    },
    color: '#1890ff',
    animation: {
      appear: {
        animation: 'path-in',
        duration: 1000,
      },
    },
  };

  return (
    <Card title={title} bordered={false}>
      <Line {...config} height={height} />
    </Card>
  );
};

export default PerformanceChart;
