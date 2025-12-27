
export interface TarotCard {
  id: number;
  shortCode: string; // e.g., 'm00', 'c01', 'w10' for mapping images
  name: string;
  nameIndo: string;
  arcana: 'Major' | 'Minor';
  suit?: 'Tongkat' | 'Piala' | 'Pedang' | 'Koin';
  number?: number; 
  keywords: string[];
  description: string;
  astrology?: string; // Zodiak atau Planet
  numerology?: number;
  element?: string;
}

export interface SpreadPosition {
  id: number;
  name: string;
  description: string;
}

export interface TarotSpread {
  id: string;
  name: string;
  description: string;
  positions: SpreadPosition[];
}

// Major Arcana Data Base with Astrology/Numerology
export const MAJOR_ARCANA_BASE = [
  { id: 0, code: 'm00', name: "The Fool", nameIndo: "Si Dungu", keywords: ["Awal baru", "Kepolosan", "Spontanitas"], desc: "Keterbukaan terhadap pengalaman baru.", astro: "Uranus / Udara", num: 0 },
  { id: 1, code: 'm01', name: "The Magician", nameIndo: "Sang Pesulap", keywords: ["Manifestasi", "Keahlian", "Kekuatan"], desc: "Penggunaan akal sehat dan kehendak sadar.", astro: "Merkurius", num: 1 },
  { id: 2, code: 'm02', name: "The High Priestess", nameIndo: "Pendeta Wanita", keywords: ["Intuisi", "Bawah Sadar", "Misteri"], desc: "Kebijaksanaan batin dan intuisi.", astro: "Bulan", num: 2 },
  { id: 3, code: 'm03', name: "The Empress", nameIndo: "Sang Ratu", keywords: ["Kesuburan", "Alam", "Kenyamanan"], desc: "Kreativitas, kelimpahan, dan keibuan.", astro: "Venus", num: 3 },
  { id: 4, code: 'm04', name: "The Emperor", nameIndo: "Sang Raja", keywords: ["Otoritas", "Struktur", "Ayah"], desc: "Stabilitas, aturan, dan kekuasaan.", astro: "Aries", num: 4 },
  { id: 5, code: 'm05', name: "The Hierophant", nameIndo: "Ahli Tafsir Agama", keywords: ["Tradisi", "Keyakinan", "Pendidikan"], desc: "Konformitas sosial dan keyakinan spiritual.", astro: "Taurus", num: 5 },
  { id: 6, code: 'm06', name: "The Lovers", nameIndo: "Sang Pecinta", keywords: ["Cinta", "Pilihan", "Harmoni"], desc: "Hubungan, nilai-nilai, dan pilihan moral.", astro: "Gemini", num: 6 },
  { id: 7, code: 'm07', name: "The Chariot", nameIndo: "Kereta Perang", keywords: ["Kendali", "Tekad", "Kemenangan"], desc: "Mengatasi rintangan dengan tekad kuat.", astro: "Cancer", num: 7 },
  { id: 8, code: 'm08', name: "Strength", nameIndo: "Kekuatan", keywords: ["Keberanian", "Persuasi", "Welas Asih"], desc: "Kekuatan batin dan kontrol emosi.", astro: "Leo", num: 8 },
  { id: 9, code: 'm09', name: "The Hermit", nameIndo: "Sang Petapa", keywords: ["Introspeksi", "Pencarian", "Kesendirian"], desc: "Mencari jawaban di dalam diri sendiri.", astro: "Virgo", num: 9 },
  { id: 10, code: 'm10', name: "Wheel of Fortune", nameIndo: "Roda Keberuntungan", keywords: ["Siklus", "Takdir", "Perubahan"], desc: "Perubahan nasib yang tak terelakkan.", astro: "Jupiter", num: 10 },
  { id: 11, code: 'm11', name: "Justice", nameIndo: "Keadilan", keywords: ["Kebenaran", "Hukum", "Sebab-Akibat"], desc: "Kejujuran, keseimbangan, dan konsekuensi.", astro: "Libra", num: 11 },
  { id: 12, code: 'm12', name: "The Hanged Man", nameIndo: "Lelaki Digantung", keywords: ["Pengorbanan", "Melepaskan", "Perspektif Baru"], desc: "Jeda, penyerahan diri, dan melihat dari sudut pandang lain.", astro: "Neptunus / Air", num: 12 },
  { id: 13, code: 'm13', name: "Death", nameIndo: "Kematian", keywords: ["Akhir", "Transformasi", "Transisi"], desc: "Akhir dari sebuah siklus dan awal yang baru.", astro: "Scorpio", num: 13 },
  { id: 14, code: 'm14', name: "Temperance", nameIndo: "Kesederhanaan", keywords: ["Keseimbangan", "Moderasi", "Kesabaran"], desc: "Penyatuan elemen-elemen yang berbeda.", astro: "Sagitarius", num: 14 },
  { id: 15, code: 'm15', name: "The Devil", nameIndo: "Setan", keywords: ["Keterikatan", "Materialisme", "Ketidaktahuan"], desc: "Terjebak dalam ilusi materi atau nafsu.", astro: "Capricorn", num: 15 },
  { id: 16, code: 'm16', name: "The Tower", nameIndo: "Menara", keywords: ["Bencana", "Wahyu", "Kehancuran"], desc: "Perubahan tiba-tiba yang menghancurkan struktur lama.", astro: "Mars", num: 16 },
  { id: 17, code: 'm17', name: "The Star", nameIndo: "Bintang", keywords: ["Harapan", "Spiritualitas", "Inspirasi"], desc: "Harapan baru, ketenangan, dan penyembuhan.", astro: "Aquarius", num: 17 },
  { id: 18, code: 'm18', name: "The Moon", nameIndo: "Bulan", keywords: ["Ilusi", "Ketakutan", "Bawah Sadar"], desc: "Ketidakpastian dan eksplorasi dunia mimpi.", astro: "Pisces", num: 18 },
  { id: 19, code: 'm19', name: "The Sun", nameIndo: "Matahari", keywords: ["Kegembiraan", "Kehangatan", "Kesuksesan"], desc: "Kebahagiaan, vitalitas, dan pencerahan.", astro: "Matahari", num: 19 },
  { id: 20, code: 'm20', name: "Judgement", nameIndo: "Pengadilan Akhir", keywords: ["Penilaian", "Kelahiran Kembali", "Panggilan"], desc: "Kebangkitan kesadaran dan evaluasi diri.", astro: "Pluto / Api", num: 20 },
  { id: 21, code: 'm21', name: "The World", nameIndo: "Bumi", keywords: ["Penyelesaian", "Integrasi", "Pencapaian"], desc: "Kesempurnaan, pencapaian, dan perjalanan utuh.", astro: "Saturnus / Bumi", num: 21 }
];

export const SPREADS: TarotSpread[] = [
  {
    id: '3-card',
    name: 'Tebaran Tiga Kartu (Time/Psychological)',
    description: 'Tebaran dasar untuk melihat pola linier waktu atau aspek diri.',
    positions: [
      { id: 1, name: 'Tesis / Masa Lalu / Tubuh', description: 'Keadaan fisik atau akar masalah dari masa lalu.' },
      { id: 2, name: 'Sintesis / Sekarang / Pikiran', description: 'Keadaan mental saat ini atau proses yang sedang terjadi.' },
      { id: 3, name: 'Antitesis / Masa Depan / Jiwa', description: 'Harapan, potensi spiritual, atau hasil yang mungkin.' }
    ]
  },
  {
    id: 'celtic-cross',
    name: 'Celtic Cross (Psikologi)',
    description: 'Metode klasik yang diadaptasi untuk konseling mendalam.',
    positions: [
      { id: 1, name: 'Situasi Sekarang', description: 'Keadaan klien saat ini.' },
      { id: 2, name: 'Kendala', description: 'Hambatan atau tantangan yang dihadapi.' },
      { id: 3, name: 'Bawah Sadar / Harapan', description: 'Apa yang mendasari masalah ini.' },
      { id: 4, name: 'Masa Lalu', description: 'Akar penyebab dari masa lalu.' },
      { id: 5, name: 'Tujuan / Kesadaran', description: 'Apa yang dicita-citakan atau dipikirkan secara sadar.' },
      { id: 6, name: 'Masa Depan Dekat', description: 'Arah situasi dalam waktu dekat.' },
      { id: 7, name: 'Ego / Sikap Diri', description: 'Bagaimana klien melihat dirinya sendiri.' },
      { id: 8, name: 'Lingkungan', description: 'Pengaruh orang lain atau situasi eksternal.' },
      { id: 9, name: 'Harapan & Ketakutan', description: 'Emosi terdalam terkait situasi.' },
      { id: 10, name: 'Hasil / Perspektif', description: 'Kesimpulan atau potensi hasil jangka panjang.' }
    ]
  },
  {
    id: 'invoking-pentacles',
    name: 'The Invoking Pentacles',
    description: 'Tebaran 5 kartu untuk melihat elemen kehidupan.',
    positions: [
      { id: 1, name: 'Bumi', description: 'Fisik, materi, kesehatan.' },
      { id: 2, name: 'Air', description: 'Emosi, perasaan, hubungan.' },
      { id: 3, name: 'Api', description: 'Semangat, kreativitas, tindakan.' },
      { id: 4, name: 'Udara', description: 'Pikiran, komunikasi, intelek.' },
      { id: 5, name: 'Jiwa', description: 'Inti masalah, spirit, keseimbangan.' }
    ]
  }
];
