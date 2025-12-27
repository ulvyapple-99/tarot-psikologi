
import { Component, Input, ChangeDetectionStrategy, booleanAttribute, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TarotCard } from '../services/tarot.data';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="relative w-24 h-40 md:w-32 md:h-52 cursor-pointer perspective-1000 group">
      <div class="w-full h-full transition-transform duration-700 transform-style-3d relative shadow-xl rounded-lg"
           [class.rotate-y-180]="revealed">
        
        <!-- Back of Card -->
        <div class="absolute inset-0 backface-hidden w-full h-full rounded-lg border border-yellow-800 bg-indigo-950 overflow-hidden shadow-inner">
          <!-- Standard RWS Back Pattern Style -->
          <div class="w-full h-full bg-[repeating-linear-gradient(45deg,#1e1b4b,#1e1b4b_10px,#312e81_10px,#312e81_20px)] opacity-80"></div>
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="w-12 h-12 md:w-16 md:h-16 border-2 border-yellow-600/50 rounded-full flex items-center justify-center bg-indigo-900/80 backdrop-blur-sm">
               <span class="text-xl md:text-2xl text-yellow-500">⚜️</span>
            </div>
          </div>
        </div>

        <!-- Front of Card (Real RWS Image) -->
        <div class="absolute inset-0 backface-hidden w-full h-full rounded-lg bg-white rotate-y-180 overflow-hidden border-2 border-slate-300 shadow-md flex items-center justify-center">
           
           @if (card) {
             @if (!hasError()) {
               <img [src]="getRealCardImage()" 
                    alt="{{ card!.name }}"
                    class="w-full h-full object-cover"
                    [class.rotate-180]="reversed"
                    loading="lazy"
                    (error)="handleImageError()">
             } @else {
               <!-- Fallback if image fails to load -->
               <div class="p-2 text-center flex flex-col items-center justify-center h-full w-full bg-slate-100 text-slate-800" [class.rotate-180]="reversed">
                 <span class="text-xs font-bold font-serif mb-1">{{ card!.name }}</span>
                 <span class="text-[10px] italic">{{ card!.nameIndo }}</span>
                 <span class="mt-2 text-2xl">
                   @switch(card!.suit) {
                     @case ('Tongkat') { 🪵 }
                     @case ('Piala') { 🏆 }
                     @case ('Pedang') { ⚔️ }
                     @case ('Koin') { 🪙 }
                     @default { 🎭 }
                   }
                 </span>
               </div>
             }
             
             <!-- Overlay for Reversed Text -->
             @if (reversed) {
               <div class="absolute bottom-2 left-0 right-0 text-center pointer-events-none rotate-180">
                 <span class="text-[10px] bg-black/60 text-white px-2 py-0.5 rounded-full backdrop-blur-sm">Terbalik</span>
               </div>
             }
           }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .perspective-1000 { perspective: 1000px; }
    .transform-style-3d { transform-style: preserve-3d; }
    .backface-hidden { backface-visibility: hidden; }
    .rotate-y-180 { transform: rotateY(180deg); }
  `]
})
export class CardComponent {
  private _card: TarotCard | null = null;

  @Input() 
  set card(value: TarotCard | null) {
    this._card = value;
    // Reset error state when card changes. This avoids setting signal during view render (NG0600).
    this.hasError.set(false);
  }

  get card(): TarotCard | null {
    return this._card;
  }

  @Input({ transform: booleanAttribute }) revealed = false;
  @Input({ transform: booleanAttribute }) reversed = false;
  
  hasError = signal<boolean>(false);

  getRealCardImage(): string {
    if (!this.card) return '';
    return `https://raw.githubusercontent.com/imogenoconnor/tarot-json/master/images/${this.card.shortCode}.jpg`;
  }

  handleImageError() {
    this.hasError.set(true);
  }
}
