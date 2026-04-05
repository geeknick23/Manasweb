'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { Input } from '@/components/ui/input';

interface SmartLocationSelectProps {
  id: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  states: string[];
  cities: string[];
  placeholder?: string;
  className?: string;
  label?: string;
}

export function SmartLocationSelect({
  id,
  name,
  value,
  onChange,
  states,
  cities,
  placeholder = "Type to search states or cities...",
  className = "",
  label
}: SmartLocationSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOptions, setFilteredOptions] = useState<Array<{type: 'state' | 'city', value: string}>>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Combine states and cities with type indicators
  const allOptions = useMemo(() => [
    ...states.map(state => ({ type: 'state' as const, value: state })),
    ...cities.map(city => ({ type: 'city' as const, value: city }))
  ], [states, cities]);

  // Filter options based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredOptions(allOptions);
    } else {
      const searchLower = searchTerm.toLowerCase();
      setFilteredOptions(
        allOptions.filter(option => 
          option.value.toLowerCase().includes(searchLower)
        )
      );
    }
  }, [searchTerm, allOptions]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputClick = () => {
    setIsOpen(true);
    setSearchTerm('');
  };

  const handleOptionClick = (option: {type: 'state' | 'city', value: string}) => {
    // Create a synthetic event to match the expected onChange signature
    const syntheticEvent = {
      target: {
        name,
        value: option.value
      }
    } as React.ChangeEvent<HTMLInputElement | HTMLSelectElement>;
    
    onChange(syntheticEvent);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setIsOpen(true);
  };

  const displayValue = value || searchTerm;

  return (
    <div className="relative" ref={dropdownRef}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className="relative">
        <Input
          id={id}
          name={name}
          type="text"
          value={displayValue}
          onChange={handleInputChange}
          onClick={handleInputClick}
          placeholder={placeholder}
          className={`${className} cursor-pointer`}
          readOnly={!isOpen}
        />
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <svg 
            className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
          {filteredOptions.length === 0 ? (
            <div className="px-4 py-2 text-gray-500 text-sm">
              No matching locations
            </div>
          ) : (
            <>
              <div 
                className="px-4 py-2 text-sm text-gray-500 border-b border-gray-200 cursor-pointer hover:bg-gray-50"
                onClick={() => handleOptionClick({type: 'state', value: ''})}
              >
                All Locations
              </div>
              {filteredOptions.map((option, index) => (
                <div
                  key={`${option.type}-${option.value}-${index}`}
                  className="px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-primary-50 hover:text-primary-900 flex items-center justify-between"
                  onClick={() => handleOptionClick(option)}
                >
                  <span>{option.value}</span>
                  <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                    {option.type}
                  </span>
                </div>
              ))}
            </>
          )}
        </div>
      )}
      
      {searchTerm && (
        <p className="mt-1 text-xs text-gray-500">
          Showing {filteredOptions.length} of {allOptions.length} locations
        </p>
      )}
    </div>
  );
}
