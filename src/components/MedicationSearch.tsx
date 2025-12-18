// components/MedicationSearch.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Medication } from '../types/medication';
import { medicationService } from '../services/medicationService';
import { Spinner } from './Spinner';

interface MedicationSearchProps {
  onSelect: (medication: Medication) => void;
  placeholder?: string;
}

export const MedicationSearch: React.FC<MedicationSearchProps> = ({
  onSelect,
  placeholder = 'Buscar medicamento...',
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Medication[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const searchMedications = async () => {
      if (query.length < 2) {
        setResults([]);
        setShowResults(false);
        return;
      }

      setLoading(true);
      try {
        const data = await medicationService.searchMedications(query);
        setResults(data);
        setShowResults(true);
      } catch (error) {
        console.error('Erro ao buscar medicamentos:', error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(searchMedications, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  const handleSelect = (medication: Medication) => {
    onSelect(medication);
    setQuery('');
    setResults([]);
    setShowResults(false);
  };

  return (
    <div className="medication-search" ref={searchRef}>
      <div className="search-input-wrapper">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          className="search-input"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 2 && setShowResults(true)}
        />
        {loading && (
          <div className="search-loading">
            <Spinner size="sm" />
          </div>
        )}
      </div>

      {showResults && results.length > 0 && (
        <div className="search-results">
          {results.map((medication) => (
            <button
              key={medication.id}
              className="search-result-item"
              onClick={() => handleSelect(medication)}
              type="button"
            >
              <div className="medication-name">{medication.name}</div>
              <div className="medication-category">{medication.category}</div>
            </button>
          ))}
        </div>
      )}

      {showResults && !loading && query.length >= 2 && results.length === 0 && (
        <div className="search-results">
          <div className="search-no-results">Nenhum medicamento encontrado</div>
        </div>
      )}

      <style>{`
        .medication-search {
          position: relative;
          width: 100%;
        }

        .search-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .search-icon {
          position: absolute;
          left: 12px;
          font-size: 18px;
          color: #9ca3af;
        }

        .search-input {
          width: 100%;
          padding: 12px 12px 12px 44px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 14px;
          transition: all 0.2s;
        }

        .search-input:focus {
          outline: none;
          border-color: #9b87f5;
          box-shadow: 0 0 0 3px rgba(155, 135, 245, 0.1);
        }

        .search-loading {
          position: absolute;
          right: 12px;
        }

        .search-results {
          position: absolute;
          top: calc(100% + 4px);
          left: 0;
          right: 0;
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
          max-height: 300px;
          overflow-y: auto;
          z-index: 10;
        }

        .search-result-item {
          width: 100%;
          padding: 12px 16px;
          border: none;
          background: none;
          text-align: left;
          cursor: pointer;
          transition: background 0.2s;
          border-bottom: 1px solid #f3f4f6;
        }

        .search-result-item:last-child {
          border-bottom: none;
        }

        .search-result-item:hover {
          background: #f9fafb;
        }

        .medication-name {
          font-size: 14px;
          font-weight: 500;
          color: #1f2937;
          margin-bottom: 4px;
        }

        .medication-category {
          font-size: 12px;
          color: #6b7280;
        }

        .search-no-results {
          padding: 16px;
          text-align: center;
          font-size: 14px;
          color: #6b7280;
        }
      `}</style>
    </div>
  );
};
