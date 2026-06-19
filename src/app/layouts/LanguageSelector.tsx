import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown } from 'lucide-react';
import { useAppSelector } from "@/core/hooks/useAppSelector";
import { selectDashboardPage } from "@/core/store/selectors/uiSelectors";

const languages = [
  { code: 'en', name: 'English', flagUrl: 'https://flagcdn.com/w40/gb.png' },
  { code: 'fr', name: 'Français', flagUrl: 'https://flagcdn.com/w40/fr.png' }
];

export default function LanguageSelector() {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isDashboardPage = useAppSelector(selectDashboardPage);

  const currentLangCode = i18n.language.startsWith('fr') ? 'fr' : 'en';
  const currentLang = languages.find(l => l.code === currentLangCode) || languages[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (code: string) => {
    i18n.changeLanguage(code);
    localStorage.setItem('i18nextLng', code);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-colors ${
          isDashboardPage 
            ? "bg-white/20 hover:bg-white/30 text-white" 
            : "bg-gray-100 hover:bg-gray-200 text-gray-800"
        }`}
      >
        <img src={currentLang.flagUrl} alt={currentLang.code} className="w-5 h-auto rounded-sm shadow-sm" />
        <span className="text-sm font-semibold uppercase">{currentLang.code}</span>
        <ChevronDown size={14} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 right-0 w-40 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="py-1">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleSelect(lang.code)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                  currentLangCode === lang.code 
                    ? 'bg-blue-50 text-blue-700 font-semibold' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <img src={lang.flagUrl} alt={lang.code} className="w-6 h-auto rounded-sm shadow-sm object-cover" />
                <span>{lang.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
