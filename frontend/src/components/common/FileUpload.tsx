import { useState } from 'react';
import { Upload, Button, message, Progress, Space, Typography } from 'antd';
import type { UploadProps } from 'antd';
import { InboxOutlined, UploadOutlined, DeleteOutlined, FileOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

const { Dragger } = Upload;
const { Text } = Typography;

export interface FileUploadProps {
  maxSize?: number; // MB
  acceptedTypes?: string[];
  multiple?: boolean;
  onUpload?: (file: File) => Promise<void>;
  onRemove?: (file: File) => void;
  disabled?: boolean;
}

export const FileUpload = ({
  maxSize = 10,
  acceptedTypes = ['.pdf', '.doc', '.docx', '.jpg', '.png'],
  multiple = false,
  onUpload,
  onRemove,
  disabled = false,
}: FileUploadProps) => {
  const { t } = useTranslation();
  const [fileList, setFileList] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const props: UploadProps = {
    name: 'file',
    multiple,
    fileList,
    disabled,
    accept: acceptedTypes.join(','),
    beforeUpload: (file) => {
      const isLtMaxSize = file.size / 1024 / 1024 < maxSize;
      if (!isLtMaxSize) {
        message.error(`${t('common.error')}: ${t('common.fileTooLarge', { size: maxSize })}`);
        return Upload.LIST_IGNORE;
      }

      const fileExtension = `.${file.name.split('.').pop()}`;
      const isAcceptedType = acceptedTypes.includes(fileExtension.toLowerCase());
      if (!isAcceptedType) {
        message.error(`${t('common.error')}: ${t('common.invalidFileType')}`);
        return Upload.LIST_IGNORE;
      }

      return false; // Prevent auto upload
    },
    onChange: async (info) => {
      let newFileList = [...info.fileList];

      // Limit to single file if not multiple
      if (!multiple) {
        newFileList = newFileList.slice(-1);
      }

      setFileList(newFileList);

      if (info.file.status === 'done') {
        message.success(`${info.file.name} ${t('common.uploadSuccess')}`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} ${t('common.uploadFailed')}`);
      }
    },
    onRemove: (file) => {
      if (onRemove) {
        onRemove(file.originFileObj as File);
      }
    },
  };

  const handleUpload = async () => {
    if (fileList.length === 0) {
      message.warning(t('common.selectFile'));
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i].originFileObj as File;

        if (onUpload) {
          await onUpload(file);
        }

        // Simulate progress
        setUploadProgress(((i + 1) / fileList.length) * 100);
      }

      message.success(t('common.uploadSuccess'));
      setFileList([]);
      setUploadProgress(0);
    } catch (error) {
      message.error(t('common.uploadFailed'));
    } finally {
      setUploading(false);
    }
  };

  const handleClear = () => {
    setFileList([]);
    setUploadProgress(0);
  };

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Dragger {...props}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">{t('common.dragOrClick')}</p>
        <p className="ant-upload-hint">
          {t('common.maxSize')}: {maxSize}MB | {t('common.acceptedTypes')}: {acceptedTypes.join(', ')}
        </p>
      </Dragger>

      {uploading && uploadProgress > 0 && (
        <Progress percent={Math.round(uploadProgress)} status={uploadProgress === 100 ? 'success' : 'active'} />
      )}

      {fileList.length > 0 && (
        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
          <Text type="secondary">
            {fileList.length} {fileList.length === 1 ? t('common.file') : t('common.files')} {t('common.selected')}
          </Text>
          <Space>
            <Button
              type="primary"
              icon={<UploadOutlined />}
              onClick={handleUpload}
              disabled={uploading || disabled}
              loading={uploading}
            >
              {t('common.upload')}
            </Button>
            <Button icon={<DeleteOutlined />} onClick={handleClear} disabled={uploading || disabled}>
              {t('common.clear')}
            </Button>
          </Space>
        </Space>
      )}
    </Space>
  );
};

export default FileUpload;
