import { Setting } from './Settings';
import { Location } from './Location';


export class User {
    id: string;
    email: string;
    name: string;
    image: string;
    location: Location;
    setting: Setting;
    distance: number;
}