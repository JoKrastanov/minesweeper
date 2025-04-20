export class Timer {
    private seconds: number = 0;
    private minutes: number = 0;
    private timerHtml: HTMLDivElement
    private timerStopped: boolean = false;

    constructor(timerHtml: HTMLDivElement) {
        timerHtml.innerHTML = "00:00";
        this.timerHtml = timerHtml;
        this.startTimer();
    }

    private startTimer() {
        setInterval(() => {
            if (this.timerStopped) {
                return;
            }
            this.seconds++;
            if (this.seconds >= 60) {
                this.seconds = 0;
                this.minutes++;
            }
            this.timerHtml.innerHTML = this.getFormattedTime();
        }, 1000);
    }

    public stopTimer() {
        this.timerStopped = true;
    }

    public getFormattedTime(): string {
        const formattedSeconds = this.seconds < 10 ? `0${this.seconds}` : this.seconds;
        const formattedMinutes = this.minutes < 10 ? `0${this.minutes}` : this.minutes;
        return `${formattedMinutes}:${formattedSeconds}`;
    }
}