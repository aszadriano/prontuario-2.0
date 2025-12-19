import { Injectable } from '@nestjs/common';
import { DrugInteractionCheckDto } from './dto/drug-interaction-check.dto';
import { DrugInteractionResultDto } from './dto/drug-interaction-result.dto';

@Injectable()
export class DrugInteractionsService {
  async checkInteractions(checkDto: DrugInteractionCheckDto): Promise<DrugInteractionResultDto> {
    // Mock implementation - in a real scenario, this would integrate with a drug interaction database
    // For MVP, we'll return some sample interactions based on common drug combinations
    
    const interactions = this.getMockInteractions(checkDto.medicationIds);
    
    return {
      interactions
    };
  }

  private getMockInteractions(medicationIds: string[]): any[] {
    // This is a mock implementation for MVP
    // In a real scenario, this would query a drug interaction database
    
    const interactions = [];

    // Sample interactions based on common medications
    if (medicationIds.length >= 2) {
      interactions.push({
        severity: 'moderate' as const,
        description: 'Aumento do risco de sangramento quando usado concomitantemente',
        medications: ['Aspirina', 'Warfarina']
      });
    }

    if (medicationIds.length >= 3) {
      interactions.push({
        severity: 'major' as const,
        description: 'Interação grave: risco de depressão respiratória',
        medications: ['Morfina', 'Diazepam', 'Álcool']
      });
    }

    // Add some random interactions for demonstration
    if (medicationIds.length > 0 && Math.random() > 0.7) {
      interactions.push({
        severity: 'minor' as const,
        description: 'Pode causar sonolência aumentada',
        medications: ['Cetirizina', 'Dipirona']
      });
    }

    return interactions;
  }
}
