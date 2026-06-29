import { useState, useRef, useEffect, forwardRef } from 'react';
import { ChevronDown, Search, X, Loader2 } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
}

export interface AsyncSearchableSelectProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  loadOptions: (inputValue: string) => Promise<SelectOption[]>;
  defaultOption?: SelectOption;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
}

export const AsyncSearchableSelect = forwardRef<HTMLInputElement, AsyncSearchableSelectProps>(
  ({ label, value, onChange, loadOptions, defaultOption, placeholder = "Search...", error, disabled }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [options, setOptions] = useState<SelectOption[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedOption, setSelectedOption] = useState<SelectOption | null>(defaultOption || null);
    
    const containerRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Handle debounced search
    useEffect(() => {
      if (!isOpen) return;
      
      const timer = setTimeout(async () => {
        setIsLoading(true);
        try {
          const results = await loadOptions(searchTerm);
          setOptions(results);
        } catch (e) {
          console.error(e);
        } finally {
          setIsLoading(false);
        }
      }, 300);

      return () => clearTimeout(timer);
    }, [searchTerm, isOpen, loadOptions]);

    // Handle opening
    const handleOpen = () => {
      if (disabled) return;
      setIsOpen(true);
      setSearchTerm("");
    };

    // Handle clicking outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          containerRef.current && 
          !containerRef.current.contains(event.target as Node) &&
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
        }
      };

      if (isOpen) {
        document.addEventListener("pointerdown", handleClickOutside);
      }
      return () => document.removeEventListener("pointerdown", handleClickOutside);
    }, [isOpen]);



    const handleSelect = (option: SelectOption) => {
      setSelectedOption(option);
      onChange(option.value);
      setIsOpen(false);
    };

    const handleClear = (e: React.MouseEvent) => {
      e.stopPropagation();
      setSelectedOption(null);
      onChange("");
    };

    return (
      <div className="flex flex-col gap-1.5 relative w-full" ref={containerRef}>
        {label && (
          <label className="text-sm font-medium text-slate-700">
            {label}
          </label>
        )}
        
        <input type="hidden" value={value} ref={ref} />

        <div
          className={`flex items-center justify-between w-full min-h-[43px] px-3 bg-white border rounded-[15px] cursor-pointer transition-colors ${
            error ? 'border-red-500' : 'border-slate-200 hover:border-blue-400'
          } ${disabled ? 'opacity-50 cursor-not-allowed bg-slate-50' : ''}`}
          onClick={handleOpen}
        >
          <div className="flex-1 truncate text-sm text-slate-700">
            {selectedOption ? selectedOption.label : <span className="text-slate-400">{placeholder}</span>}
          </div>
          <div className="flex items-center text-slate-400 gap-1">
            {value && !disabled && (
              <X 
                size={16} 
                className="hover:text-slate-600 transition-colors" 
                onClick={handleClear} 
              />
            )}
            <ChevronDown size={18} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </div>
        </div>

        {error && (
          <span className="text-xs text-red-500">{error}</span>
        )}

        {isOpen && (
          <div 
            ref={dropdownRef}
            className="absolute top-[calc(100%+4px)] left-0 w-full bg-white border border-slate-200 rounded-[15px] shadow-xl z-50 overflow-hidden flex flex-col animate-in fade-in"
            style={{ maxHeight: '260px' }}
          >
            <div className="p-2 border-b border-slate-100 flex items-center gap-2 bg-slate-50/50">
              <Search size={16} className="text-slate-400" />
              <input
                autoFocus
                type="text"
                className="w-full bg-transparent border-none outline-none text-sm"
                placeholder="Search by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="overflow-y-auto p-1 flex flex-col gap-1">
              {isLoading ? (
                <div className="px-3 py-4 flex justify-center text-slate-400">
                  <Loader2 size={18} className="animate-spin" />
                </div>
              ) : options.length > 0 ? (
                options.map(option => (
                  <div
                    key={option.value}
                    className={`px-3 py-2.5 rounded-[10px] text-sm cursor-pointer transition-colors ${
                      option.value === value ? 'bg-blue-50 text-blue-700 font-medium' : 'hover:bg-slate-50 text-slate-700'
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleSelect(option);
                    }}
                  >
                    {option.label}
                  </div>
                ))
              ) : (
                <div className="px-3 py-4 text-sm text-center text-slate-400">
                  {searchTerm ? "No results found" : "Type to search..."}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }
);

AsyncSearchableSelect.displayName = 'AsyncSearchableSelect';
