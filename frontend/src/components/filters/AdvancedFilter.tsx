import { Card, Form, Input, Select, DatePicker, Button, Space, Row, Col } from 'antd';
import { SearchOutlined, ClearOutlined } from '@ant-design/icons';

const { RangePicker } = DatePicker;

interface AdvancedFilterProps {
  onFilter: (values: any) => void;
  onClear: () => void;
  showDateRange?: boolean;
  showStatus?: boolean;
  showType?: boolean;
  showAmount?: boolean;
  customFilters?: React.ReactNode;
}

const AdvancedFilter = ({
  onFilter,
  onClear,
  showDateRange = true,
  showStatus = true,
  showType = true,
  showAmount = false,
  customFilters
}: AdvancedFilterProps) => {
  const [form] = Form.useForm();

  const handleFilter = () => {
    const values = form.getFieldsValue();
    onFilter(values);
  };

  const handleClear = () => {
    form.resetFields();
    onClear();
  };

  return (
    <Card bordered={false} style={{ marginBottom: 16 }}>
      <Form form={form} layout="vertical">
        <Row gutter={16}>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Form.Item label="Búsqueda" name="search">
              <Input
                placeholder="Buscar..."
                prefix={<SearchOutlined />}
                allowClear
              />
            </Form.Item>
          </Col>

          {showDateRange && (
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item label="Rango de Fechas" name="dateRange">
                <RangePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          )}

          {showStatus && (
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item label="Estado" name="status">
                <Select placeholder="Todos" allowClear>
                  <Select.Option value="active">Activo</Select.Option>
                  <Select.Option value="pending">Pendiente</Select.Option>
                  <Select.Option value="completed">Completado</Select.Option>
                  <Select.Option value="failed">Fallido</Select.Option>
                  <Select.Option value="suspended">Suspendido</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          )}

          {showType && (
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item label="Tipo" name="type">
                <Select placeholder="Todos" allowClear>
                  <Select.Option value="buy">Compra</Select.Option>
                  <Select.Option value="sell">Venta</Select.Option>
                  <Select.Option value="deposit">Depósito</Select.Option>
                  <Select.Option value="withdrawal">Retiro</Select.Option>
                  <Select.Option value="transfer">Transferencia</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          )}

          {showAmount && (
            <>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Form.Item label="Monto Mínimo" name="minAmount">
                  <Input type="number" prefix="$" placeholder="0" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Form.Item label="Monto Máximo" name="maxAmount">
                  <Input type="number" prefix="$" placeholder="Sin límite" />
                </Form.Item>
              </Col>
            </>
          )}

          {customFilters}

          <Col xs={24}>
            <Form.Item>
              <Space>
                <Button
                  type="primary"
                  icon={<SearchOutlined />}
                  onClick={handleFilter}
                >
                  Filtrar
                </Button>
                <Button
                  icon={<ClearOutlined />}
                  onClick={handleClear}
                >
                  Limpiar
                </Button>
              </Space>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};

export default AdvancedFilter;
