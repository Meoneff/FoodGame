import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-slot-controls',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.scss']
})
export class ControlsComponent {
  @Input() isSpinning: boolean = false;
  @Input() points: number = 0;
  @Input() betAmount: number = 0;

  @Output() spin = new EventEmitter<void>();
  @Output() increaseBet = new EventEmitter<void>();
  @Output() decreaseBet = new EventEmitter<void>();
  @Output() reset = new EventEmitter<void>();

  onSpin() {
    this.spin.emit();
  }

  onIncreaseBet() {
    this.increaseBet.emit();
  }

  onDecreaseBet() {
    this.decreaseBet.emit();
  }

  onReset() {
    this.reset.emit();
  }
}
