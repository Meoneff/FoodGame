import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SlotMachineComponent } from './slot-machine/slot-machine.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SlotMachineComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('FrontEnd');
}
