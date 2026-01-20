import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SlotHeaderComponent } from './header/header.component';
import { ReelComponent } from './reel/reel.component';
import { WinDisplayComponent, WinInfo } from './win-display/win-display.component';
import { ControlsComponent } from './controls/controls.component';
import { SlotInfoComponent } from './info/info.component';

interface Reel {
  symbols: number[];
  currentPosition: number;
}

@Component({
  selector: 'app-slot-machine',
  standalone: true,
  imports: [
    CommonModule,
    SlotHeaderComponent,
    ReelComponent,
    WinDisplayComponent,
    ControlsComponent,
    SlotInfoComponent
  ],
  templateUrl: './slot-machine.component.html',
  styleUrls: ['./slot-machine.component.scss']
})
export class SlotMachineComponent implements OnInit {
  // Game state
  points: number = 1000;
  betAmount: number = 10;
  isSpinning: boolean = false;
  lastWin: WinInfo | null = null;

  // Reel configuration
  reels: Reel[] = [];
  readonly REEL_COUNT = 6;
  readonly SYMBOLS = [3, 4, 5, 6];
  readonly MULTIPLIERS = [8, 16, 32, 64];
  readonly ROWS_VISIBLE = 3;
  readonly SPIN_DURATION = 10000; // 10 seconds
  
  // Reel symbols mapping: Cột 1-6 = 3-4-5-5-4-6
  readonly REEL_SYMBOL_MAP = [3, 4, 5, 5, 4, 6];
  
  // Reel rows mapping: Cột 1-6 = 3-4-5-5-4-3
  readonly REEL_ROWS_MAP = [3, 4, 5, 5, 4, 3];
  
  // Multiplier display: x1, x2, x4, x8, x1, x2
  readonly MULTIPLIER_MAP = [1, 2, 4, 8, 1, 2];

  ngOnInit() {
    this.initializeReels();
  }

  initializeReels() {
    this.reels = [];
    for (let i = 0; i < this.REEL_COUNT; i++) {
      this.reels.push({
        symbols: this.generateSymbolsForReel(i),
        currentPosition: 0
      });
    }
  }

  generateSymbolsForReel(reelIndex: number): number[] {
    const symbols: number[] = [];
    const allSymbols = [3, 4, 5, 6]; // Mix các icon này vào tất cả cột
    
    // Generate multiple rows with random symbols
    for (let i = 0; i < 50; i++) {
      const randomSymbol = allSymbols[Math.floor(Math.random() * allSymbols.length)];
      symbols.push(randomSymbol);
    }
    return symbols;
  }

  spin() {
    if (this.isSpinning || this.points < this.betAmount) {
      return;
    }

    this.isSpinning = true;
    this.points -= this.betAmount;
    this.lastWin = null;

    const spinPromises = this.reels.map((reel, index) => {
      return new Promise<void>((resolve) => {
        const delay = 100 + index * 100;
        setTimeout(() => {
          this.spinReel(reel);
          setTimeout(resolve, this.SPIN_DURATION + delay);
        }, 0);
      });
    });

    Promise.all(spinPromises).then(() => {
      this.isSpinning = false;
      this.checkWin();
    });
  }

  private spinReel(reel: Reel) {
    const startPosition = reel.currentPosition;
    const spinDistance = 50 + Math.random() * 30;
    const steps = 20;
    let currentStep = 0;

    const spinInterval = setInterval(() => {
      currentStep++;
      reel.currentPosition = startPosition + (currentStep / steps) * spinDistance;

      if (currentStep >= steps) {
        clearInterval(spinInterval);
        reel.currentPosition = Math.floor(reel.currentPosition);
      }
    }, this.SPIN_DURATION / steps);
  }

  private checkWin() {
    const centerSymbols = this.reels.map((reel) => {
      const start = reel.currentPosition % reel.symbols.length;
      return reel.symbols[(start + 1) % reel.symbols.length];
    });

    this.evaluateWin(centerSymbols);
  }

  private evaluateWin(symbols: number[]) {
    const symbolCounts: { [key: number]: number } = {};
    symbols.forEach((sym) => {
      symbolCounts[sym] = (symbolCounts[sym] || 0) + 1;
    });

    let totalWin = 0;
    const matchedSymbols: number[] = [];

    for (const [symbol, count] of Object.entries(symbolCounts)) {
      const sym = parseInt(symbol);

      if (count >= 3) {
        let multiplier = this.MULTIPLIERS[0];

        if (sym === 6) multiplier = this.MULTIPLIERS[3]; // x64
        else if (sym === 5) multiplier = this.MULTIPLIERS[2]; // x32
        else if (sym === 4) multiplier = this.MULTIPLIERS[1]; // x16
        else if (sym === 3) multiplier = this.MULTIPLIERS[0]; // x8

        const winAmount = this.betAmount * count * multiplier;
        totalWin += winAmount;
        matchedSymbols.push(sym);
      }
    }

    if (totalWin > 0) {
      this.points += totalWin;
      const matchedSym = matchedSymbols[0];
      const multiplierIndex = matchedSym - 3;
      this.lastWin = {
        multiplier: this.MULTIPLIERS[multiplierIndex] || 8,
        winAmount: totalWin,
        matchedSymbols: matchedSymbols
      };
    }
  }

  onIncreaseBet() {
    this.betAmount = Math.min(this.betAmount + 10, this.points);
  }

  onDecreaseBet() {
    this.betAmount = Math.max(this.betAmount - 10, 10);
  }

  onResetGame() {
    this.points = 1000;
    this.betAmount = 10;
    this.lastWin = null;
    this.initializeReels();
  }
}
