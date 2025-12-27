
import { Component, inject, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { JournalService, JournalEntry } from '../services/journal.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-journal',
  standalone: true,
  imports: [CommonModule, DatePipe, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-full container mx-auto px-4 py-8 pb-32 max-w-4xl">
      <div class="mb-8 border-b border-yellow-600/30 pb-4 flex justify-between items-end">
        <div>
          <h2 class="text-3xl font-serif text-yellow-500 mb-2">Jurnal Jiwa</h2>
          <p class="text-indigo-300">Catatan perjalanan dan refleksi diri Anda.</p>
        </div>
        <div class="text-right">
          <span class="text-2xl font-bold text-white">{{ journalService.entries().length }}</span>
          <span class="text-xs text-indigo-400 block uppercase tracking-wider">Entri</span>
        </div>
      </div>

      @if (journalService.entries().length === 0) {
        <div class="text-center py-20 bg-indigo-900/30 rounded-xl border border-indigo-800 border-dashed">
          <div class="text-6xl mb-4 opacity-50">📖</div>
          <h3 class="text-xl text-indigo-200 mb-2">Jurnal Masih Kosong</h3>
          <p class="text-indigo-400 mb-6">Belum ada pembacaan yang tersimpan. Lakukan konseling pertama Anda.</p>
          <a routerLink="/reading" class="inline-block px-6 py-2 bg-yellow-600 text-indigo-950 font-bold rounded hover:bg-yellow-500 transition-colors">
            Mulai Pembacaan
          </a>
        </div>
      } @else {
        <div class="space-y-6">
          @for (entry of journalService.entries(); track entry.id) {
            <div class="bg-indigo-900/60 border border-indigo-700 rounded-lg overflow-hidden shadow-lg transition-all hover:border-yellow-600/50">
              
              <!-- Header Row -->
              <div (click)="toggleExpand(entry.id)" class="p-4 flex flex-col md:flex-row justify-between items-start md:items-center cursor-pointer bg-indigo-900/80 hover:bg-indigo-800 transition-colors">
                <div class="flex items-center gap-4 mb-2 md:mb-0">
                  <div class="w-12 h-12 rounded bg-indigo-950 flex flex-col items-center justify-center border border-indigo-700 text-yellow-500 font-serif">
                    <span class="text-lg font-bold">{{ entry.timestamp | date:'dd' }}</span>
                    <span class="text-[10px] uppercase">{{ entry.timestamp | date:'MMM' }}</span>
                  </div>
                  <div>
                    <h3 class="text-lg font-bold text-yellow-100">{{ entry.spreadName }}</h3>
                    <p class="text-xs text-indigo-400">{{ entry.timestamp | date:'shortTime' }} • {{ entry.cards.length }} Kartu</p>
                  </div>
                </div>
                
                <div class="flex items-center gap-3">
                  <span class="text-xs px-2 py-1 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
                    {{ isExpanded(entry.id) ? 'Tutup' : 'Lihat Detail' }}
                  </span>
                  <button (click)="deleteEntry($event, entry.id)" class="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded transition-colors" title="Hapus Entri">
                    🗑️
                  </button>
                </div>
              </div>

              <!-- Expanded Content -->
              @if (isExpanded(entry.id)) {
                <div class="p-6 border-t border-indigo-800 bg-indigo-900/40 animate-slide-down">
                  
                  <!-- Cards Summary -->
                  <div class="mb-6">
                    <h4 class="text-sm font-bold text-yellow-600 uppercase tracking-widest mb-3">Kartu Terpilih</h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                      @for (card of entry.cards; track $index) {
                        <div class="flex items-center gap-2 p-2 rounded bg-indigo-950/50 border border-indigo-800/50">
                          <span class="text-yellow-500 text-xs font-bold w-6">{{ $index + 1 }}.</span>
                          <div>
                            <div class="text-indigo-200 text-sm font-bold">
                              {{ card.cardName }} 
                              <span *ngIf="card.isReversed" class="text-red-400 text-xs italic">(Terbalik)</span>
                            </div>
                            <div class="text-indigo-500 text-[10px] uppercase">{{ card.positionName }}</div>
                          </div>
                        </div>
                      }
                    </div>
                  </div>

                  <!-- User Notes -->
                  @if (entry.userNotes) {
                    <div class="mb-6 bg-yellow-900/10 p-4 rounded border-l-4 border-yellow-600">
                      <h4 class="text-sm font-bold text-yellow-500 mb-2">Catatan Refleksi Saya</h4>
                      <p class="text-indigo-100 text-sm whitespace-pre-wrap font-serif italic">"{{ entry.userNotes }}"</p>
                    </div>
                  }

                  <!-- AI Interpretation -->
                  @if (entry.aiInterpretation) {
                    <div>
                      <h4 class="text-sm font-bold text-indigo-400 uppercase tracking-widest mb-2">Analisis Konseling</h4>
                      <div class="prose prose-invert prose-sm max-w-none text-indigo-200/80 leading-relaxed">
                        {{ entry.aiInterpretation }}
                      </div>
                    </div>
                  }
                </div>
              }

            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .animate-slide-down { animation: slideDown 0.3s ease-out; }
    @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class JournalComponent {
  journalService = inject(JournalService);
  expandedEntries = signal<Set<string>>(new Set());

  toggleExpand(id: string) {
    this.expandedEntries.update(set => {
      const newSet = new Set(set);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }

  isExpanded(id: string): boolean {
    return this.expandedEntries().has(id);
  }

  deleteEntry(event: Event, id: string) {
    event.stopPropagation();
    if (confirm('Apakah Anda yakin ingin menghapus catatan jurnal ini?')) {
      this.journalService.deleteEntry(id);
    }
  }
}
