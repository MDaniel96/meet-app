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
    public static AVAILABILITY_DURATION_MIN: number = 5;
    // Friends END

    // Friend detail BEGIN
    public static ADD_FRIEND: string = 'Add friend';
    public static REMOVE_FRIEND: string = 'Delete friend';
    public static PENDING_FRIEND: string = 'Pending..';
    // Friend detail END

    // Loading BEGIN
    public static LOADING_FRIENDS: string = 'Loading friends...';
    public static LOADING_EVENTS: string = 'Loading events...';
    public static CREATING_EVENT: string = 'Creating event...';
    public static UPDATING_LOCATION: string = 'Updating location...';
    public static LOGOUT_LOADING_MILISECS: number = 400;
    public static LOADING_BACKDROP_DISMISS: boolean = true;
    // Loading END

    // Map BEGIN
    public static MAP_CANVAS_FRIEND: string = 'map_friend';
    public static MAP_CANVAS_SELECT: string = 'map_select';
    public static MAP_CANVAS: string = 'map_canvas';
    public static MAP_USER_ZOOM: number = 16;
    public static MAP_ANIMATION_SPEED_MILISEC: number = 1000;
    public static MAP_ICON_SIZE: number = 43;
    public static MAP_MY_LOCATION_URL: string = 'http://maps.google.com/mapfiles/ms/micons/blue.png';
    public static MAP_EVENT_LOCATION_URL: string = 'http://maps.google.com/mapfiles/ms/micons/green.png';
    // Map END

    // Modal BEGIN
    public static MODAL_DEFDATE_PLUS_HOURS: number = 3;
    public static MODAL_VALIDATION_ALERT: string = 'Please give name and select friends to your event';
    // Modal END

}