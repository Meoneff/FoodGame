import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Reel {
  symbols: number[];
  currentPosition: number;
}

@Component({
  selector: 'app-reel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reel.component.html',
  styleUrls: ['./reel.component.scss']
})
export class ReelComponent {
  @Input() reel!: Reel;
  @Input() reelIndex!: number;
  @Input() isSpinning: boolean = false;
  @Input() rowsVisible: number = 3;

  getVisibleSymbols(): number[] {
    const start = this.reel.currentPosition % this.reel.symbols.length;
    const visible: number[] = [];

    for (let i = 0; i < this.rowsVisible; i++) {
      visible.push(this.reel.symbols[(start + i) % this.reel.symbols.length]);
    }
    return visible;
  }

  getSymbolIcon(symbol: number): string {
    switch (symbol) {
      case 3:
        return '🍒';
      case 4:
        return '🍋';
      case 5:
        return '💎';
      case 6:
        return '👑';
      default:
        return '❓';
    }
  }
}
