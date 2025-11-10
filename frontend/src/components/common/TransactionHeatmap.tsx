import { Card } from 'antd';
import { Heatmap } from '@ant-design/charts';

interface HeatmapData {
  date: string;
  time: string;
  value: number;
}

interface TransactionHeatmapProps {
  title: string;
  data: HeatmapData[];
  height?: number;
}

const TransactionHeatmap = ({ title, data, height = 300 }: TransactionHeatmapProps) => {
  const config = {
    data,
    xField: 'date',
    yField: 'time',
    colorField: 'value',
    color: ['#174c83', '#7eb6d4', '#efefeb', '#efa759', '#9b4d16'],
    meta: {
      date: {
        type: 'cat',
        alias: 'Fecha',
      },
      time: {
        type: 'cat',
        alias: 'Hora',
      },
      value: {
        alias: 'Transacciones',
      },
    },
    legend: {
      position: 'bottom' as const,
    },
  };

  return (
    <Card title={title} bordered={false}>
      <Heatmap {...config} height={height} />
    </Card>
  );
};

export default TransactionHeatmap;
