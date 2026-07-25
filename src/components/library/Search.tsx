/**
 * Wakefit Clone - Search Component
 * Reusable, accessible search input with suggestions, recent searches, and keyboard navigation
 */

'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { SearchProps, SearchSuggestion, Product } from '@/types';

export function Search({
  className = '',
  placeholder = 'Search products...',
  value,
  onChange,
  onClear,
  onSubmit,
  onFocus,
  onBlur,
  suggestions = [],
  showClearButton = true,
  showSearchButton = true,
  disabled = false,
  autoFocus = false,
  debounceMs = 300,
  minCharsForSuggestions = 2,
  'data-testid': testId,
}: SearchProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [debouncedValue, setDebouncedValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  // Debounce value
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, debounceMs);
    return () => clearTimeout(timer);
  }, [value, debounceMs]);

  // Focus management
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  // Close suggestions on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard navigation
  const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
    const filteredSuggestions = suggestions.filter(s => s.text.toLowerCase().includes(debouncedValue.toLowerCase()));
    const maxIndex = filteredSuggestions.length - 1;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, maxIndex));
        setShowSuggestions(true);
        break;
      case 'ArrowUp':
        event.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, -1));
        break;
      case 'Enter':
        if (selectedIndex >= 0 && filteredSuggestions[selectedIndex]) {
          event.preventDefault();
          const suggestion = filteredSuggestions[selectedIndex];
          onSubmit(suggestion.text);
          if (suggestion.href) {
            window.location.href = suggestion.href;
          }
          setShowSuggestions(false);
          setSelectedIndex(-1);
          onClear?.();
        } else {
          onSubmit(value);
          setShowSuggestions(false);
          setSelectedIndex(-1);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
      case 'Tab':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
      default:
        setSelectedIndex(-1);
    }
  }, [debouncedValue, selectedIndex, suggestions, onSubmit, value, onClear]);

  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    onChange(newValue);
    if (newValue.length >= minCharsForSuggestions) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, [onChange, minCharsForSuggestions]);

  const handleFocus = useCallback((event: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    setShowSuggestions(value.length >= minCharsForSuggestions);
    onFocus?.();
  }, [value.length, minCharsForSuggestions, onFocus]);

  const handleBlur = useCallback((event: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    // Delay to allow click on suggestions
    setTimeout(() => {
      setShowSuggestions(false);
      setSelectedIndex(-1);
    }, 200);
    onBlur?.();
  }, [onBlur]);

  const handleClear = useCallback(() => {
    onClear?.();
    onChange('');
    inputRef.current?.focus();
    setShowSuggestions(false);
  }, [onClear, onChange]);

  const handleSuggestionClick = useCallback((suggestion: SearchSuggestion) => {
    onSubmit(suggestion.text);
    if (suggestion.href) {
      window.location.href = suggestion.href;
    }
    onClear?.();
    setShowSuggestions(false);
  }, [onSubmit, onClear]);

  // Filter suggestions based on input
  const filteredSuggestions = suggestions.filter(s =>
    s.text.toLowerCase().includes(debouncedValue.toLowerCase())
  );

  return (
    <div
      ref={wrapperRef}
      className={cn(
        'relative w-full',
        className
      )}
      data-testid={testId}
    >
      <label htmlFor="search-input" className="sr-only">
        Search
      </label>
      <div
        className={cn(
          'relative flex items-center',
          'bg-white border rounded-xl transition-all duration-200',
          'hover:border-wakefit-orange/50',
          isFocused && 'border-wakefit-orange shadow-lg shadow-wakefit-orange/10',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        <div className="absolute left-4 flex items-center pointer-events-none text-wakefit-gray/50">
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <input
          ref={inputRef}
          id="search-input"
          type="search"
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          role="combobox"
          aria-autocomplete="list"
          aria-controls="search-suggestions"
          aria-expanded={showSuggestions && filteredSuggestions.length > 0}
          aria-activedescendant={selectedIndex >= 0 ? `search-suggestion-${selectedIndex}` : undefined}
          className={cn(
            'flex-1 h-12 pl-12 pr-4',
            'bg-transparent border-0 outline-none',
            'text-wakefit-dark placeholder:text-wakefit-gray/40',
            'text-base',
            disabled && 'cursor-not-allowed'
          )}
          data-testid={`${testId}-input`}
        />

        {/* Clear Button */}
        {showClearButton && value && !disabled && (
          <motion.button
            onClick={handleClear}
            type="button"
            aria-label="Clear search"
            className="absolute right-3 flex items-center justify-center p-1.5 text-wakefit-gray/50 hover:text-wakefit-dark hover:bg-wakefit-gray/10 rounded-lg transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            data-testid={`${testId}-clear`}
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </motion.button>
        )}

        {/* Search Button */}
        {showSearchButton && !disabled && (
          <button
            type="submit"
            onClick={() => onSubmit(value)}
            aria-label="Search"
            className="absolute right-3 flex items-center justify-center p-2 text-wakefit-orange hover:bg-wakefit-orange/10 rounded-lg transition-colors"
            data-testid={`${testId}-submit`}
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        )}
      </div>

      {/* Suggestions Dropdown */}
      <AnimatePresence>
        {showSuggestions && filteredSuggestions.length > 0 && (
          <motion.div
            id="search-suggestions"
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border border-wakefit-gray/20 shadow-xl overflow-hidden z-50"
            role="listbox"
            data-testid={`${testId}-suggestions`}
          >
            {filteredSuggestions.map((suggestion, index) => (
              <motion.button
                key={suggestion.id}
                id={`search-suggestion-${index}`}
                type="button"
                onClick={() => handleSuggestionClick(suggestion)}
                role="option"
                aria-selected={index === selectedIndex}
                className={cn(
                  'w-full px-4 py-3 text-left transition-colors',
                  'flex items-center gap-3',
                  index === selectedIndex
                    ? 'bg-wakefit-orange/10 text-wakefit-orange'
                    : 'text-wakefit-dark hover:bg-wakefit-gray/50'
                )}
                data-testid={`${testId}-suggestion-${index}`}
              >
                {/* Suggestion Icon */}
                <span className="flex-shrink-0 text-wakefit-gray/50" aria-hidden="true">
                  {suggestion.type === 'product' && (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  )}
                  {suggestion.type === 'category' && (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                  )}
                  {suggestion.type === 'query' && (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  )}
                </span>

                {/* Suggestion Text */}
                <span className="flex-1 text-sm font-medium truncate">
                  {suggestion.text}
                </span>

                {/* Suggestion Meta */}
                {suggestion.count && (
                  <span className="text-xs text-wakefit-gray/50 px-2 py-0.5 bg-wakefit-gray/10 rounded-full">
                    {suggestion.count} results
                  </span>
                )}
              </motion.button>
            ))}

            {/* Divider before recent searches if mixed */}
            {suggestions.some(s => s.type === 'query') && suggestions.some(s => s.type !== 'query') && (
              <div className="border-t border-wakefit-gray/20 my-1" aria-hidden="true" />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading State */}
      {isFocused && showSuggestions && filteredSuggestions.length === 0 && value.length >= minCharsForSuggestions && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border border-wakefit-gray/20 shadow-xl p-4 text-center z-50">
          <p className="text-wakefit-gray/50 text-sm">No suggestions found for "{value}"</p>
        </div>
      )}
    </div>
  );
}

export default Search;