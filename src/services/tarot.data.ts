
export interface TarotCard {
  id: number;
  name: string;
  nameIndo: string;
  arcana: 'Major' | 'Minor';
  suit?: 'Tongkat' | 'Piala' | 'Pedang' | 'Koin';
  number?: number; // 0-21 for Major, 1-14 for Minor (11=Page, 12=Knight, 13=Queen, 14=King)
  keywords: string[];
  description: string;
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

export const MAJOR_ARCANA: TarotCard[] = [
  { id: 0, name: "The Fool", nameIndo: "Si Dungu", arcana: "Major", number: 0, keywords: ["Awal baru", "Kepolosan", "Spontanitas", "Potensi"], description: "Keterbukaan terhadap pengalaman baru, keberanian, dan petualangan." },
  { id: 1, name: "The Magician", nameIndo: "Sang Pesulap", arcana: "Major", number: 1, keywords: ["Manifestasi", "Keahlian", "Konsentrasi", "Kekuatan"], description: "Komunikasi, penggunaan akal sehat, dan masalah mental." },
  { id: 2, name: "The High Priestess", nameIndo: "Pendeta Wanita", arcana: "Major", number: 2, keywords: ["Intuisi", "Bawah Sadar", "Misteri", "Kebijaksanaan"], description: "Pengembangan psikis, keimanan, dan pemeliharaan diri." },
  { id: 3, name: "The Empress", nameIndo: "Sang Ratu", arcana: "Major", number: 3, keywords: ["Kesuburan", "Alam", "Kenyamanan", "Keibuan"], description: "Hubungan dengan perempuan, hal-hal yang menarik, kreativitas, dan pengasuhan." },
  { id: 4, name: "The Emperor", nameIndo: "Sang Raja", arcana: "Major", number: 4, keywords: ["Otoritas", "Struktur", "Ayah", "Logika"], description: "Hal baru, ketegasan sikap, penataan, dan berkaitan dengan pria." },
  { id: 5, name: "The Hierophant", nameIndo: "Ahli Tafsir Agama", arcana: "Major", number: 5, keywords: ["Tradisi", "Keyakinan", "Pendidikan", "Konformitas"], description: "Belajar dan mengajar, mendengarkan, serta berbicara dan bekerja dalam struktur sosial." },
  { id: 6, name: "The Lovers", nameIndo: "Sang Pecinta", arcana: "Major", number: 6, keywords: ["Cinta", "Pilihan", "Harmoni", "Nilai"], description: "Hubungan, membuat keputusan, dan menerima tanggung jawab." },
  { id: 7, name: "The Chariot", nameIndo: "Kereta Perang", arcana: "Major", number: 7, keywords: ["Kendali", "Tekad", "Kemenangan", "Arah"], description: "Pembuktian, perjalanan, belajar melindungi diri sendiri atau orang lain." },
  { id: 8, name: "Strength", nameIndo: "Kekuatan", arcana: "Major", number: 8, keywords: ["Keberanian", "Persuasi", "Pengaruh", "Welas Asih"], description: "Keinginan berkreasi, gairah, tantangan, dan penahanan emosi." },
  { id: 9, name: "The Hermit", nameIndo: "Sang Petapa", arcana: "Major", number: 9, keywords: ["Introspeksi", "Pencarian", "Kesendirian", "Bimbingan"], description: "Introspeksi diri, belajar dari pengalaman, penyempurnaan, dan penyelesaian suatu pekerjaan." },
  { id: 10, name: "Wheel of Fortune", nameIndo: "Roda Keberuntungan", arcana: "Major", number: 10, keywords: ["Siklus", "Takdir", "Titik Balik", "Perubahan"], description: "Perubahan hidup, bagaimana menyelesaikan suatu siklus, nasib dan peruntungan." },
  { id: 11, name: "Justice", nameIndo: "Keadilan", arcana: "Major", number: 11, keywords: ["Kebenaran", "Hukum", "Sebab-Akibat", "Kejelasan"], description: "Hukum dan pertimbangan, keseimbangan dan keharmonisan, kejujuran." },
  { id: 12, name: "The Hanged Man", nameIndo: "Lelaki Digantung", arcana: "Major", number: 12, keywords: ["Pengorbanan", "Melepaskan", "Perspektif Baru", "Jeda"], description: "Pengorbanan, sikap, dan keyakinan serta perspektif baru." },
  { id: 13, name: "Death", nameIndo: "Kematian", arcana: "Major", number: 13, keywords: ["Akhir", "Transformasi", "Transisi", "Pelepasan"], description: "Bagaimana melepaskan situasi, memasuki fase baru, kelahiran kembali." },
  { id: 14, name: "Temperance", nameIndo: "Kesederhanaan", arcana: "Major", number: 14, keywords: ["Keseimbangan", "Moderasi", "Kesabaran", "Tujuan"], description: "Kesehatan, menerima apa adanya, dan praktik penyembuhan." },
  { id: 15, name: "The Devil", nameIndo: "Setan", arcana: "Major", number: 15, keywords: ["Keterikatan", "Materialisme", "Ketidaktahuan", "Bayangan"], description: "Perjuangan, lingkungan, dan sikap." },
  { id: 16, name: "The Tower", nameIndo: "Menara", arcana: "Major", number: 16, keywords: ["Bencana", "Wahyu", "Kehancuran", "Pembebasan"], description: "Cobaan hidup, kemarahan, dan menghancurkan pola lama yang tak diperlukan lagi." },
  { id: 17, name: "The Star", nameIndo: "Bintang", arcana: "Major", number: 17, keywords: ["Harapan", "Spiritualitas", "Pembaruan", "Inspirasi"], description: "Pengakuan prestasi, idealis, kebutuhan bertindak." },
  { id: 18, name: "The Moon", nameIndo: "Bulan", arcana: "Major", number: 18, keywords: ["Ilusi", "Ketakutan", "Kecemasan", "Bawah Sadar"], description: "Imajinasi dan hubungan sebab-akibat." },
  { id: 19, name: "The Sun", nameIndo: "Matahari", arcana: "Major", number: 19, keywords: ["Kegembiraan", "Kehangatan", "Kesuksesan", "Vitalitas"], description: "Pencapaian tujuan, harga diri, dan pengakuan." },
  { id: 20, name: "Judgement", nameIndo: "Pengadilan Akhir", arcana: "Major", number: 20, keywords: ["Penilaian", "Kelahiran Kembali", "Panggilan", "Absolusi"], description: "Pertimbangan hidup, evaluasi diri, keyakinan, pandangan, dan hubungan dengan transisi." },
  { id: 21, name: "The World", nameIndo: "Bumi", arcana: "Major", number: 21, keywords: ["Penyelesaian", "Integrasi", "Pencapaian", "Perjalanan"], description: "Potensi yang terbatas dan pengembangan." }
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
