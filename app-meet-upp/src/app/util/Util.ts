export class Util {
    private firstTime: boolean = true;

    /**
     * Simple flag turns to false after first call
     * Use it to call smth just once at Pages or Components
     */
    public isFirstTime(): boolean {
        if (this.firstTime) {
            this.firstTime = false;
            return true;
        } else {
            return false;
        }

    }

}