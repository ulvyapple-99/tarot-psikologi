
import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TarotService } from '../services/tarot.service';
import { JournalService } from '../services/journal.service';
import { TarotCard, TarotSpread } from '../services/tarot.data';
import { CardComponent } from './card.component';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

type ReadingState = 'SELECT_SPREAD' | 'SHUFFLE' | 'PICK_CARDS' | 'REVEAL' | 'INTERPRETATION';

@Component({
  selector: 'app-reading',
  standalone: true,
  imports: [CommonModule, CardComponent, FormsModule],
  template: `
    <div class="min-h-full flex flex-col items-center p-4 pb-32 relative w-full">
      
      <!-- Progress / Header -->
      <div class="w-full max-w-4xl mb-6 text-center mt-4">
        <h2 class="text-2xl md:text-3xl text-yellow-500 font-serif mb-2">{{ currentStateTitle() }}</h2>
        <div class="h-1 w-24 bg-gradient-to-r from-transparent via-yellow-600 to-transparent mx-auto"></div>
      </div>

      <!-- STEP 1: Select Spread -->
      @if (state() === 'SELECT_SPREAD') {
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full animate-fade-in pb-10">
          @for (spread of spreads; track spread.id) {
            <div (click)="selectSpread(spread)" 
                 class="bg-indigo-900/60 border border-indigo-700 p-6 rounded-xl hover:bg-indigo-800/80 hover:border-yellow-500 cursor-pointer transition-all hover:scale-105 group backdrop-blur-sm">
              <h3 class="text-xl font-bold text-yellow-100 mb-2 group-hover:text-yellow-400">{{ spread.name }}</h3>
              <p class="text-indigo-200 text-sm mb-4">{{ spread.description }}</p>
              <div class="flex items-center gap-2 text-xs text-indigo-400">
                <span class="bg-indigo-950 px-2 py-1 rounded">{{ spread.positions.length }} Kartu</span>
              </div>
            </div>
          }
        </div>
      }

      <!-- STEP 2: Shuffle & Focus -->
      @if (state() === 'SHUFFLE') {
        <div class="flex flex-col items-center gap-8 animate-fade-in text-center max-w-2xl py-10">
          <p class="text-lg text-indigo-100">
            Fokuskan pikiran Anda pada pertanyaan atau situasi yang ingin Anda selidiki.
            Tarik napas dalam, dan tekan tombol kocok ketika Anda merasa siap.
          </p>
          
          <div class="relative w-48 h-64">
            <!-- Deck Animation visual -->
            @for (i of [1,2,3,4,5]; track i) {
               <div class="absolute inset-0 border-2 border-yellow-600/50 bg-indigo-900 rounded-lg shadow-xl"
                    [style.transform]="'rotate(' + (i * 2 - 6) + 'deg) translate(' + (i * 2) + 'px, ' + (i * -2) + 'px)'">
                    <div class="w-full h-full bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')] opacity-30"></div>
               </div>
            }
          </div>

          <button (click)="finishShuffle()" 
                  class="bg-yellow-600 hover:bg-yellow-500 text-indigo-950 font-bold py-3 px-8 rounded-full shadow-lg shadow-yellow-600/20 transition-all transform hover:scale-105 flex items-center gap-2">
            <span>🔀</span> Kocok Kartu
          </button>
        </div>
      }

      <!-- STEP 3: Pick Cards -->
      @if (state() === 'PICK_CARDS') {
        <div class="flex flex-col items-center gap-6 w-full animate-fade-in pb-20">
          <div class="sticky top-0 z-30 bg-indigo-950/90 backdrop-blur px-6 py-3 rounded-full border border-indigo-500/50 shadow-lg mt-2">
             <span class="text-yellow-200">Pilih kartu ke-{{ selectedCards().length + 1 }}:</span> 
             <span class="font-bold text-white ml-2">{{ getCurrentPositionName() }}</span>
          </div>

          <!-- Fan of cards to pick from -->
          <div class="flex flex-wrap justify-center gap-1 md:gap-2 max-w-5xl py-4 px-4">
             @for (card of shuffledDeck(); track card.id; let i = $index) {
               <div (click)="pickCard(card)" 
                    class="w-12 h-20 md:w-16 md:h-28 bg-indigo-800 border border-indigo-600 rounded cursor-pointer hover:-translate-y-4 hover:bg-yellow-600 transition-all duration-300 shadow-md"
                    [class.opacity-0]="isCardSelected(card)"
                    [class.pointer-events-none]="isCardSelected(card)">
               </div>
             }
          </div>
        </div>
      }

      <!-- STEP 4: Reveal Spread -->
      @if (state() === 'REVEAL' || state() === 'INTERPRETATION') {
        <div class="w-full max-w-6xl animate-fade-in pb-10">
          
          <!-- Spread Layout Visualization -->
          <div class="flex flex-wrap justify-center gap-4 md:gap-8 mb-10 mt-6">
            @for (selection of selectedCards(); track selection.position) {
              <div class="flex flex-col items-center gap-3 animate-slide-up" [style.animation-delay]="selection.position * 100 + 'ms'">
                <div class="text-xs text-yellow-500 font-serif uppercase tracking-widest mb-1">{{ getPositionName(selection.position) }}</div>
                <app-card [card]="selection.card" 
                          [revealed]="true" 
                          [reversed]="selection.isReversed">
                </app-card>
              </div>
            }
          </div>

          <!-- Interpretation Action -->
          @if (state() === 'REVEAL') {
             <div class="flex justify-center mt-8 mb-10">
               <button (click)="generateInterpretation()" 
                       class="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-8 rounded-lg shadow-lg flex items-center gap-3 transition-all">
                 <span>✨</span> Analisis Psikologis (AI)
               </button>
             </div>
          }

          <!-- AI Result -->
          @if (state() === 'INTERPRETATION') {
            <div class="bg-indigo-900/80 border border-yellow-600/30 rounded-lg p-6 md:p-10 max-w-3xl mx-auto shadow-2xl backdrop-blur-md mb-10">
              <h3 class="text-2xl font-serif text-yellow-500 mb-6 border-b border-yellow-600/20 pb-4">Konseling Tarot</h3>
              
              @if (isLoading()) {
                <div class="flex flex-col items-center py-10 gap-4">
                   <div class="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
                   <p class="text-indigo-200 animate-pulse">Menghubungkan simbol dengan bawah sadar...</p>
                </div>
              } @else {
                <!-- AI Text -->
                <div class="prose prose-invert prose-yellow max-w-none text-indigo-100 leading-relaxed space-y-4 whitespace-pre-wrap mb-8">
                  {{ interpretationResult() }}
                </div>
                
                <!-- Journal Form -->
                <div class="bg-indigo-950/50 p-6 rounded-lg border border-indigo-800">
                  <h4 class="text-yellow-500 font-bold mb-3 flex items-center gap-2">
                    <span>📝</span> Refleksi Pribadi & Jurnal
                  </h4>
                  <div class="mb-4">
                    <label class="block text-indigo-300 text-sm mb-2">Apa yang Anda rasakan tentang bacaan ini? Catat pemikiran Anda di sini.</label>
                    <textarea [(ngModel)]="userNotes" 
                              class="w-full bg-indigo-900/50 border border-indigo-700 rounded p-3 text-indigo-100 focus:outline-none focus:border-yellow-600 placeholder-indigo-500/50"
                              rows="4"
                              placeholder="Tulis refleksi Anda..."></textarea>
                  </div>
                  
                  <div class="flex flex-col md:flex-row justify-between items-center gap-4">
                    <button (click)="saveToJournal()" 
                            [disabled]="isSaved()"
                            class="w-full md:w-auto px-6 py-2 rounded-lg font-bold transition-all flex items-center justify-center gap-2"
                            [ngClass]="isSaved() ? 'bg-green-700/50 text-green-200 cursor-not-allowed' : 'bg-yellow-600 hover:bg-yellow-500 text-indigo-950'">
                       <span>{{ isSaved() ? '✅ Tersimpan di Jurnal' : '💾 Simpan ke Jurnal' }}</span>
                    </button>

                    <button (click)="reset()" class="text-indigo-400 hover:text-white underline text-sm">
                      Mulai Sesi Baru
                    </button>
                  </div>
                </div>

              }
            </div>
          }

        </div>
      }

    </div>
  `,
  styles: [`
    .animate-fade-in { animation: fadeIn 0.5s ease-out; }
    .animate-slide-up { animation: slideUp 0.5s ease-out backwards; }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class ReadingComponent {
  tarotService = inject(TarotService);
  journalService = inject(JournalService);
  router = inject(Router);

  // Data
  spreads = this.tarotService.getSpreads();
  
  // State Signals
  state = signal<ReadingState>('SELECT_SPREAD');
  selectedSpread = signal<TarotSpread | null>(null);
  shuffledDeck = signal<TarotCard[]>([]);
  selectedCards = signal<{position: number, card: TarotCard, isReversed: boolean}[]>([]);
  interpretationResult = signal<string>('');
  isLoading = signal<boolean>(false);
  
  // Journal State
  userNotes = signal<string>('');
  isSaved = signal<boolean>(false);

  currentStateTitle = computed(() => {
    switch(this.state()) {
      case 'SELECT_SPREAD': return 'Pilih Metode Tebaran';
      case 'SHUFFLE': return 'Penyelarasan Energi';
      case 'PICK_CARDS': return 'Pemilihan Kartu';
      case 'REVEAL': return 'Visualisasi Simbol';
      case 'INTERPRETATION': return 'Wacana Konseling';
      default: return '';
    }
  });

  selectSpread(spread: TarotSpread) {
    this.selectedSpread.set(spread);
    this.state.set('SHUFFLE');
  }

  finishShuffle() {
    this.shuffledDeck.set(this.tarotService.shuffleDeck());
    this.state.set('PICK_CARDS');
  }

  pickCard(card: TarotCard) {
    const currentSpread = this.selectedSpread();
    if (!currentSpread) return;

    const currentCount = this.selectedCards().length;
    const totalPositions = currentSpread.positions.length;

    if (currentCount < totalPositions) {
      // 20% chance of reversal
      const isReversed = Math.random() < 0.2;
      
      this.selectedCards.update(cards => [
        ...cards, 
        { position: currentCount + 1, card, isReversed }
      ]);

      if (this.selectedCards().length === totalPositions) {
        setTimeout(() => this.state.set('REVEAL'), 500);
      }
    }
  }

  isCardSelected(card: TarotCard): boolean {
    return this.selectedCards().some(c => c.card.id === card.id);
  }

  getCurrentPositionName(): string {
    const spread = this.selectedSpread();
    if (!spread) return '';
    const nextIdx = this.selectedCards().length;
    return spread.positions[nextIdx]?.name || '';
  }

  getPositionName(posId: number): string {
    return this.selectedSpread()?.positions.find(p => p.id === posId)?.name || '';
  }

  async generateInterpretation() {
    const spread = this.selectedSpread();
    const cards = this.selectedCards();
    if (!spread || cards.length === 0) return;

    this.state.set('INTERPRETATION');
    this.isLoading.set(true);

    try {
      const result = await this.tarotService.interpretReading(spread, cards);
      this.interpretationResult.set(result);
    } finally {
      this.isLoading.set(false);
    }
  }

  saveToJournal() {
    const spread = this.selectedSpread();
    if (!spread || this.isSaved()) return;

    const simplifiedCards = this.selectedCards().map(c => ({
      positionName: this.getPositionName(c.position),
      cardName: c.card.nameIndo,
      isReversed: c.isReversed,
      suit: c.card.suit,
      arcana: c.card.arcana
    }));

    this.journalService.addEntry({
      spreadName: spread.name,
      cards: simplifiedCards,
      aiInterpretation: this.interpretationResult(),
      userNotes: this.userNotes()
    });

    this.isSaved.set(true);
  }

  reset() {
    this.selectedCards.set([]);
    this.interpretationResult.set('');
    this.userNotes.set('');
    this.isSaved.set(false);
    this.state.set('SELECT_SPREAD');
  }
}
