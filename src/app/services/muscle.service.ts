import { Injectable } from '@angular/core';
import musclesData from '../data/muscles.json';

export interface Muscle {
  id: string;
  name: string;
  group: string;
  origin: string;
  insertion: string;
  innervation: string;
  action: string;
  imageSeed: string;
  imageUrl?: string;
}

@Injectable({
  providedIn: 'root'
})
export class MuscleService {
  private muscles: Muscle[] = musclesData as Muscle[];

  getMuscles(): Muscle[] {
    return this.muscles;
  }

  getMuscleById(id: string): Muscle | undefined {
    return this.muscles.find(m => m.id === id);
  }

  searchMuscles(query: string): Muscle[] {
    const lowerQuery = query.toLowerCase();
    return this.muscles.filter(m => 
      m.name.toLowerCase().includes(lowerQuery) || 
      m.action.toLowerCase().includes(lowerQuery) ||
      m.group.toLowerCase().includes(lowerQuery)
    );
  }

  getGroups(): string[] {
    const groups = new Set(this.muscles.map(m => m.group));
    return Array.from(groups).sort();
  }

  getMusclesByGroup(group: string): Muscle[] {
    return this.muscles.filter(m => m.group === group);
  }
}
