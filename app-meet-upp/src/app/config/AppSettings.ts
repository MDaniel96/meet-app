export class AppSettings {
    
    public static LOCAL: boolean = false;    
    public static INTERCEPT_PATH: string = '/user';
    public static DEFAULT_EMAIL: string = 'morvai.daniel96@gmail.com';

    public static getBase(): string {
        if (this.LOCAL) {
            return this.LOCALHOST_BASE;
        } else {
            return this.HEROKU_BASE;
        }
    }

    private static LOCALHOST_BASE: string = 'http://localhost:8080';
    private static HEROKU_BASE: string = 'http://rest-meet-upp.herokuapp.com';

}