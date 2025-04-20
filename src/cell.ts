export class Cell {
    private x: number;
    private y: number;
    private isBomb: boolean;
    private isRevealed: boolean;
    private isFlagged: boolean;
    private html: HTMLElement;
    private nrAdjacentBombs: number = 0;

    constructor(x: number, y: number, html: HTMLElement) {
        this.x = x;
        this.y = y;
        this.isBomb = false;
        this.isRevealed = false;
        this.isFlagged = false;
        this.nrAdjacentBombs = 0;
        this.html = html;
    }

    public getHTML(): HTMLElement {
        return this.html;
    }

    public setIsBomb(isBomb: boolean) {
        this.isBomb = isBomb;
    }

    public getIsBomb(): boolean {
        return this.isBomb;
    }

    public setIsRevealed(isRevealed: boolean) {
        this.isRevealed = isRevealed;
    }

    public getIsRevealed(): boolean {
        return this.isRevealed;
    }

    public setIsFlagged(isFlagged: boolean) {
        this.isFlagged = isFlagged;
    }

    public setNrAdjacentBombs(nrAdjacentBombs: number) {
        this.nrAdjacentBombs = nrAdjacentBombs;
    }

    public getIsFlagged(): boolean {
        return this.isFlagged;
    }

    public getX(): number {
        return this.x;
    }

    public getY(): number {
        return this.y;
    }

    public getNrAdjacentBombs(): number {
        return this.nrAdjacentBombs;
    }
}