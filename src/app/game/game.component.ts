import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { Game } from '../../models/game';
import { PlayerComponent } from '../player/player.component';
import { PlayerMobileComponent } from '../player-mobile/player-mobile.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { GameInfoComponent } from '../game-info/game-info.component';
import { Firestore, doc, getDoc, updateDoc } from '@angular/fire/firestore';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [
    CommonModule,
    PlayerComponent,
    PlayerMobileComponent,
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
  game: Game | undefined;
  gameSubscription: Subscription | undefined;
  error = false;
  id = '';

  constructor(private route: ActivatedRoute, public dialog: MatDialog) {}

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
    } else {
      this.error = true;
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);

    dialogRef.afterClosed().subscribe((name: string) => {
      if (name !== undefined && this.game) {
        this.game.players.push(name);
        this.saveGame();
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
    if (!this.game || this.game.pickCardAnimation || this.game.players.length === 0) {
      return;
    }
    const card = this.game.stack.pop();
    if (card != undefined) {
      this.game.currentCard = card;
      this.game.pickCardAnimation = true;
    }
    this.game.currentPlayer++;
    console.log(this.game.currentPlayer);
    this.game.currentPlayer = this.game.currentPlayer % this.game.players.length;
    this.saveGame();
    setTimeout(() => {
      if (this.game) {
        this.game.pickCardAnimation = false;
        this.game.playedCards.push(this.game.currentCard);
        this.saveGame();
      }
    }, 1000);
  }
}
