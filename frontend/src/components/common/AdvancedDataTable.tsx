import { useState } from 'react';
import { Table, Input, Button, Space, Dropdown, Tooltip } from 'antd';
import type { TableProps, ColumnsType } from 'antd/es/table';
import {
  SearchOutlined,
  DownloadOutlined,
  FilterOutlined,
  ReloadOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

export interface AdvancedDataTableProps<T> extends TableProps<T> {
  columns: ColumnsType<T>;
  dataSource: T[];
  searchable?: boolean;
  exportable?: boolean;
  refreshable?: boolean;
  searchPlaceholder?: string;
  onSearch?: (value: string) => void;
  onExport?: () => void;
  onRefresh?: () => void;
}

export function AdvancedDataTable<T extends Record<string, any>>({
  columns,
  dataSource,
  searchable = true,
  exportable = true,
  refreshable = true,
  searchPlaceholder,
  onSearch,
  onExport,
  onRefresh,
  ...tableProps
}: AdvancedDataTableProps<T>) {
  const { t } = useTranslation();
  const [searchValue, setSearchValue] = useState('');
  const [filteredData, setFilteredData] = useState<T[]>(dataSource);

  const handleSearch = (value: string) => {
    setSearchValue(value);

    if (onSearch) {
      onSearch(value);
    } else {
      // Default search implementation
      const filtered = dataSource.filter((item) =>
        Object.values(item).some((val) =>
          String(val).toLowerCase().includes(value.toLowerCase())
        )
      );
      setFilteredData(filtered);
    }
  };

  const handleExport = () => {
    if (onExport) {
      onExport();
    } else {
      // Default export to CSV
      const headers = columns.map((col: any) => col.title).join(',');
      const rows = filteredData.map((row) =>
        columns.map((col: any) => row[col.dataIndex || col.key]).join(',')
      );
      const csv = [headers, ...rows].join('\n');

      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `export-${new Date().toISOString()}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    }
  };

  const handleRefresh = () => {
    setSearchValue('');
    setFilteredData(dataSource);
    if (onRefresh) {
      onRefresh();
    }
  };

  return (
    <div style={{ width: '100%' }}>
      <Space style={{ marginBottom: 16, width: '100%', justifyContent: 'space-between' }}>
        <Space>
          {searchable && (
            <Input
              placeholder={searchPlaceholder || t('common.search')}
              prefix={<SearchOutlined />}
              value={searchValue}
              onChange={(e) => handleSearch(e.target.value)}
              allowClear
              style={{ width: 250 }}
            />
          )}
        </Space>

        <Space>
          {refreshable && (
            <Tooltip title={t('common.refresh')}>
              <Button icon={<ReloadOutlined />} onClick={handleRefresh} />
            </Tooltip>
          )}
          {exportable && (
            <Tooltip title={t('common.export')}>
              <Button icon={<DownloadOutlined />} onClick={handleExport} />
            </Tooltip>
          )}
        </Space>
      </Space>

      <Table
        columns={columns}
        dataSource={searchValue ? filteredData : dataSource}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} ${t('common.of')} ${total}`,
        }}
        scroll={{ x: 'max-content' }}
        {...tableProps}
      />
    </div>
  );
}

export default AdvancedDataTable;
