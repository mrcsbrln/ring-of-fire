import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { Game } from '../../models/game';
import { PlayerComponent } from '../player/player.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { GameInfoComponent } from '../game-info/game-info.component';
import { Firestore, doc, getDoc, updateDoc } from '@angular/fire/firestore';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ThisReceiver } from '@angular/compiler';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [
    CommonModule,
    PlayerComponent,
    MatButtonModule,
    MatIconModule,
    GameInfoComponent,
    MatProgressSpinnerModule,
  ],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
})
export class GameComponent {
  private firestore: Firestore = inject(Firestore);

  pickCardAnimation = false;
  game: Game | undefined;
  currentCard = '';
  gameSubscription: Subscription | undefined;
  error = false;
  id = '';

  constructor(private route: ActivatedRoute, public dialog: MatDialog) {
    // const gamesCollection = this.getGamesRef();
    // const games$ = collectionData(gamesCollection) as Observable<Game[]>;
    // this.gameSubscription = games$.subscribe((games) => {
    //   console.log('Firestore-Daten:', games);
    // });
    // this.newGame();
    // console.log(this.game);
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.loadGame(params['id']);
      this.id = params['id'];
    });
  }

  ngOnDestroy() {
    if (this.gameSubscription) {
      this.gameSubscription.unsubscribe();
    }
  }

  private async loadGame(id: string) {
    const docRef = doc(this.firestore, 'games', id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      this.game = Game.fromJSON(docSnap.data());
      console.log('loaded game:', this.game);
    } else {
      this.error = true;
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);

    dialogRef.afterClosed().subscribe((name: string) => {
      if (name !== undefined && this.game) {
        this.game.players.push(name);
      }
    });
  }

  saveGame() {
    if (this.game) {
      const docRef = doc(this.firestore, 'games', this.id);
      updateDoc(docRef, this.game.toJSON());
    }
  }

  takeCard() {
    if (!this.game || this.pickCardAnimation) {
      return;
    }
    const card = this.game.stack.pop();
    if (card != undefined) {
      this.currentCard = card;
      this.pickCardAnimation = true;
    }
    console.log(this.currentCard);
    this.game.currentPlayer++;
    this.game.currentPlayer =
      this.game.currentPlayer % this.game.players.length;
    setTimeout(() => {
      if (this.game) {
        this.pickCardAnimation = false;
        this.game.playedCards.push(this.currentCard);
        this.saveGame();
      }
    }, 2000);
  }
}
