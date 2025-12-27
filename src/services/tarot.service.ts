
import { Injectable, signal } from '@angular/core';
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { TarotCard, TarotSpread, MAJOR_ARCANA, SPREADS } from './tarot.data';

@Injectable({
  providedIn: 'root'
})
export class TarotService {
  private apiKey = process.env['API_KEY']; 
  private ai: GoogleGenAI | null = null;
  
  // State
  private _deck = signal<TarotCard[]>([]);
  
  constructor() {
    if (this.apiKey) {
      this.ai = new GoogleGenAI({ apiKey: this.apiKey });
    } else {
      console.warn("API KEY not found. AI features will be disabled.");
    }
    this.initializeDeck();
  }

  private initializeDeck() {
    // Start with Major Arcana
    let fullDeck = [...MAJOR_ARCANA];
    
    // Generate Minor Arcana (Simplified generation for brevity, ideally would have full descriptions like Major)
    const suits: Array<'Tongkat' | 'Piala' | 'Pedang' | 'Koin'> = ['Tongkat', 'Piala', 'Pedang', 'Koin'];
    let idCounter = 22;

    suits.forEach(suit => {
      for (let i = 1; i <= 14; i++) {
        let name = `${i} of ${suit}`;
        let indoName = `${i} ${suit}`;
        let keywords = [''];
        let desc = `Energi dari elemen ${suit} pada tingkat ${i}.`;

        if (i === 1) { name = `Ace of ${suit}`; indoName = `As ${suit}`; keywords = ['Awal', 'Potensi Murni']; }
        else if (i === 11) { name = `Page of ${suit}`; indoName = `Pembantu ${suit}`; keywords = ['Pesan', 'Belajar']; }
        else if (i === 12) { name = `Knight of ${suit}`; indoName = `Perwira ${suit}`; keywords = ['Tindakan', 'Pergerakan']; }
        else if (i === 13) { name = `Queen of ${suit}`; indoName = `Ratu ${suit}`; keywords = ['Pemeliharaan', 'Internal']; }
        else if (i === 14) { name = `King of ${suit}`; indoName = `Raja ${suit}`; keywords = ['Otoritas', 'Eksternal']; }
        else { keywords = ['Proses', 'Perkembangan']; }

        // Element definitions based on PDF
        if (suit === 'Tongkat') desc += " (Intuisi/Api)";
        if (suit === 'Piala') desc += " (Perasaan/Air)";
        if (suit === 'Pedang') desc += " (Pikiran/Udara)";
        if (suit === 'Koin') desc += " (Pengindraan/Bumi)";

        fullDeck.push({
          id: idCounter++,
          name: name,
          nameIndo: indoName,
          arcana: 'Minor',
          suit: suit,
          number: i,
          keywords: keywords,
          description: desc
        });
      }
    });

    this._deck.set(fullDeck);
  }

  getSpreads(): TarotSpread[] {
    return SPREADS;
  }

  shuffleDeck(): TarotCard[] {
    const deck = [...this._deck()];
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
  }

  async interpretReading(spread: TarotSpread, cards: {position: number, card: TarotCard, isReversed: boolean}[]): Promise<string> {
    if (!this.ai) return "Maaf, kunci API AI tidak ditemukan. Interpretasi otomatis tidak tersedia.";

    const cardDescriptions = cards.map(c => 
      `Posisi ${c.position} (${spread.positions.find(p => p.id === c.position)?.name}): ${c.card.nameIndo} (${c.isReversed ? 'Terbalik' : 'Tegak'}). Arti dasar: ${c.card.description}.`
    ).join('\n');

    const prompt = `
      Bertindaklah sebagai Konselor Tarot Psikologi ahli (seperti gaya Hisyam A. Fachri dalam buku "Tarot Psikologi").
      Lakukan pembacaan untuk tebaran: "${spread.name}".
      
      Konteks Psikologi Jungian:
      - Gunakan konsep Sinkronisitas (kebetulan yang bermakna).
      - Fokus pada Arketipe dan proyeksi bawah sadar.
      - Jangan meramal nasib pasti, tapi bacalah potensi, hambatan mental, dan saran pengembangan diri.
      - Gunakan bahasa Indonesia yang empatik, menenangkan, namun analitis.
      
      Kartu-kartu yang terpilih:
      ${cardDescriptions}
      
      Berikan interpretasi mendalam yang menghubungkan antar kartu menjadi satu narasi psikologis utuh. Akhiri dengan "Saran Konseling" yang konkret.
    `;

    try {
      const response: GenerateContentResponse = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
        }
      });
      return response.text;
    } catch (error) {
      console.error("AI Error:", error);
      return "Maaf, terjadi kesalahan saat menghubungkan ke alam bawah sadar digital (AI Error). Silakan coba lagi.";
    }
  }
}
