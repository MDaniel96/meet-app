import { Location } from './Location';

export class Event {
    id: string;
    name: string;
    time: Date;
    location: Location;
    peopleCount: number;
    public: boolean;
}