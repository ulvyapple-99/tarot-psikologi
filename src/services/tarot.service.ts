
import { Injectable, signal } from '@angular/core';
import { GoogleGenAI, GenerateContentResponse, Chat } from "@google/genai";
import { TarotCard, TarotSpread, MAJOR_ARCANA_BASE, SPREADS } from './tarot.data';

@Injectable({
  providedIn: 'root'
})
export class TarotService {
  private apiKey = process.env['API_KEY']; 
  private ai: GoogleGenAI | null = null;
  private chatSession: Chat | null = null;
  
  // State
  private _deck = signal<TarotCard[]>([]);
  
  constructor() {
    if (this.apiKey) {
      this.ai = new GoogleGenAI({ apiKey: this.apiKey });
    }
    this.initializeDeck();
  }

  private initializeDeck() {
    let fullDeck: TarotCard[] = [];

    // Initialize Major Arcana
    MAJOR_ARCANA_BASE.forEach(base => {
      fullDeck.push({
        id: base.id,
        shortCode: base.code,
        name: base.name,
        nameIndo: base.nameIndo,
        arcana: 'Major',
        number: base.id,
        keywords: base.keywords,
        description: base.desc,
        astrology: base.astro,
        numerology: base.num,
        element: this.inferElementFromAstro(base.astro)
      });
    });
    
    // Initialize Minor Arcana with RWS Code Mapping
    const suits = [
      { type: 'Tongkat', code: 'w', element: 'Api', astroBase: ['Aries', 'Leo', 'Sagitarius'] },
      { type: 'Piala', code: 'c', element: 'Air', astroBase: ['Cancer', 'Scorpio', 'Pisces'] },
      { type: 'Pedang', code: 's', element: 'Udara', astroBase: ['Gemini', 'Libra', 'Aquarius'] },
      { type: 'Koin', code: 'p', element: 'Bumi', astroBase: ['Taurus', 'Virgo', 'Capricorn'] }
    ] as const;

    let idCounter = 22;

    suits.forEach(suitData => {
      for (let i = 1; i <= 14; i++) {
        // Create ShortCode
        const numStr = i.toString().padStart(2, '0');
        const shortCode = `${suitData.code}${numStr}`;

        let name = '';
        let indoName = '';
        let keywords: string[] = [];
        let desc = '';
        // Explicitly type astro as string because we modify it with template literals later
        let astro: string = suitData.element; 

        // Naming Logic
        if (i === 1) { name = `Ace of ${suitData.type}`; indoName = `As ${suitData.type}`; keywords = ['Potensi Murni', 'Awal Baru', 'Inspirasi']; }
        else if (i === 11) { name = `Page of ${suitData.type}`; indoName = `Pembantu ${suitData.type}`; keywords = ['Pesan', 'Antusiasme', 'Belajar']; astro = `Muda (${suitData.element})`; }
        else if (i === 12) { name = `Knight of ${suitData.type}`; indoName = `Perwira ${suitData.type}`; keywords = ['Tindakan', 'Pergerakan', 'Misi']; astro = `Aktif (${suitData.element})`;}
        else if (i === 13) { name = `Queen of ${suitData.type}`; indoName = `Ratu ${suitData.type}`; keywords = ['Pemeliharaan', 'Kematangan', 'Intuisi']; astro = `Kardinal Air dari ${suitData.element}`;}
        else if (i === 14) { name = `King of ${suitData.type}`; indoName = `Raja ${suitData.type}`; keywords = ['Otoritas', 'Kendali', 'Puncak']; astro = `Kardinal Api dari ${suitData.element}`;}
        else { 
            name = `${i} of ${suitData.type}`; 
            indoName = `${i} ${suitData.type}`;
            // Simple keyword logic for numbers
            if(i===2) keywords = ['Keseimbangan', 'Pilihan'];
            if(i===3) keywords = ['Kolaborasi', 'Pertumbuhan'];
            if(i===4) keywords = ['Stabilitas', 'Pondasi'];
            if(i===5) keywords = ['Konflik', 'Perubahan'];
            if(i===6) keywords = ['Harmoni', 'Bantuan'];
            if(i===7) keywords = ['Refleksi', 'Strategi'];
            if(i===8) keywords = ['Pergerakan', 'Kekuatan'];
            if(i===9) keywords = ['Puncak', 'Ketahanan'];
            if(i===10) keywords = ['Penyelesaian', 'Siklus'];
            
            // Basic astrological Decan attribution (Simplified)
            // This is a placeholder for complex Golden Dawn attributions
            astro = `${suitData.element} (Numerologi ${i})`;
        }

        desc = `Kartu ${indoName} merepresentasikan energi ${suitData.element} dalam fase ke-${i}. ${keywords.join(', ')}.`;

        fullDeck.push({
          id: idCounter++,
          shortCode: shortCode,
          name: name,
          nameIndo: indoName,
          arcana: 'Minor',
          suit: suitData.type as any,
          number: i,
          keywords: keywords,
          description: desc,
          astrology: astro,
          numerology: i,
          element: suitData.element
        });
      }
    });

    this._deck.set(fullDeck);
  }

  private inferElementFromAstro(astro?: string): string {
    if(!astro) return '';
    if(astro.includes('Api') || astro.includes('Aries') || astro.includes('Leo') || astro.includes('Sagitarius')) return 'Api';
    if(astro.includes('Air') || astro.includes('Cancer') || astro.includes('Scorpio') || astro.includes('Pisces')) return 'Air';
    if(astro.includes('Udara') || astro.includes('Gemini') || astro.includes('Libra') || astro.includes('Aquarius')) return 'Udara';
    if(astro.includes('Bumi') || astro.includes('Taurus') || astro.includes('Virgo') || astro.includes('Capricorn')) return 'Bumi';
    return 'Spirit';
  }

  getDeck(): TarotCard[] {
    return this._deck();
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

  getRandomCard(): TarotCard {
    const deck = this._deck();
    return deck[Math.floor(Math.random() * deck.length)];
  }

  async interpretReading(
    spread: TarotSpread, 
    cards: {position: number, card: TarotCard, isReversed: boolean}[], 
    significator?: TarotCard,
    userContext?: string
  ): Promise<string> {
    
    // Offline Fallback Generation
    if (!this.ai) {
      return this.generateOfflineReading(spread, cards, significator, userContext);
    }

    let significatorContext = "";
    if (significator) {
      significatorContext = `\nSignificator (Kartu Representasi Diri Klien): ${significator.nameIndo} (${significator.description}). Gunakan kartu ini sebagai jangkar kepribadian klien.`;
    }

    let contextStr = "Klien tidak memberikan konteks spesifik. Lakukan pembacaan umum (General Reading).";
    if (userContext && userContext.trim().length > 0) {
      contextStr = `KONTEKS/INTENSI KLIEN: "${userContext}". Pastikan interpretasi SANGAT RELEVAN dengan konteks ini.`;
    }

    const cardDescriptions = cards.map(c => 
      `Posisi ${c.position} (${spread.positions.find(p => p.id === c.position)?.name}): ${c.card.nameIndo} (${c.isReversed ? 'TERBALIK' : 'TEGAK'}). Keywords: ${c.card.keywords.join(', ')}.`
    ).join('\n');

    const prompt = `
      Bertindaklah sebagai Konselor Tarot Psikologi ahli (seperti gaya Hisyam A. Fachri / Carl Jung).
      Lakukan pembacaan untuk tebaran: "${spread.name}".
      
      ${contextStr}
      ${significatorContext}
      
      Panduan Interpretasi:
      1. Gunakan pendekatan Psikologi Jungian (Arketipe, Sinkronisitas, Proyeksi).
      2. Jika kartu TERBALIK: Artikan sebagai "Shadow Side" (energi terinternalisasi, terhambat, atau potensi laten), bukan sekadar nasib buruk.
      3. Hubungkan antar kartu secara naratif, jangan hanya list per poin.
      4. Akhiri dengan "Saran Reflektif" yang konkret.
      5. Gaya bahasa: Empatik, menenangkan, dalam, dan profesional bahasa Indonesia.
      
      Kartu-kartu yang terpilih:
      ${cardDescriptions}
    `;

    try {
      // Create chat session for follow-up
      this.chatSession = this.ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
          systemInstruction: "Anda adalah Tarot Counselor yang bijaksana, empatik, dan berbasis psikologi Jungian. Anda membantu klien memahami diri mereka melalui simbol kartu tarot yang baru saja dibaca. Jangan meramal nasib pasti, tapi fokus pada potensi dan psikologi.",
        }
      });

      const response: GenerateContentResponse = await this.chatSession.sendMessage({
        message: prompt
      });
      return response.text;
    } catch (error) {
      console.error("AI Error:", error);
      return this.generateOfflineReading(spread, cards, significator, userContext);
    }
  }

  async chatWithAI(message: string): Promise<string> {
    if (!this.chatSession || !this.ai) {
      return "Sesi chat belum dimulai atau API tidak tersedia. Lakukan pembacaan baru terlebih dahulu.";
    }
    try {
      const response = await this.chatSession.sendMessage({ message });
      return response.text;
    } catch (error) {
      console.error("Chat Error", error);
      return "Maaf, koneksi terputus. Silakan coba lagi.";
    }
  }

  // Fallback for when AI is down or API key missing
  private generateOfflineReading(
    spread: TarotSpread, 
    cards: {position: number, card: TarotCard, isReversed: boolean}[], 
    significator?: TarotCard,
    userContext?: string
  ): string {
    let result = `[OFFLINE MODE - Interpretasi Dasar]\n\n`;
    
    if (userContext) result += `Fokus: ${userContext}\n\n`;
    if (significator) result += `Significator: ${significator.nameIndo}\n\n`;
    
    result += `Analisis Kartu:\n`;
    
    cards.forEach(c => {
      const posName = spread.positions.find(p => p.id === c.position)?.name;
      const orientation = c.isReversed ? "(Terbalik - Energi Internal/Terhambat)" : "(Tegak)";
      result += `\n${c.position}. ${posName}: **${c.card.nameIndo}** ${orientation}\n`;
      result += `   Kata Kunci: ${c.card.keywords.join(', ')}\n`;
      result += `   Makna: ${c.card.description}\n`;
    });

    result += `\n\nCatatan: Hubungkan kata kunci di atas dengan situasi hidup Anda saat ini secara intuitif.`;
    return result;
  }
}
