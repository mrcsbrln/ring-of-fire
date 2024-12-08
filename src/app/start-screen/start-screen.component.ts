import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Firestore, addDoc, collection } from '@angular/fire/firestore';
import { Game } from '../../models/game';

@Component({
  selector: 'app-start-screen',
  standalone: true,
  imports: [],
  templateUrl: './start-screen.component.html',
  styleUrl: './start-screen.component.scss',
})
export class StartScreenComponent {
  private firestore: Firestore = inject(Firestore);
  creatingNewGame = false;

  constructor(private router: Router) {}

  async newGame() {
    this.creatingNewGame = true;
    const id = await this.addToGameCollection();
    this.router.navigateByUrl(`/game/${id}`);
  }

  private getGamesRef() {
    return collection(this.firestore, 'games');
  }

  private async addToGameCollection() {
    const game = new Game();
    const documentReference = await addDoc(this.getGamesRef(), game.toJSON());
    return documentReference.id;
  }
}
