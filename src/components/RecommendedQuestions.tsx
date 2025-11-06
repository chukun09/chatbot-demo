import { Language } from '../types';
import { recommendedQuestions } from '../utils/recommendedQuestions';
import { t } from '../utils/i18n';
import { Sparkles } from 'lucide-react';

interface RecommendedQuestionsProps {
  language: Language;
  onSelect: (question: string) => void;
}

export const RecommendedQuestions = ({
  language,
  onSelect,
}: RecommendedQuestionsProps) => {
  const questions = recommendedQuestions[language] || recommendedQuestions.en;

  return (
    <div className="mb-6 animate-slide-up">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles size={18} className="text-black dark:text-white" />
        <h3 className="text-sm font-semibold text-black dark:text-white">
          {t('recommendedQuestions', language)}
        </h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {questions.map((question, index) => (
          <button
            key={index}
            onClick={() => onSelect(question)}
            className="px-4 py-2 text-sm bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 hover:border-black dark:hover:border-white text-black dark:text-white transition-all duration-200 shadow-sm hover:shadow-md"
          >
            {question}
          </button>
        ))}
      </div>
    </div>
  );
};


