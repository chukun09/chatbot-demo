import { Draft, Language } from '../types';
import { t } from '../utils/i18n';
import { FileText, Trash2, Clock } from 'lucide-react';

interface DraftsPanelProps {
  drafts: Draft[];
  onSelectDraft: (content: string, id: string) => void;
  onDeleteDraft: (id: string) => void;
  language: Language;
}

export const DraftsPanel = ({
  drafts,
  onSelectDraft,
  onDeleteDraft,
  language,
}: DraftsPanelProps) => {
  return (
    <div className="bg-white dark:bg-black border-t border-gray-300 dark:border-gray-700">
      <div className="p-3 border-b border-gray-300 dark:border-gray-700">
        <h3 className="text-sm font-semibold text-black dark:text-white flex items-center gap-2">
          <FileText size={16} />
          {t('drafts', language)}
        </h3>
      </div>
      <div className="max-h-40 overflow-y-auto scrollbar-hide">
        {drafts.length === 0 ? (
          <div className="p-4 text-center text-sm text-gray-400 dark:text-gray-500">
            {t('noDrafts', language)}
          </div>
        ) : (
          <div className="p-2 space-y-1">
            {drafts.map((draft) => (
              <div
                key={draft.id}
                className="group relative p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <button
                    onClick={() => onSelectDraft(draft.content, draft.id)}
                    className="flex-1 text-left min-w-0"
                  >
                    <p className="text-xs text-black dark:text-white truncate">
                      {draft.content.substring(0, 60)}
                      {draft.content.length > 60 && '...'}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      <Clock size={10} className="text-gray-400" />
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {draft.createdAt.toLocaleDateString()}
                      </span>
                    </div>
                  </button>
                  <button
                    onClick={() => onDeleteDraft(draft.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-black dark:hover:text-white transition-all"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};


