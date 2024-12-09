import { DocumentData } from "@angular/fire/firestore";

export class Game {
    public players: string[] = [];
    public stack: string[] = [];
    public playedCards: string[] = [];
    public currentPlayer: number = 0;
    public currentCard = '';
    public pickCardAnimation = false;


    constructor() {
        for(let i = 1; i < 14; i++) {
            this.stack.push('spade_' + i);
            this.stack.push('hearts_' + i);
            this.stack.push('clubs_' + i);
            this.stack.push('diamonds_' + i);
        }

        this.shuffleDeck();
    }

    public shuffleDeck(): void {
        for (let i = this.stack.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.stack[i], this.stack[j]] = [this.stack[j], this.stack[i]];
        }
    }

    public toJSON() {
        return {
            players: this.players,
            stack: this.stack,
            playedCards: this.playedCards,
            currentPlayer: this.currentPlayer,
            currentCard: this.currentCard,
            pickCardAnimation: this.pickCardAnimation,
        }
    }

    public static fromJSON(data: DocumentData) {
        const game = new Game();
        game.currentPlayer = data['currentPlayer'];
        game.playedCards = data['playedCards'];
        game.players = data['players'];
        game.stack = data['stack'];
        game.currentCard = data['currentCard'];
        game.pickCardAnimation = data['pickCardAnimation'];
        return game
    }
}