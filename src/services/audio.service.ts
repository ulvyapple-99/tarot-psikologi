
import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  private isMuted = signal<boolean>(false);
  
  // Audio sources (Using free creative commons sounds)
  private shuffleSound = new Audio('https://raw.githubusercontent.com/tindoggi/tarot-images/master/sounds/shuffle.mp3'); // Placeholder logic for sound files
  private flipSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2073/2073-preview.mp3');
  private ambientMusic = new Audio('https://upload.wikimedia.org/wikipedia/commons/e/ea/Gymnopedie_No_1.ogg'); // Satie - Gymnopedie No 1

  constructor() {
    this.ambientMusic.loop = true;
    this.ambientMusic.volume = 0.3;
    this.flipSound.volume = 0.5;
  }

  toggleMute() {
    this.isMuted.update(v => !v);
    if (this.isMuted()) {
      this.ambientMusic.pause();
    } else {
      this.ambientMusic.play().catch(e => console.log('Audio autoplay blocked until interaction'));
    }
  }

  isAudioMuted() {
    return this.isMuted();
  }

  playShuffle() {
    if (this.isMuted()) return;
    // Simulating shuffle sound with a generic paper sound if specific file fails, 
    // but here we use a simple timeout for visual sync or actual audio if available.
    // Since I cannot upload mp3s, I am using a generic public URL or avoiding error if it fails.
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3'); // Card shuffle sfx
    audio.volume = 0.5;
    audio.play().catch(() => {});
  }

  playFlip() {
    if (this.isMuted()) return;
    this.flipSound.currentTime = 0;
    this.flipSound.play().catch(() => {});
  }

  startAmbient() {
    if (this.isMuted()) return;
    this.ambientMusic.play().catch(() => {});
  }
}
