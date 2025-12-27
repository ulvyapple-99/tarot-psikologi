
import { Component, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TarotService } from '../services/tarot.service';
import { CardComponent } from './card.component';
import { TarotCard } from '../services/tarot.data';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-library',
  standalone: true,
  imports: [CommonModule, CardComponent, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-full container mx-auto px-4 py-8 pb-32">
      <div class="mb-8 text-center">
        <h2 class="text-3xl font-serif text-yellow-500 mb-2">Pustaka Simbol</h2>
        <p class="text-indigo-300">Eksplorasi makna 78 Arketipe Tarot Rider-Waite-Smith.</p>
      </div>

      <!-- Controls -->
      <div class="sticky top-0 bg-indigo-950/90 p-4 z-30 rounded-lg shadow-lg backdrop-blur mb-8 flex flex-col md:flex-row gap-4 justify-between items-center">
        
        <!-- Filter Buttons -->
        <div class="flex flex-wrap justify-center gap-2">
          <button (click)="filter.set('All')" 
                  class="px-4 py-1 rounded-full text-sm border transition-colors"
                  [class]="filter() === 'All' ? 'bg-yellow-600 border-yellow-600 text-indigo-950 font-bold' : 'border-indigo-600 text-indigo-300'">
            Semua
          </button>
          <button (click)="filter.set('Major')" 
                  class="px-4 py-1 rounded-full text-sm border transition-colors"
                  [class]="filter() === 'Major' ? 'bg-purple-600 border-purple-600 text-white font-bold' : 'border-indigo-600 text-indigo-300'">
            Major Arcana
          </button>
          <button (click)="filter.set('Minor')" 
                  class="px-4 py-1 rounded-full text-sm border transition-colors"
                  [class]="filter() === 'Minor' ? 'bg-blue-600 border-blue-600 text-white font-bold' : 'border-indigo-600 text-indigo-300'">
            Minor Arcana
          </button>
        </div>

        <!-- Search Bar -->
        <div class="relative w-full md:w-64">
           <input type="text" 
                  [(ngModel)]="searchQuery"
                  placeholder="Cari kartu..." 
                  class="w-full bg-indigo-900 border border-indigo-700 rounded-full py-1 px-4 text-sm text-white focus:outline-none focus:border-yellow-500">
           <span class="absolute right-3 top-1/2 transform -translate-y-1/2 text-indigo-400">🔍</span>
        </div>
      </div>

      <!-- Grid -->
      <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 md:gap-6">
        @for (card of filteredCards(); track card.id) {
          <div (click)="selectCard(card)" 
               class="cursor-pointer group flex flex-col items-center">
            <app-card [card]="card" [revealed]="true" class="transform group-hover:-translate-y-2 transition-transform duration-300"></app-card>
            <span class="mt-2 text-xs text-center text-indigo-300 group-hover:text-yellow-400 font-bold leading-tight max-w-[80px]">
              {{ card.nameIndo }}
            </span>
          </div>
        }
        @if (filteredCards().length === 0) {
          <div class="col-span-full text-center py-10 text-indigo-400 italic">
             Tidak ada kartu yang cocok dengan pencarian Anda.
          </div>
        }
      </div>

      <!-- Detail Modal -->
      @if (selectedCard()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" (click)="closeModal()">
          <div class="bg-indigo-900 border border-yellow-600 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col md:flex-row relative" (click)="$event.stopPropagation()">
            
            <button (click)="closeModal()" class="absolute top-2 right-2 text-indigo-400 hover:text-white z-10 bg-indigo-950/50 rounded-full w-8 h-8 flex items-center justify-center">✕</button>

            <!-- Image Side -->
            <div class="p-6 bg-indigo-950 flex items-center justify-center md:w-1/3 border-b md:border-b-0 md:border-r border-indigo-800">
               <div class="transform scale-110 flex flex-col items-center gap-2">
                 <app-card [card]="selectedCard()" [revealed]="true"></app-card>
                 @if (selectedCard()?.astrology) {
                    <span class="text-xs text-yellow-500 bg-indigo-900 px-2 py-1 rounded border border-yellow-900">
                       ✨ {{ selectedCard()?.astrology }}
                    </span>
                 }
               </div>
            </div>

            <!-- Text Side -->
            <div class="p-6 md:w-2/3">
              <span class="text-xs font-bold uppercase tracking-widest px-2 py-1 rounded bg-indigo-800 text-indigo-200 mb-2 inline-block">
                {{ selectedCard()?.arcana }} Arcana {{ selectedCard()?.suit ? '• ' + selectedCard()?.suit : '' }}
              </span>
              
              <h3 class="text-2xl font-serif text-yellow-500 mb-1">{{ selectedCard()?.nameIndo }}</h3>
              <h4 class="text-sm text-indigo-400 italic mb-4">{{ selectedCard()?.name }}</h4>

              <div class="mb-4">
                <h5 class="font-bold text-white text-sm mb-1">Kata Kunci:</h5>
                <div class="flex flex-wrap gap-2">
                  @for (kw of selectedCard()?.keywords; track kw) {
                    <span class="text-xs bg-indigo-800 px-2 py-1 rounded text-indigo-200">{{ kw }}</span>
                  }
                </div>
              </div>

              <div>
                <h5 class="font-bold text-white text-sm mb-1">Makna Psikologis:</h5>
                <p class="text-indigo-200 text-sm leading-relaxed">{{ selectedCard()?.description }}</p>
              </div>

            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class LibraryComponent {
  tarotService = inject(TarotService);
  
  fullDeck = this.tarotService.getDeck();
  filter = signal<'All' | 'Major' | 'Minor'>('All');
  searchQuery = signal<string>('');
  selectedCard = signal<TarotCard | null>(null);

  filteredCards = computed(() => {
    let cards = this.fullDeck;

    // Type Filter
    const f = this.filter();
    if (f !== 'All') {
      cards = cards.filter(c => c.arcana === f);
    }

    // Search Filter
    const q = this.searchQuery().toLowerCase().trim();
    if (q) {
      cards = cards.filter(c => 
        c.name.toLowerCase().includes(q) || 
        c.nameIndo.toLowerCase().includes(q) ||
        c.keywords.some(k => k.toLowerCase().includes(q))
      );
    }

    return cards;
  });

  selectCard(card: TarotCard) {
    this.selectedCard.set(card);
  }

  closeModal() {
    this.selectedCard.set(null);
  }
}
