import { Settings } from './Settings';
import { Location } from './Location';


export class User {
    id: string;
    email: string;
    name: string;
    image: string;
    location: Location;
    settings: Settings;
    distance: number;
}