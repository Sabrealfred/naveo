import { useTranslation } from 'react-i18next';
import { Button, Space } from 'antd';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <Space>
      <Button onClick={() => changeLanguage('en')} disabled={i18n.language === 'en'}>
        English
      </Button>
      <Button onClick={() => changeLanguage('es')} disabled={i18n.language === 'es'}>
        Español
      </Button>
    </Space>
  );
};

export default LanguageSwitcher;
