import { useState, useRef, useEffect, forwardRef } from 'react';
import { ChevronDown, Search, X } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SearchableSelectProps {
  label?: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
}

export const SearchableSelect = forwardRef<HTMLInputElement, SearchableSelectProps>(
  ({ label, options, value, onChange, placeholder = "Select...", error, disabled }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const containerRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find(o => o.value === value);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const filteredOptions = options.filter(o => 
      o.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div className="flex flex-col gap-1.5 relative w-full" ref={containerRef}>
        {label && (
          <label className="text-sm font-medium text-slate-700">
            {label}
          </label>
        )}
        
        {/* Hidden input for react-hook-form integration if needed */}
        <input type="hidden" value={value} ref={ref} />

        <div
          className={`flex items-center justify-between w-full min-h-[43px] px-3 bg-white border rounded-[15px] cursor-pointer transition-colors ${
            error ? 'border-red-500' : 'border-slate-200 hover:border-blue-400'
          } ${disabled ? 'opacity-50 cursor-not-allowed bg-slate-50' : ''}`}
          onClick={() => !disabled && setIsOpen(!isOpen)}
        >
          <div className="flex-1 truncate text-sm text-slate-700">
            {selectedOption ? selectedOption.label : <span className="text-slate-400">{placeholder}</span>}
          </div>
          <div className="flex items-center text-slate-400">
            {value && !disabled && (
              <X 
                size={16} 
                className="mr-1 hover:text-slate-600" 
                onClick={(e) => { e.stopPropagation(); onChange(""); setSearchTerm(""); }} 
              />
            )}
            <ChevronDown size={18} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </div>
        </div>

        {isOpen && !disabled && (
          <div className="absolute top-[calc(100%+4px)] left-0 w-full bg-white border border-slate-200 rounded-[15px] shadow-lg z-50 overflow-hidden flex flex-col max-h-60 animate-in fade-in slide-in-from-top-2">
            <div className="p-2 border-b border-slate-100 flex items-center gap-2 bg-slate-50">
              <Search size={16} className="text-slate-400" />
              <input
                autoFocus
                type="text"
                className="w-full bg-transparent border-none outline-none text-sm"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
            <div className="overflow-y-auto p-1 flex flex-col gap-1">
              {filteredOptions.length > 0 ? (
                filteredOptions.map(option => (
                  <div
                    key={option.value}
                    className={`px-3 py-2 rounded-[10px] text-sm cursor-pointer transition-colors ${
                      option.value === value ? 'bg-blue-50 text-blue-700 font-medium' : 'hover:bg-slate-50 text-slate-700'
                    }`}
                    onClick={() => {
                      onChange(option.value);
                      setSearchTerm("");
                      setIsOpen(false);
                    }}
                  >
                    {option.label}
                  </div>
                ))
              ) : (
                <div className="px-3 py-4 text-sm text-center text-slate-400">
                  No results found
                </div>
              )}
            </div>
          </div>
        )}

        {error && (
          <span className="text-xs text-red-500">{error}</span>
        )}
      </div>
    );
  }
);

SearchableSelect.displayName = 'SearchableSelect';
