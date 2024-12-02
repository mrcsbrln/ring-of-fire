import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { Game } from '../../models/game';
import { PlayerComponent } from '../player/player.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { GameInfoComponent } from '../game-info/game-info.component';
import { Firestore, collection, collectionData, addDoc, CollectionReference, Unsubscribe } from '@angular/fire/firestore';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [
    CommonModule,
    PlayerComponent,
    MatButtonModule,
    MatIconModule,
    GameInfoComponent,
  ],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
})
export class GameComponent {
  private firestore: Firestore = inject(Firestore);

  pickCardAnimation = false;
  game!: Game;
  currentCard = '';
  gameSubscription: Subscription | undefined;

  constructor(public dialog: MatDialog) {
    const gamesCollection = this.getGamesRef();
    const games$ = collectionData(gamesCollection) as Observable<Game[]>;
    this.gameSubscription = games$.subscribe((games) => {
      console.log('Firestore-Daten:', games);
    });
    this.newGame();
    console.log(this.game);
  }

  ngOnDestroy(){
    if(this.gameSubscription) {
      this.gameSubscription.unsubscribe();
    }
  }

  private getGamesRef() {
    return collection(this.firestore, 'games');
  }

  addToGameCollection() {
      addDoc(this.getGamesRef(), this.game.toJSON()).then((documentReference) => {
        console.log(documentReference);
      });
  }

  newGame() {
    this.game = new Game();
    this.addToGameCollection();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);

    dialogRef.afterClosed().subscribe((name: string) => {
      if (name !== undefined) {
        this.game.players.push(name);
      }
    });
  }

  takeCard() {
    if (!this.pickCardAnimation) {
      const card = this.game.stack.pop();
      if (card != undefined) {
        this.currentCard = card;
        this.pickCardAnimation = true;
      }
      console.log(this.currentCard);
    }
    this.game.currentPlayer++;
    this.game.currentPlayer =
      this.game.currentPlayer % this.game.players.length;
    setTimeout(() => {
      this.pickCardAnimation = false;
      this.game.playedCards.push(this.currentCard);
    }, 2000);
  }
}

