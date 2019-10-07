import { Pipe, PipeTransform } from '@angular/core';
import { AppSettings } from '../config/AppSettings';

/**
 * Calculates passed time since given time and converts to string
 * if shortversion is true it shortens return string (e.g.: hours -> h)
 */
@Pipe({
  name: 'since'
})
export class SincePipe implements PipeTransform {

  transform(value: number, shortVersion?: boolean): string {
    let from = new Date(value);
    let today = new Date();
    let diff = (today.getTime() - from.getTime()) / 1000;

    let days = Math.floor(diff / (60 * 60 * 24));
    let hours = Math.floor(diff / (60 * 60) - days * 24);
    let minutes = Math.floor(diff / 60 - days * 24 * 60 - hours * 60);

    let allMinutes = minutes + hours * 60 + days * 24 * 60;
    if (allMinutes <= AppSettings.AVAILABILITY_DURATION_MIN) {
      return 'Available';
    }

    if (days !== 0) {
      return days === 1
        ? (shortVersion ? `1 d ago` : `1 day ago`)
        : (shortVersion ? `${days} d ago` : `${days} days ago`)
    } else if (hours !== 0) {
      return hours > 12
        ? (shortVersion ? `${hours} h ago` : `${hours} hours ago`)
        : (shortVersion ? `${hours}h, ${minutes}m ago` : `${hours} hours, ${minutes} minutes ago`);
    } else {
      return (shortVersion ? `${minutes} m ago` : `${minutes} minutes ago`);
    }
  }

}
