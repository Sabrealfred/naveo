import { Card } from 'antd';
import { Gauge } from '@ant-design/charts';

interface PerformanceGaugeProps {
  title: string;
  value: number;
  min?: number;
  max?: number;
  format?: (value: number) => string;
  thresholds?: {
    low: number;
    medium: number;
    high: number;
  };
}

const PerformanceGauge = ({
  title,
  value,
  min = 0,
  max = 100,
  format = (v) => `${v.toFixed(1)}%`,
  thresholds = { low: 30, medium: 70, high: 100 }
}: PerformanceGaugeProps) => {
  const getColor = (val: number) => {
    if (val < thresholds.low) return '#f5222d';
    if (val < thresholds.medium) return '#faad14';
    return '#52c41a';
  };

  const config = {
    percent: value / max,
    range: {
      color: getColor(value),
    },
    indicator: {
      pointer: {
        style: {
          stroke: '#D0D0D0',
        },
      },
      pin: {
        style: {
          stroke: '#D0D0D0',
        },
      },
    },
    statistic: {
      content: {
        formatter: () => format(value),
        style: {
          fontSize: '24px',
          lineHeight: '44px',
        },
      },
    },
  };

  return (
    <Card title={title} bordered={false}>
      <Gauge {...config} />
    </Card>
  );
};

export default PerformanceGauge;
