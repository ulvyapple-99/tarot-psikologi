
import { Component, inject, signal, computed, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TarotService } from '../services/tarot.service';
import { JournalService } from '../services/journal.service';
import { AudioService } from '../services/audio.service';
import { TarotCard, TarotSpread } from '../services/tarot.data';
import { CardComponent } from './card.component';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

type ReadingState = 'INPUT_CONTEXT' | 'SELECT_SPREAD' | 'SELECT_SIGNIFICATOR' | 'SHUFFLE' | 'PICK_CARDS' | 'REVEAL' | 'INTERPRETATION';

interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
}

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

      <!-- STEP 0: Context / Intention -->
      @if (state() === 'INPUT_CONTEXT') {
        <div class="w-full max-w-2xl animate-fade-in pb-10 flex flex-col items-center">
          <div class="bg-indigo-900/60 border border-indigo-700 p-8 rounded-xl w-full text-center">
            <span class="text-6xl mb-4 block">🧘</span>
            <h3 class="text-xl text-yellow-100 font-bold mb-4">Tetapkan Intensi Anda</h3>
            <p class="text-indigo-200 mb-6 text-sm md:text-base">
              Apa yang sedang membebani pikiran Anda? Atau area mana yang ingin Anda eksplorasi?
              (Karir, Hubungan, Trauma Masa Lalu, atau Pengembangan Diri)
            </p>
            
            <textarea [(ngModel)]="userContext" 
                      class="w-full bg-indigo-950/50 border border-indigo-600 rounded-lg p-4 text-white focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all mb-6 placeholder-indigo-500"
                      rows="4"
                      placeholder="Contoh: Saya merasa buntu dalam pekerjaan saya dan bingung harus bertahan atau resign..."></textarea>
            
            <button (click)="submitContext()" 
                    class="bg-yellow-600 hover:bg-yellow-500 text-indigo-950 font-bold py-3 px-8 rounded-full shadow-lg transition-transform hover:scale-105">
              Lanjutkan ke Pilihan Tebaran
            </button>
            
            <button (click)="skipContext()" class="mt-4 text-indigo-400 text-sm hover:text-white underline">
              Lewati (General Reading)
            </button>
          </div>
        </div>
      }

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

      <!-- STEP 1.5: Select Significator -->
      @if (state() === 'SELECT_SIGNIFICATOR') {
        <div class="flex flex-col items-center gap-6 w-full animate-fade-in pb-20 max-w-6xl">
          <div class="bg-indigo-900/80 p-6 rounded-lg text-center border border-indigo-700 max-w-2xl">
            <h3 class="text-xl text-yellow-100 font-bold mb-2">Pilih Significator</h3>
            <p class="text-indigo-200 text-sm mb-4">
              Pilihlah kartu yang mewakili "Diri Anda" atau "Situasi Anda" saat ini.
            </p>
            
            <!-- Significator Filter -->
            <div class="flex justify-center gap-2 mb-2">
              <button (click)="sigFilter.set('Major')" [class]="sigFilter() === 'Major' ? 'bg-yellow-600 text-indigo-900' : 'bg-indigo-950 text-indigo-400'" class="px-3 py-1 rounded-full text-xs font-bold transition-colors">Major Arcana</button>
              <button (click)="sigFilter.set('Court')" [class]="sigFilter() === 'Court' ? 'bg-yellow-600 text-indigo-900' : 'bg-indigo-950 text-indigo-400'" class="px-3 py-1 rounded-full text-xs font-bold transition-colors">Court Cards (Raja/Ratu)</button>
            </div>
          </div>

          <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 overflow-y-auto max-h-[60vh] p-2 custom-scrollbar">
             @for (card of filteredSignificators(); track card.id) {
               <div (click)="chooseSignificator(card)" class="flex flex-col items-center gap-2 cursor-pointer group">
                  <app-card [card]="card" [revealed]="true" class="transform group-hover:scale-110 transition-transform"></app-card>
                  <span class="text-[10px] text-center text-indigo-300 group-hover:text-white leading-tight">{{ card.nameIndo }}</span>
               </div>
             }
          </div>
        </div>
      }

      <!-- STEP 2: Shuffle & Focus -->
      @if (state() === 'SHUFFLE') {
        <div class="flex flex-col items-center gap-8 animate-fade-in text-center max-w-2xl py-10">
          @if (significator()) {
            <div class="flex flex-col items-center gap-2 mb-4">
              <span class="text-xs uppercase tracking-widest text-indigo-400">Significator Anda</span>
              <div class="transform scale-75">
                <app-card [card]="significator()" [revealed]="true"></app-card>
              </div>
            </div>
          }

          <p class="text-lg text-indigo-100">
            Fokus pada intensi Anda: <br>
            <span class="text-yellow-500 italic">"{{ userContext() || 'Mohon petunjuk untuk kebaikan tertinggi.' }}"</span>
          </p>
          
          <div class="relative w-48 h-64 group cursor-pointer" (click)="finishShuffle()">
            <!-- Deck Animation visual -->
            @for (i of [1,2,3,4,5]; track i) {
               <div class="absolute inset-0 border border-yellow-900 bg-indigo-900 rounded-lg shadow-2xl transition-transform duration-500"
                    [style.transform]="'rotate(' + (i * 3 - 9) + 'deg) translate(' + (i * 2) + 'px, ' + (i * -2) + 'px)'"
                    [class.group-hover:animate-pulse]="true">
                    <div class="w-full h-full bg-[repeating-linear-gradient(45deg,#1e1b4b,#1e1b4b_10px,#312e81_10px,#312e81_20px)] rounded-lg border-2 border-yellow-600/30"></div>
               </div>
            }
             <div class="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                <span class="text-4xl animate-bounce">👇</span>
             </div>
          </div>

          <button (click)="finishShuffle()" 
                  class="bg-yellow-600 hover:bg-yellow-500 text-indigo-950 font-bold py-3 px-12 rounded-full shadow-lg shadow-yellow-600/20 transition-all transform hover:scale-105 flex items-center gap-2">
            <span>🔀</span> KOCOK & TEBAR
          </button>
        </div>
      }

      <!-- STEP 3: Pick Cards -->
      @if (state() === 'PICK_CARDS') {
        <div class="flex flex-col items-center gap-6 w-full animate-fade-in pb-20">
          <div class="sticky top-0 z-30 bg-indigo-950/90 backdrop-blur px-6 py-3 rounded-full border border-indigo-500/50 shadow-lg mt-2 flex items-center gap-4">
             <div>
               <span class="text-yellow-200 text-xs uppercase">Kartu ke-{{ selectedCards().length + 1 }}</span>
               <div class="font-bold text-white text-lg leading-none">{{ getCurrentPositionName() }}</div>
             </div>
          </div>

          <!-- Fan of cards to pick from -->
          <div class="flex flex-wrap justify-center gap-1 md:gap-2 max-w-6xl py-4 px-4 perspective-1000">
             @for (card of shuffledDeck(); track card.id; let i = $index) {
               <div (click)="pickCard(card)" 
                    class="w-10 h-16 md:w-14 md:h-24 bg-indigo-900 border border-indigo-700 rounded cursor-pointer hover:-translate-y-6 transition-all duration-300 shadow-md transform hover:scale-110"
                    [class.opacity-0]="isCardSelected(card)"
                    [class.pointer-events-none]="isCardSelected(card)"
                    [style.transition-delay]="(i * 5) + 'ms'">
                    <div class="w-full h-full bg-[repeating-linear-gradient(45deg,#1e1b4b,#1e1b4b_5px,#312e81_5px,#312e81_10px)] rounded opacity-80"></div>
               </div>
             }
          </div>
        </div>
      }

      <!-- STEP 4: Reveal Spread & Interpretation -->
      @if (state() === 'REVEAL' || state() === 'INTERPRETATION') {
        <div class="w-full max-w-6xl animate-fade-in pb-10">
          
          <!-- Spread Layout Visualization -->
          <div class="flex flex-wrap justify-center gap-4 md:gap-8 mb-10 mt-6 bg-indigo-950/30 p-8 rounded-2xl border border-indigo-900">
            @for (selection of selectedCards(); track selection.position) {
              <div class="flex flex-col items-center gap-3 animate-slide-up relative" [style.animation-delay]="selection.position * 200 + 'ms'">
                <div class="text-xs text-yellow-500 font-serif uppercase tracking-widest mb-1 font-bold">{{ getPositionName(selection.position) }}</div>
                <app-card [card]="selection.card" 
                          [revealed]="true" 
                          [reversed]="selection.isReversed"
                          class="shadow-2xl">
                </app-card>
                <!-- Astro/Num Badge -->
                <div class="absolute -bottom-6 flex gap-2">
                   @if (selection.card.numerology !== undefined) {
                     <span class="text-[10px] bg-indigo-800 text-indigo-200 px-1 rounded border border-indigo-600" title="Numerologi">#{{ selection.card.numerology }}</span>
                   }
                   @if (selection.card.astrology) {
                     <span class="text-[10px] bg-purple-900 text-purple-200 px-1 rounded border border-purple-700 max-w-[80px] truncate" [title]="selection.card.astrology">✨ {{ selection.card.astrology }}</span>
                   }
                </div>
              </div>
            }
          </div>

          <!-- Interpretation Action -->
          @if (state() === 'REVEAL') {
             <div class="flex flex-col items-center mt-12 mb-10 gap-4">
               <p class="text-indigo-300 italic max-w-xl text-center">
                 "Perhatikan gambar-gambar ini. Apa yang pertama kali terlintas di benak Anda? Itulah pesan dari bawah sadar Anda."
               </p>
               <button (click)="generateInterpretation()" 
                       class="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 px-10 rounded-lg shadow-lg flex items-center gap-3 transition-all border border-indigo-400 hover:scale-105">
                 <span>✨</span> Analisis Konseling (AI)
               </button>
             </div>
          }

          <!-- AI Result -->
          @if (state() === 'INTERPRETATION') {
            <div class="flex flex-col lg:flex-row gap-6">
              
              <!-- Main Interpretation Column -->
              <div class="lg:w-2/3 bg-indigo-900/80 border border-yellow-600/30 rounded-lg p-6 md:p-10 shadow-2xl backdrop-blur-md mb-10 h-fit">
                <h3 class="text-2xl font-serif text-yellow-500 mb-6 border-b border-yellow-600/20 pb-4 flex items-center justify-between">
                  <span>Konseling Tarot</span>
                  <span class="text-xs bg-indigo-950 px-2 py-1 rounded text-indigo-300 border border-indigo-800">Powered by Gemini AI</span>
                </h3>
                
                @if (isLoading()) {
                  <div class="flex flex-col items-center py-10 gap-4">
                     <div class="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
                     <p class="text-indigo-200 animate-pulse text-lg font-serif">Menghubungkan simbol dengan arketipe...</p>
                  </div>
                } @else {
                  <!-- AI Text -->
                  <div class="prose prose-invert prose-yellow max-w-none text-indigo-100 leading-relaxed space-y-4 whitespace-pre-wrap mb-8 font-light text-lg">
                    {{ interpretationResult() }}
                  </div>
                  
                  <!-- Journal Form -->
                  <div class="bg-indigo-950/50 p-6 rounded-lg border border-indigo-800 mt-8">
                    <h4 class="text-yellow-500 font-bold mb-3 flex items-center gap-2">
                      <span>📝</span> Refleksi Pribadi & Jurnal
                    </h4>
                    <div class="mb-4">
                      <label class="block text-indigo-300 text-sm mb-2">Apa yang Anda rasakan tentang bacaan ini?</label>
                      <textarea [(ngModel)]="userNotes" 
                                class="w-full bg-indigo-900/50 border border-indigo-700 rounded p-3 text-indigo-100 focus:outline-none focus:border-yellow-600 placeholder-indigo-500/50 transition-colors"
                                rows="3"
                                placeholder="Tulis refleksi Anda..."></textarea>
                    </div>
                    
                    <div class="flex flex-col md:flex-row justify-between items-center gap-4">
                      <button (click)="saveToJournal()" 
                              [disabled]="isSaved()"
                              class="w-full md:w-auto px-6 py-2 rounded-lg font-bold transition-all flex items-center justify-center gap-2 shadow-md"
                              [ngClass]="isSaved() ? 'bg-green-700/50 text-green-200 cursor-not-allowed' : 'bg-yellow-600 hover:bg-yellow-500 text-indigo-950'">
                         <span>{{ isSaved() ? '✅ Tersimpan' : '💾 Simpan ke Jurnal' }}</span>
                      </button>

                      <button (click)="reset()" class="text-indigo-400 hover:text-white underline text-sm">
                        Mulai Sesi Baru
                      </button>
                    </div>
                  </div>
                }
              </div>

              <!-- Chat & Deep Dive Column -->
              <div class="lg:w-1/3 flex flex-col gap-4">
                 <div class="bg-indigo-950/80 border border-indigo-700 rounded-lg p-4 h-[600px] flex flex-col shadow-xl">
                    <div class="border-b border-indigo-800 pb-2 mb-2">
                       <h4 class="text-yellow-500 font-serif font-bold">Chat Konseling</h4>
                       <p class="text-[10px] text-indigo-400">Tanyakan lebih dalam tentang kartu tertentu.</p>
                    </div>

                    <!-- Chat History -->
                    <div class="flex-grow overflow-y-auto space-y-3 p-2 custom-scrollbar" #chatContainer>
                       @for (msg of chatHistory(); track $index) {
                         <div [class]="msg.sender === 'user' ? 'ml-auto bg-indigo-700/50 text-white' : 'mr-auto bg-gray-800/80 text-indigo-100'"
                              class="max-w-[85%] rounded-lg p-3 text-sm animate-fade-in break-words">
                            {{ msg.text }}
                         </div>
                       }
                       @if (isChatLoading()) {
                         <div class="mr-auto bg-gray-800/80 text-indigo-400 rounded-lg p-3 text-xs italic animate-pulse">
                           Sedang mengetik...
                         </div>
                       }
                    </div>

                    <!-- Input -->
                    <div class="mt-2 pt-2 border-t border-indigo-800 flex gap-2">
                       <input [(ngModel)]="currentChatMessage" 
                              (keyup.enter)="sendMessage()"
                              [disabled]="isLoading() || isChatLoading()"
                              type="text" 
                              placeholder="Tanya detail..." 
                              class="flex-grow bg-indigo-900 border border-indigo-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-yellow-500 disabled:opacity-50">
                       <button (click)="sendMessage()" 
                               [disabled]="!currentChatMessage.trim() || isLoading() || isChatLoading()"
                               class="bg-yellow-600 hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed text-indigo-950 p-2 rounded transition-colors">
                         ➤
                       </button>
                    </div>
                 </div>
              </div>

            </div>
          }

        </div>
      }

    </div>
  `,
  styles: [`
    .animate-fade-in { animation: fadeIn 0.5s ease-out; }
    .animate-slide-up { animation: slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) backwards; }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes slideUp { from { opacity: 0; transform: translateY(50px); } to { opacity: 1; transform: translateY(0); } }
    .custom-scrollbar::-webkit-scrollbar { width: 4px; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: #4f46e5; border-radius: 2px; }
  `]
})
export class ReadingComponent implements AfterViewChecked {
  @ViewChild('chatContainer') private chatContainer!: ElementRef;

  tarotService = inject(TarotService);
  journalService = inject(JournalService);
  audioService = inject(AudioService);
  router = inject(Router);

  // Data
  spreads = this.tarotService.getSpreads();
  fullDeck = this.tarotService.getDeck();
  
  // State Signals
  state = signal<ReadingState>('INPUT_CONTEXT');
  selectedSpread = signal<TarotSpread | null>(null);
  significator = signal<TarotCard | null>(null);
  shuffledDeck = signal<TarotCard[]>([]);
  selectedCards = signal<{position: number, card: TarotCard, isReversed: boolean}[]>([]);
  interpretationResult = signal<string>('');
  isLoading = signal<boolean>(false);
  
  // New Features State
  userContext = signal<string>('');
  sigFilter = signal<'Major' | 'Court'>('Major');
  chatHistory = signal<ChatMessage[]>([]);
  currentChatMessage = '';
  isChatLoading = signal<boolean>(false);
  
  // Journal State
  userNotes = signal<string>('');
  isSaved = signal<boolean>(false);

  constructor() {
    this.audioService.startAmbient();
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      if(this.chatContainer) {
        this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
      }
    } catch(err) { }
  }

  currentStateTitle = computed(() => {
    switch(this.state()) {
      case 'INPUT_CONTEXT': return 'Tetapkan Intensi';
      case 'SELECT_SPREAD': return 'Pilih Metode Tebaran';
      case 'SELECT_SIGNIFICATOR': return 'Pilih Significator';
      case 'SHUFFLE': return 'Penyelarasan Energi';
      case 'PICK_CARDS': return 'Pemilihan Kartu';
      case 'REVEAL': return 'Visualisasi Simbol';
      case 'INTERPRETATION': return 'Wacana Konseling';
      default: return '';
    }
  });

  filteredSignificators = computed(() => {
    if (this.sigFilter() === 'Major') {
      return this.fullDeck.filter(c => c.arcana === 'Major');
    } else {
      // Court cards are Page, Knight, Queen, King (usually IDs end of each suit block)
      return this.fullDeck.filter(c => 
        c.arcana === 'Minor' && 
        (c.name.includes('Page') || c.name.includes('Knight') || c.name.includes('Queen') || c.name.includes('King'))
      );
    }
  });

  submitContext() {
    if (!this.userContext().trim()) return;
    this.state.set('SELECT_SPREAD');
  }

  skipContext() {
    this.userContext.set('');
    this.state.set('SELECT_SPREAD');
  }

  selectSpread(spread: TarotSpread) {
    this.selectedSpread.set(spread);
    this.state.set('SELECT_SIGNIFICATOR');
  }

  chooseSignificator(card: TarotCard) {
    this.significator.set(card);
    this.audioService.playFlip();
    this.state.set('SHUFFLE');
  }

  finishShuffle() {
    this.audioService.playShuffle();
    this.shuffledDeck.set(this.tarotService.shuffleDeck());
    this.state.set('PICK_CARDS');
  }

  pickCard(card: TarotCard) {
    const currentSpread = this.selectedSpread();
    if (!currentSpread) return;

    const currentCount = this.selectedCards().length;
    const totalPositions = currentSpread.positions.length;

    if (currentCount < totalPositions) {
      this.audioService.playFlip();
      
      // 25% chance of reversal
      const isReversed = Math.random() < 0.25;
      
      this.selectedCards.update(cards => [
        ...cards, 
        { position: currentCount + 1, card, isReversed }
      ]);

      if (this.selectedCards().length === totalPositions) {
        setTimeout(() => this.state.set('REVEAL'), 800);
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
      const result = await this.tarotService.interpretReading(
        spread, 
        cards, 
        this.significator() || undefined,
        this.userContext()
      );
      this.interpretationResult.set(result);
      // Init chat with welcome message logic implied
    } finally {
      this.isLoading.set(false);
    }
  }

  async sendMessage() {
    const text = this.currentChatMessage.trim();
    if (!text) return;

    this.chatHistory.update(h => [...h, { sender: 'user', text }]);
    this.currentChatMessage = '';
    this.isChatLoading.set(true);

    try {
      const reply = await this.tarotService.chatWithAI(text);
      this.chatHistory.update(h => [...h, { sender: 'ai', text: reply }]);
    } finally {
      this.isChatLoading.set(false);
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
      userNotes: this.userNotes(),
      context: this.userContext() // Save context
    });

    this.isSaved.set(true);
  }

  reset() {
    this.selectedCards.set([]);
    this.interpretationResult.set('');
    this.userNotes.set('');
    this.userContext.set('');
    this.chatHistory.set([]);
    this.significator.set(null);
    this.isSaved.set(false);
    this.state.set('INPUT_CONTEXT');
  }
}
