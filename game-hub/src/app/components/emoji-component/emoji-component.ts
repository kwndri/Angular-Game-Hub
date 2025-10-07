import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-emoji-component',
  imports: [CommonModule],
  templateUrl: './emoji-component.html',
  styleUrl: './emoji-component.css',
})
export class EmojiComponent {
  metacritic = input<number>();
}
