
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-full flex flex-col items-center justify-center text-center px-4 py-12">
      
      <div class="max-w-3xl space-y-8 animate-fade-in-up">
        <div class="inline-block p-4 rounded-full border-2 border-yellow-600/50 bg-indigo-900/50 mb-4 shadow-[0_0_30px_rgba(234,179,8,0.2)]">
          <span class="text-4xl">🔮</span>
        </div>

        <h1 class="text-4xl md:text-6xl font-serif text-yellow-500 leading-tight">
          Menemukan Jati Diri Melalui <br> <span class="text-white">Seni Wacana Tarot</span>
        </h1>

        <p class="text-base text-indigo-200 leading-relaxed font-light">
          "Tarot bukanlah alat untuk meramal masa depan yang pasti terjadi. 
          Ia adalah cermin bagi jiwa, alat bantu konseling untuk memahami potensi bawah sadar, 
          arketipe, dan sinkronisitas dalam hidup Anda."
        </p>
        
        <div class="text-sm text-indigo-400 italic">
          — Berdasarkan filosofi Hisyam A. Fachri
        </div>

        <div class="flex flex-col md:flex-row gap-4 justify-center mt-10">
          <a routerLink="/reading" class="group relative px-8 py-4 bg-yellow-600 text-indigo-950 font-bold text-lg rounded-lg shadow-lg overflow-hidden transition-all hover:scale-105">
            <div class="absolute inset-0 bg-yellow-400 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            <span class="relative z-10 flex items-center gap-2">
              Mulai Konseling Mandiri
              <span class="group-hover:translate-x-1 transition-transform">→</span>
            </span>
          </a>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 text-left">
          <div class="bg-indigo-900/40 p-6 rounded border border-indigo-800">
            <h3 class="text-yellow-500 font-bold mb-2">Psikologi Jungian</h3>
            <p class="text-indigo-300 text-sm">Menggunakan konsep Arketipe dan Bawah Sadar Kolektif Carl G. Jung untuk analisis kepribadian.</p>
          </div>
          <div class="bg-indigo-900/40 p-6 rounded border border-indigo-800">
            <h3 class="text-yellow-500 font-bold mb-2">Bukan Klenik</h3>
            <p class="text-indigo-300 text-sm">Pendekatan logis dan ilmiah. Kartu adalah media visual untuk memproyeksikan masalah internal.</p>
          </div>
          <div class="bg-indigo-900/40 p-6 rounded border border-indigo-800">
            <h3 class="text-yellow-500 font-bold mb-2">Konseling Diri</h3>
            <p class="text-indigo-300 text-sm">Membantu Anda mengambil keputusan, mengenali hambatan mental, dan menemukan solusi.</p>
          </div>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .animate-fade-in-up { animation: fadeInUp 0.8s ease-out; }
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(30px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class HomeComponent {}
