import { Card, Table, Button, Space, Row, Col, Statistic, Tag, Select, DatePicker, Tabs } from 'antd';
import { DownloadOutlined, FilePdfOutlined, FileExcelOutlined, MailOutlined, ScheduleOutlined } from '@ant-design/icons';
import { PerformanceChart, ComparisonChart } from '../../../components/common';

const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

const ReportsPage = () => {
  const reportsColumns = [
    {
      title: 'Reporte',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: any) => (
        <div>
          <div style={{ fontWeight: 500 }}>{text}</div>
          <div style={{ fontSize: 12, color: '#999' }}>{record.description}</div>
        </div>
      ),
    },
    {
      title: 'Tipo',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => {
        const colorMap: Record<string, string> = {
          financial: 'blue',
          compliance: 'purple',
          performance: 'green',
          operations: 'orange',
        };
        return <Tag color={colorMap[type]}>{type.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Frecuencia',
      dataIndex: 'frequency',
      key: 'frequency',
      render: (freq: string) => (
        <Tag icon={<ScheduleOutlined />}>{freq}</Tag>
      ),
    },
    {
      title: 'Último Generado',
      dataIndex: 'lastGenerated',
      key: 'lastGenerated',
    },
    {
      title: 'Próxima Generación',
      dataIndex: 'nextGeneration',
      key: 'nextGeneration',
    },
    {
      title: 'Formato',
      dataIndex: 'format',
      key: 'format',
      render: (format: string[]) => (
        <Space>
          {format.map((f, idx) => (
            <Tag key={idx} icon={f === 'PDF' ? <FilePdfOutlined /> : <FileExcelOutlined />}>
              {f}
            </Tag>
          ))}
        </Space>
      ),
    },
    {
      title: 'Auto-Envío',
      dataIndex: 'autoSend',
      key: 'autoSend',
      render: (autoSend: boolean) => (
        <Tag color={autoSend ? 'green' : 'default'} icon={autoSend ? <MailOutlined /> : null}>
          {autoSend ? 'ACTIVO' : 'INACTIVO'}
        </Tag>
      ),
    },
    {
      title: 'Acciones',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space>
          <Button type="primary" size="small" icon={<DownloadOutlined />}>
            Generar
          </Button>
          <Button type="link" size="small">
            Configurar
          </Button>
        </Space>
      ),
    },
  ];

  const reportsData = [
    {
      key: '1',
      name: 'Portfolio Valuation Report',
      description: 'Valoración completa de todos los fondos y activos',
      type: 'financial',
      frequency: 'Mensual',
      lastGenerated: '2024-11-01',
      nextGeneration: '2024-12-01',
      format: ['PDF', 'Excel'],
      autoSend: true,
    },
    {
      key: '2',
      name: 'NAV Calculation Report',
      description: 'Cálculo detallado del NAV por fondo',
      type: 'financial',
      frequency: 'Diario',
      lastGenerated: '2024-11-09',
      nextGeneration: '2024-11-10',
      format: ['PDF', 'Excel'],
      autoSend: true,
    },
    {
      key: '3',
      name: 'Performance Attribution',
      description: 'Análisis de rendimiento y atribución',
      type: 'performance',
      frequency: 'Mensual',
      lastGenerated: '2024-11-01',
      nextGeneration: '2024-12-01',
      format: ['PDF'],
      autoSend: true,
    },
    {
      key: '4',
      name: 'Transaction Summary',
      description: 'Resumen de todas las transacciones',
      type: 'operations',
      frequency: 'Semanal',
      lastGenerated: '2024-11-08',
      nextGeneration: '2024-11-15',
      format: ['Excel'],
      autoSend: false,
    },
    {
      key: '5',
      name: 'AML/CTF Compliance Report',
      description: 'Reporte de cumplimiento AML y CTF',
      type: 'compliance',
      frequency: 'Trimestral',
      lastGenerated: '2024-10-01',
      nextGeneration: '2025-01-01',
      format: ['PDF'],
      autoSend: true,
    },
    {
      key: '6',
      name: 'KYC/KYB Status Report',
      description: 'Estado de verificaciones KYC/KYB',
      type: 'compliance',
      frequency: 'Mensual',
      lastGenerated: '2024-11-01',
      nextGeneration: '2024-12-01',
      format: ['PDF', 'Excel'],
      autoSend: true,
    },
    {
      key: '7',
      name: 'Client Activity Report',
      description: 'Actividad detallada por cliente',
      type: 'operations',
      frequency: 'Mensual',
      lastGenerated: '2024-11-01',
      nextGeneration: '2024-12-01',
      format: ['Excel'],
      autoSend: false,
    },
    {
      key: '8',
      name: 'Fee & Commission Report',
      description: 'Comisiones cobradas y fees',
      type: 'financial',
      frequency: 'Mensual',
      lastGenerated: '2024-11-01',
      nextGeneration: '2024-12-01',
      format: ['PDF', 'Excel'],
      autoSend: true,
    },
  ];

  const historyColumns = [
    {
      title: 'Fecha Generación',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Reporte',
      dataIndex: 'reportName',
      key: 'reportName',
    },
    {
      title: 'Periodo',
      dataIndex: 'period',
      key: 'period',
    },
    {
      title: 'Formato',
      dataIndex: 'format',
      key: 'format',
      render: (format: string) => (
        <Tag icon={format === 'PDF' ? <FilePdfOutlined /> : <FileExcelOutlined />}>
          {format}
        </Tag>
      ),
    },
    {
      title: 'Generado Por',
      dataIndex: 'generatedBy',
      key: 'generatedBy',
    },
    {
      title: 'Estado',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const colorMap: Record<string, string> = {
          completed: 'green',
          processing: 'orange',
          failed: 'red',
        };
        return <Tag color={colorMap[status]}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Acciones',
      key: 'actions',
      render: () => (
        <Space>
          <Button type="link" size="small" icon={<DownloadOutlined />}>
            Descargar
          </Button>
          <Button type="link" size="small" icon={<MailOutlined />}>
            Enviar
          </Button>
        </Space>
      ),
    },
  ];

  const historyData = [
    {
      key: '1',
      date: '2024-11-09 18:00',
      reportName: 'NAV Calculation Report',
      period: 'Nov 9, 2024',
      format: 'PDF',
      generatedBy: 'System',
      status: 'completed',
    },
    {
      key: '2',
      date: '2024-11-08 18:00',
      reportName: 'NAV Calculation Report',
      period: 'Nov 8, 2024',
      format: 'Excel',
      generatedBy: 'System',
      status: 'completed',
    },
    {
      key: '3',
      date: '2024-11-08 17:30',
      reportName: 'Transaction Summary',
      period: 'Week 45, 2024',
      format: 'Excel',
      generatedBy: 'John Admin',
      status: 'completed',
    },
    {
      key: '4',
      date: '2024-11-01 09:00',
      reportName: 'Portfolio Valuation Report',
      period: 'October 2024',
      format: 'PDF',
      generatedBy: 'System',
      status: 'completed',
    },
    {
      key: '5',
      date: '2024-11-01 09:00',
      reportName: 'Performance Attribution',
      period: 'October 2024',
      format: 'PDF',
      generatedBy: 'System',
      status: 'completed',
    },
  ];

  const volumeData = [
    { date: '2024-01', value: 24 },
    { date: '2024-02', value: 28 },
    { date: '2024-03', value: 26 },
    { date: '2024-04', value: 30 },
    { date: '2024-05', value: 32 },
    { date: '2024-06', value: 29 },
    { date: '2024-07', value: 31 },
    { date: '2024-08', value: 35 },
    { date: '2024-09', value: 33 },
    { date: '2024-10', value: 38 },
    { date: '2024-11', value: 12 },
  ];

  const typeDistribution = [
    { category: 'Tipo', type: 'Financial', value: 140 },
    { category: 'Tipo', type: 'Compliance', value: 85 },
    { category: 'Tipo', type: 'Performance', value: 95 },
    { category: 'Tipo', type: 'Operations', value: 72 },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ margin: 0 }}>Reportes Institucionales</h1>
        <Space>
          <Select defaultValue="all" style={{ width: 150 }}>
            <Select.Option value="all">Todos</Select.Option>
            <Select.Option value="financial">Financieros</Select.Option>
            <Select.Option value="compliance">Compliance</Select.Option>
            <Select.Option value="performance">Performance</Select.Option>
            <Select.Option value="operations">Operaciones</Select.Option>
          </Select>
          <RangePicker />
        </Space>
      </div>

      {/* Estadísticas */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Reportes Configurados"
              value={8}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Generados (30d)"
              value={42}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Auto-Enviados"
              value={6}
              suffix="/ 8"
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Próximos 7 días"
              value={5}
              suffix="reportes"
            />
          </Card>
        </Col>
      </Row>

      {/* Gráficos */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={12}>
          <PerformanceChart
            title="Reportes Generados por Mes"
            data={volumeData}
            height={300}
          />
        </Col>
        <Col xs={24} lg={12}>
          <ComparisonChart
            title="Distribución por Tipo"
            data={typeDistribution}
            height={300}
          />
        </Col>
      </Row>

      {/* Tabs */}
      <Card>
        <Tabs defaultActiveKey="configured">
          <TabPane tab="Reportes Configurados" key="configured">
            <Table
              columns={reportsColumns}
              dataSource={reportsData}
              pagination={{ pageSize: 10 }}
              scroll={{ x: 1400 }}
            />
          </TabPane>
          <TabPane tab="Historial" key="history">
            <Table
              columns={historyColumns}
              dataSource={historyData}
              pagination={{ pageSize: 10 }}
            />
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default ReportsPage;
