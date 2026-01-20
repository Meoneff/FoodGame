import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface WinInfo {
  multiplier: number;
  winAmount: number;
  matchedSymbols: number[];
}

@Component({
  selector: 'app-win-display',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './win-display.component.html',
  styleUrls: ['./win-display.component.scss']
})
export class WinDisplayComponent {
  @Input() winInfo: WinInfo | null = null;
}
