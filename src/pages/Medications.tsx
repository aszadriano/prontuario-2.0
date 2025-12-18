// pages/Medications.tsx
import React, { useState } from 'react';
import { Medication } from '../types/medication';
import { Card } from '../components/Card';
import { MedicationSearch } from '../components/MedicationSearch';
import { MedicationCard } from '../components/MedicationCard';
import { MedicationDetails } from '../components/MedicationDetails';

export const Medications: React.FC = () => {
  const [selectedMedication, setSelectedMedication] = useState<Medication | null>(null);
  const [searchResults, setSearchResults] = useState<Medication[]>([]);

  const handleSelectMedication = (medication: Medication) => {
    setSearchResults((prev) => {
      // Evita duplicatas
      if (prev.find((m) => m.id === medication.id)) {
        return prev;
      }
      return [medication, ...prev];
    });
  };

  return (
    <div className="medications-page">
      <div className="page-header">
        <h1>Medicamentos</h1>
        <p>Busque e visualize informações sobre medicamentos</p>
      </div>

      <Card>
        <MedicationSearch onSelect={handleSelectMedication} />
      </Card>

      {searchResults.length > 0 && (
        <Card title="Resultados da Busca">
          {searchResults.map((medication) => (
            <MedicationCard
              key={medication.id}
              medication={medication}
              onViewDetails={setSelectedMedication}
            />
          ))}
        </Card>
      )}

      {searchResults.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">💊</div>
          <h3>Busque um medicamento</h3>
          <p>Use a busca acima para encontrar informações sobre medicamentos</p>
        </div>
      )}

      {selectedMedication && (
        <MedicationDetails
          medication={selectedMedication}
          onClose={() => setSelectedMedication(null)}
        />
      )}

      <style>{`
        .medications-page {
          padding: 24px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .page-header {
          margin-bottom: 24px;
        }

        .page-header h1 {
          margin: 0 0 8px 0;
          font-size: 32px;
          font-weight: 600;
          color: #1f2937;
        }

        .page-header p {
          margin: 0;
          font-size: 16px;
          color: #6b7280;
        }

        .empty-state {
          text-align: center;
          padding: 60px 20px;
        }

        .empty-icon {
          font-size: 64px;
          margin-bottom: 16px;
        }

        .empty-state h3 {
          margin: 0 0 8px 0;
          font-size: 20px;
          font-weight: 600;
          color: #1f2937;
        }

        .empty-state p {
          margin: 0;
          font-size: 16px;
          color: #6b7280;
        }
      `}</style>
    </div>
  );
};
