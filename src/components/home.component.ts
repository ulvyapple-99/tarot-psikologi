
import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TarotService } from '../services/tarot.service';
import { JournalService } from '../services/journal.service';
import { AudioService } from '../services/audio.service';
import { CardComponent } from './card.component';
import { TarotCard } from '../services/tarot.data';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CommonModule, CardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-full flex flex-col items-center justify-center text-center px-4 py-12 pb-32">
      
      <div class="max-w-4xl space-y-12 animate-fade-in-up w-full">
        
        <!-- Hero Section -->
        <div class="space-y-6">
           <div class="inline-block p-4 rounded-full border-2 border-yellow-600/50 bg-indigo-900/50 shadow-[0_0_30px_rgba(234,179,8,0.2)] hover:scale-110 transition-transform cursor-pointer" (click)="toggleAudio()">
            <span class="text-4xl">{{ audioService.isAudioMuted() ? '🔇' : '🔮' }}</span>
          </div>

          <h1 class="text-4xl md:text-6xl font-serif text-yellow-500 leading-tight drop-shadow-lg">
            Menemukan Jati Diri Melalui <br> <span class="text-white">Seni Wacana Tarot</span>
          </h1>

          <p class="text-base text-indigo-200 leading-relaxed font-light max-w-2xl mx-auto">
            "Tarot bukanlah alat untuk meramal masa depan yang pasti terjadi. 
            Ia adalah cermin bagi jiwa, alat bantu konseling untuk memahami potensi bawah sadar, 
            arketipe, dan sinkronisitas dalam hidup Anda."
          </p>
          
          <div class="text-sm text-indigo-400 italic">
            — Berdasarkan filosofi Hisyam A. Fachri
          </div>
        </div>

        <!-- Call to Action Main -->
        <div class="flex flex-col md:flex-row gap-4 justify-center">
          <a routerLink="/reading" class="group relative px-8 py-4 bg-yellow-600 text-indigo-950 font-bold text-lg rounded-lg shadow-lg overflow-hidden transition-all hover:scale-105">
            <div class="absolute inset-0 bg-yellow-400 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            <span class="relative z-10 flex items-center gap-2">
              Mulai Konseling Mandiri
              <span class="group-hover:translate-x-1 transition-transform">→</span>
            </span>
          </a>
          
          <a routerLink="/library" class="px-8 py-4 border border-indigo-500 text-indigo-300 hover:text-white hover:border-white rounded-lg transition-all hover:bg-indigo-900/50">
            Pustaka Kartu
          </a>
        </div>

        <!-- Daily Card Feature -->
        <div class="mt-16 border-t border-indigo-800/50 pt-12">
          <h2 class="text-2xl font-serif text-yellow-500 mb-6">Kartu Harian Anda</h2>
          
          @if (!dailyCard()) {
            <div class="flex flex-col items-center gap-4">
              <p class="text-indigo-300 text-sm">Tarik satu kartu untuk panduan refleksi hari ini.</p>
              <button (click)="drawDailyCard()" class="px-6 py-2 bg-indigo-800 hover:bg-indigo-700 text-white rounded-full transition-colors flex items-center gap-2 shadow-lg">
                <span>🎴</span> Ambil Kartu Harian
              </button>
            </div>
          } @else {
            <div class="bg-indigo-900/40 p-6 rounded-xl border border-indigo-700 flex flex-col md:flex-row items-center gap-6 animate-fade-in text-left max-w-2xl mx-auto">
               <div class="flex-shrink-0">
                 <app-card [card]="dailyCard()" [revealed]="true"></app-card>
               </div>
               <div>
                 <h3 class="text-xl font-bold text-yellow-100">{{ dailyCard()?.nameIndo }}</h3>
                 <p class="text-indigo-300 text-sm italic mb-2">{{ dailyCard()?.keywords?.join(', ') }}</p>
                 <p class="text-indigo-200 text-sm leading-relaxed">{{ dailyCard()?.description }}</p>
                 <div class="mt-4 text-xs text-green-400 flex items-center gap-1">
                   <span>✅</span> Tersimpan otomatis di Jurnal
                 </div>
               </div>
            </div>
          }
        </div>

        <!-- Features Grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 text-left">
          <div class="bg-indigo-900/40 p-6 rounded border border-indigo-800 hover:border-yellow-600/30 transition-colors">
            <h3 class="text-yellow-500 font-bold mb-2">Psikologi Jungian</h3>
            <p class="text-indigo-300 text-sm">Menggunakan konsep Arketipe dan Bawah Sadar Kolektif Carl G. Jung untuk analisis kepribadian.</p>
          </div>
          <div class="bg-indigo-900/40 p-6 rounded border border-indigo-800 hover:border-yellow-600/30 transition-colors">
            <h3 class="text-yellow-500 font-bold mb-2">Bukan Klenik</h3>
            <p class="text-indigo-300 text-sm">Pendekatan logis dan ilmiah. Kartu adalah media visual untuk memproyeksikan masalah internal.</p>
          </div>
          <div class="bg-indigo-900/40 p-6 rounded border border-indigo-800 hover:border-yellow-600/30 transition-colors">
            <h3 class="text-yellow-500 font-bold mb-2">Konseling Diri</h3>
            <p class="text-indigo-300 text-sm">Membantu Anda mengambil keputusan, mengenali hambatan mental, dan menemukan solusi.</p>
          </div>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .animate-fade-in-up { animation: fadeInUp 0.8s ease-out; }
    .animate-fade-in { animation: fadeIn 0.5s ease-out; }
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(30px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  `]
})
export class HomeComponent {
  tarotService = inject(TarotService);
  journalService = inject(JournalService);
  audioService = inject(AudioService);
  
  dailyCard = signal<TarotCard | null>(null);

  toggleAudio() {
    this.audioService.toggleMute();
  }

  drawDailyCard() {
    this.audioService.playFlip();
    const card = this.tarotService.getRandomCard();
    this.dailyCard.set(card);
    
    // Auto save to journal
    this.journalService.addEntry({
      spreadName: 'Kartu Harian',
      cards: [{
        positionName: 'Energi Hari Ini',
        cardName: card.nameIndo,
        isReversed: false,
        suit: card.suit,
        arcana: card.arcana
      }],
      aiInterpretation: `Pesan Harian: ${card.description}`,
      userNotes: ''
    });
  }
}
