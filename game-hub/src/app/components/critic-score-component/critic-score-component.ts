import { Component, input } from '@angular/core';

@Component({
  selector: 'app-critic-score-component',
  imports: [],
  templateUrl: './critic-score-component.html',
  styleUrl: './critic-score-component.css',
})
export class CriticScoreComponent {
  metacritic = input<number>();
}
