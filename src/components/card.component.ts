
import { Component, Input, ChangeDetectionStrategy, booleanAttribute } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TarotCard } from '../services/tarot.data';

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
        <div class="absolute inset-0 backface-hidden w-full h-full rounded-lg border-2 border-yellow-600 bg-indigo-900 overflow-hidden">
          <div class="w-full h-full opacity-40 bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')]"></div>
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="w-16 h-16 border-2 border-yellow-500 rounded-full flex items-center justify-center opacity-50">
               <span class="text-2xl text-yellow-500">⚜️</span>
            </div>
          </div>
        </div>

        <!-- Front of Card -->
        <div class="absolute inset-0 backface-hidden w-full h-full rounded-lg bg-slate-100 rotate-y-180 overflow-hidden border-4 border-double"
             [ngClass]="getBorderClass()">
             
          <!-- Image Placeholder / Art -->
          <div class="h-2/3 w-full bg-cover bg-center relative" 
               [ngStyle]="{'background-image': getCardImage()}"
               [class.rotate-180]="reversed">
             <div class="absolute inset-0 bg-gradient-to-t from-slate-100 to-transparent opacity-20"></div>
             
             <!-- Suit Icon Overlay -->
             <div class="absolute top-2 right-2 text-2xl drop-shadow-md">
                {{ getSuitIcon() }}
             </div>
          </div>

          <!-- Text Content -->
          <div class="h-1/3 flex flex-col items-center justify-center p-1 text-center bg-slate-100">
             <h3 class="text-xs md:text-sm font-bold text-slate-800 font-serif uppercase tracking-tight leading-3 md:leading-tight line-clamp-2">
                {{ card?.nameIndo }}
             </h3>
             <p class="text-[9px] md:text-[10px] text-slate-500 italic mt-0.5 md:mt-1" *ngIf="reversed">(Terbalik)</p>
          </div>
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
  @Input() card: TarotCard | null = null;
  @Input({ transform: booleanAttribute }) revealed = false;
  @Input({ transform: booleanAttribute }) reversed = false;

  getBorderClass(): string {
    if (!this.card) return 'border-gray-400';
    if (this.card.arcana === 'Major') return 'border-purple-800';
    switch (this.card.suit) {
      case 'Tongkat': return 'border-red-600'; // Fire
      case 'Piala': return 'border-blue-500'; // Water
      case 'Pedang': return 'border-yellow-600'; // Air
      case 'Koin': return 'border-green-700'; // Earth
      default: return 'border-gray-600';
    }
  }

  getSuitIcon(): string {
    if (!this.card) return '';
    if (this.card.arcana === 'Major') return 'Major'; // Roman numeral could go here
    switch (this.card.suit) {
      case 'Tongkat': return '🔥';
      case 'Piala': return '🏆';
      case 'Pedang': return '⚔️';
      case 'Koin': return '🪙';
      default: return '';
    }
  }

  getCardImage(): string {
    // Using picsum with a specific seed to keep it consistent but random-looking for prototype
    // Ideally, this would map to actual asset URLs
    if (!this.card) return '';
    return `url('https://picsum.photos/seed/${this.card.id + 100}/200/300')`; 
  }
}
