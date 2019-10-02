export class AppSettings {

    // Login BEGIN
    public static DEFAULT_EMAIL: string = 'morvai.daniel96@gmail.com';
    public static FACEBOOK_PERMISSIONS: string[] = ['email'];
    public static STORAGE_TOKEN_STR: string = 'token';
    // Login END

    // Settings location detection BEGIN
    public static LOC_SHARING: string = 'Location sharing ';
    public static LOC_SHARING_ON_FOOT: string = 'Coordinates: ';
    public static LOC_SHARING_OFF_FOOT: string = 'Please enable the app to access your location';
    public static LOC_ON: string = 'ON';
    public static LOC_OFF: string = 'OFF';
    public static LOC_ONDWAY: string = ' ...';
    // Settings location detection END

    // Connection base BEGIN
    public static LOCAL: boolean = false; 
    private static LOCALHOST_BASE: string = 'http://localhost:8080';
    private static HEROKU_BASE: string = 'http://rest-meet-upp.herokuapp.com';
    public static INTERCEPT_PATH: string = '/user';
    public static getBase(): string {
        if (this.LOCAL) {
            return this.LOCALHOST_BASE;
        } else {
            return this.HEROKU_BASE;
        }
    }
    // Connection base END

    // Friends BEGIN
    public static AVAILABILITY_DURATION_MIN: number = 10;
    // Friends END

    // Loading BEGIN
    public static LOADING_FRIENDS: string = 'Loading friends...';
    public static UPDATING_LOCATION: string = 'Updating location...';
    public static LOGOUT_LOADING_MILISECS: number = 400;
    // Loading END

}