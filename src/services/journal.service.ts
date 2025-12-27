
import { Injectable, signal, effect } from '@angular/core';
import { TarotCard } from './tarot.data';

export interface JournalEntry {
  id: string;
  timestamp: number;
  spreadName: string;
  cards: {
    positionName: string;
    cardName: string;
    isReversed: boolean;
    suit: string | undefined;
    arcana: string;
  }[];
  aiInterpretation: string;
  userNotes: string;
}

@Injectable({
  providedIn: 'root'
})
export class JournalService {
  private readonly STORAGE_KEY = 'tarot_journal_entries';
  
  entries = signal<JournalEntry[]>([]);

  constructor() {
    this.loadEntries();
  }

  private loadEntries() {
    const data = localStorage.getItem(this.STORAGE_KEY);
    if (data) {
      try {
        this.entries.set(JSON.parse(data));
      } catch (e) {
        console.error('Failed to parse journal entries', e);
        this.entries.set([]);
      }
    }
  }

  addEntry(entry: Omit<JournalEntry, 'id' | 'timestamp'>) {
    const newEntry: JournalEntry = {
      ...entry,
      id: crypto.randomUUID(),
      timestamp: Date.now()
    };

    this.entries.update(current => [newEntry, ...current]);
    this.saveToStorage();
  }

  deleteEntry(id: string) {
    this.entries.update(current => current.filter(e => e.id !== id));
    this.saveToStorage();
  }

  private saveToStorage() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.entries()));
  }
}
