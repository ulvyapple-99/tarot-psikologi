
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  host: {
    class: 'flex flex-col h-full w-full overflow-hidden'
  },
  template: `
    <header class="flex-none bg-indigo-950 border-b border-yellow-600/30 p-4 shadow-lg z-20 relative">
      <div class="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <a routerLink="/" class="flex items-center gap-3 group cursor-pointer text-decoration-none">
          <div class="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-700 flex items-center justify-center text-indigo-900 font-bold text-xl shadow-lg group-hover:scale-105 transition-transform">
            T
          </div>
          <div>
            <h1 class="text-xl md:text-2xl font-bold text-yellow-500 tracking-wider group-hover:text-yellow-400 transition-colors">TAROT PSIKOLOGI</h1>
            <p class="text-xs text-indigo-300 hidden md:block">Past, Future & Life - Hisyam A. Fachri</p>
          </div>
        </a>
        
        <nav class="flex items-center gap-2 flex-wrap justify-center">
          <a routerLink="/" routerLinkActive="text-white font-bold" [routerLinkActiveOptions]="{exact: true}" class="text-indigo-300 hover:text-white px-3 py-2 transition-colors text-sm">Beranda</a>
          <a routerLink="/library" routerLinkActive="text-white font-bold" class="text-indigo-300 hover:text-white px-3 py-2 transition-colors text-sm">Pustaka</a>
          <a routerLink="/journal" routerLinkActive="text-white font-bold" class="text-indigo-300 hover:text-white px-3 py-2 transition-colors text-sm">Jurnal</a>
          <a routerLink="/reading" routerLinkActive="bg-yellow-600/40 text-yellow-100" class="ml-2 px-4 py-2 bg-yellow-600/20 border border-yellow-600/50 rounded hover:bg-yellow-600/40 text-yellow-200 transition-all text-sm">Mulai Konseling</a>
        </nav>
      </div>
    </header>

    <main class="flex-grow overflow-y-auto relative scroll-smooth w-full z-10">
      <div class="fixed inset-0 bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')] opacity-20 pointer-events-none"></div>
      <div class="relative min-h-full">
        <router-outlet></router-outlet>
      </div>
    </main>

    <footer class="flex-none bg-indigo-950 text-indigo-400 text-center p-3 text-xs border-t border-indigo-900 z-20 relative shadow-[0_-5px_15px_rgba(0,0,0,0.3)]">
      <p>Berdasarkan teori "Tarot Psikologi" & "The Real Art of Tarot". Pendekatan Jungian & Konseling.</p>
    </footer>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {}
