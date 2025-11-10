import { useState } from 'react';
import { Table, Tag, Button, Space, Tabs } from 'antd';
import { DownloadOutlined, EyeOutlined } from '@ant-design/icons';
import { AdvancedFilter } from '../../../components/filters';
import type { TabsProps } from 'antd';

const TransactionsPage = () => {
  const [filteredData, setFilteredData] = useState<any[]>([]);

  const columns = [
    {
      title: 'Fecha',
      dataIndex: 'date',
      key: 'date',
      sorter: (a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    },
    {
      title: 'Tipo',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => {
        const colorMap: Record<string, string> = {
          buy: 'green',
          sell: 'orange',
          deposit: 'blue',
          withdrawal: 'purple',
        };
        const labelMap: Record<string, string> = {
          buy: 'Compra',
          sell: 'Venta',
          deposit: 'Depósito',
          withdrawal: 'Retiro',
        };
        return <Tag color={colorMap[type]}>{labelMap[type]}</Tag>;
      },
    },
    {
      title: 'Activo',
      dataIndex: 'asset',
      key: 'asset',
    },
    {
      title: 'Cantidad',
      dataIndex: 'amount',
      key: 'amount',
    },
    {
      title: 'Precio',
      dataIndex: 'price',
      key: 'price',
      render: (price: string) => `$${price}`,
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      render: (total: string) => `$${total}`,
      sorter: (a: any, b: any) => parseFloat(a.total.replace(/,/g, '')) - parseFloat(b.total.replace(/,/g, '')),
    },
    {
      title: 'Estado',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const colorMap: Record<string, string> = {
          completed: 'success',
          pending: 'warning',
          failed: 'error',
        };
        const labelMap: Record<string, string> = {
          completed: 'Completado',
          pending: 'Pendiente',
          failed: 'Fallido',
        };
        return <Tag color={colorMap[status]}>{labelMap[status]}</Tag>;
      },
    },
    {
      title: 'Acciones',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space>
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
          >
            Ver
          </Button>
          <Button
            type="link"
            size="small"
            icon={<DownloadOutlined />}
          >
            Recibo
          </Button>
        </Space>
      ),
    },
  ];

  const allTransactions = [
    {
      key: '1',
      date: '2024-11-09',
      type: 'buy',
      asset: 'Alpha Capital Fund',
      amount: '50 units',
      price: '135.45',
      total: '6,772.50',
      status: 'completed',
    },
    {
      key: '2',
      date: '2024-11-08',
      type: 'deposit',
      asset: 'USD',
      amount: '-',
      price: '-',
      total: '25,000.00',
      status: 'completed',
    },
    {
      key: '3',
      date: '2024-11-07',
      type: 'sell',
      asset: 'Beta Investments',
      amount: '30 units',
      price: '98.42',
      total: '2,952.60',
      status: 'completed',
    },
    {
      key: '4',
      date: '2024-11-06',
      type: 'buy',
      asset: 'Gamma Token',
      amount: '200 units',
      price: '18.75',
      total: '3,750.00',
      status: 'completed',
    },
    {
      key: '5',
      date: '2024-11-05',
      type: 'withdrawal',
      asset: 'USD',
      amount: '-',
      price: '-',
      total: '10,000.00',
      status: 'pending',
    },
    {
      key: '6',
      date: '2024-11-04',
      type: 'buy',
      asset: 'Delta Token',
      amount: '100 units',
      price: '25.30',
      total: '2,530.00',
      status: 'completed',
    },
    {
      key: '7',
      date: '2024-11-03',
      type: 'deposit',
      asset: 'USDC',
      amount: '50,000 USDC',
      price: '1.00',
      total: '50,000.00',
      status: 'completed',
    },
    {
      key: '8',
      date: '2024-11-02',
      type: 'buy',
      asset: 'Alpha Capital Fund',
      amount: '100 units',
      price: '132.10',
      total: '13,210.00',
      status: 'completed',
    },
  ];

  const handleFilter = (values: any) => {
    console.log('Filter values:', values);
    // Aquí se implementaría la lógica de filtrado
    setFilteredData(allTransactions);
  };

  const handleClearFilter = () => {
    setFilteredData([]);
  };

  const tabItems: TabsProps['items'] = [
    {
      key: 'all',
      label: 'Todas',
      children: (
        <div>
          <AdvancedFilter
            onFilter={handleFilter}
            onClear={handleClearFilter}
            showAmount
          />
          <Table
            columns={columns}
            dataSource={filteredData.length > 0 ? filteredData : allTransactions}
            pagination={{ pageSize: 10 }}
          />
        </div>
      ),
    },
    {
      key: 'buys',
      label: 'Compras',
      children: (
        <Table
          columns={columns}
          dataSource={allTransactions.filter(t => t.type === 'buy')}
          pagination={{ pageSize: 10 }}
        />
      ),
    },
    {
      key: 'sells',
      label: 'Ventas',
      children: (
        <Table
          columns={columns}
          dataSource={allTransactions.filter(t => t.type === 'sell')}
          pagination={{ pageSize: 10 }}
        />
      ),
    },
    {
      key: 'deposits',
      label: 'Depósitos',
      children: (
        <Table
          columns={columns}
          dataSource={allTransactions.filter(t => t.type === 'deposit')}
          pagination={{ pageSize: 10 }}
        />
      ),
    },
    {
      key: 'withdrawals',
      label: 'Retiros',
      children: (
        <Table
          columns={columns}
          dataSource={allTransactions.filter(t => t.type === 'withdrawal')}
          pagination={{ pageSize: 10 }}
        />
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ margin: 0 }}>Historial de Transacciones</h1>
        <Button type="primary" icon={<DownloadOutlined />}>
          Exportar a Excel
        </Button>
      </div>

      <Tabs defaultActiveKey="all" items={tabItems} />
    </div>
  );
};

export default TransactionsPage;
