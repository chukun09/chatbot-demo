import { Clock, X } from 'lucide-react';
import { Language } from '../types';
import { t } from '../utils/i18n';

interface TemporaryChatToggleProps {
  isTemporary: boolean;
  onToggle: () => void;
  language: Language;
}

export const TemporaryChatToggle = ({
  isTemporary,
  onToggle,
  language,
}: TemporaryChatToggleProps) => {
  return (
    <button
      onClick={onToggle}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
        isTemporary
          ? 'bg-black dark:bg-white text-white dark:text-black border border-black dark:border-white'
          : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
      }`}
      title={isTemporary ? t('temporaryChatDesc', language) : t('temporaryChat', language)}
    >
      {isTemporary ? (
        <>
          <Clock size={16} />
          <span className="hidden sm:inline">{t('temporaryChat', language)}</span>
        </>
      ) : (
        <>
          <X size={16} />
          <span className="hidden sm:inline">{t('temporaryChat', language)}</span>
        </>
      )}
    </button>
  );
};

