import { Button } from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';
import { useLanguage } from '../hooks/useLanguage';

export default function LanguageSwitcher() {
    const { language, toggleLanguage, t } = useLanguage();

    return (
        <Button
            onClick={toggleLanguage}
            startIcon={<LanguageIcon />}
            sx={{
                color: 'white',
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 500,
                whiteSpace: 'nowrap',
                '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)'
                }
            }}
        >
            {language === 'en' ? t('common.translateToSpanish') : t('common.viewInEnglish')}
        </Button>
    );
}
