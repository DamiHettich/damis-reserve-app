interface LanguageButtonProps {
  language: string;
  isActive: boolean;
  onClick: () => void;
}

export function LanguageButton({ language, isActive, onClick }: LanguageButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center w-8 h-6 rounded-lg overflow-hidden ${
        isActive ? 'ring-2 ring-primary-600' : ''
      }`}
    >
      <img
        src={`/flags/${language}.svg`}
        alt={language === 'en' ? 'English' : 'Español'}
        className="w-8 h-6 object-cover"
      />
    </button>
  );
}
