import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Game } from '../../models/game';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss'
})

export class GameComponent {

  pickCardAnimation = false;
  game!: Game;
  currentCard = '';

  constructor(){
    this.newGame();
  }

  newGame(){
    this.game = new Game();
    console.log(this.game);
  }

  takeCard() {
    const card = this.game.stack.pop();
    if (card != undefined) {
      this.currentCard = card;
      this.pickCardAnimation = true;
    }
    console.log(this.currentCard);
  }
}
