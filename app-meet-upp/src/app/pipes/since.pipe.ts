import { Pipe, PipeTransform } from '@angular/core';
import { AppSettings } from '../config/AppSettings';

/**
 * Calculates passed time since given time and converts to string
 */
@Pipe({
  name: 'since'
})
export class SincePipe implements PipeTransform {

  transform(value: number): string {
    let from = new Date(value);
    let today = new Date();
    let diff = (today.getTime() - from.getTime()) / 1000;  

    let days = Math.floor(diff / (60 * 60 * 24));
    let hours = Math.floor(diff / (60 * 60) - days * 24);
    let minutes = Math.floor(diff / 60 - days * 24 * 60 - hours * 60);

    let allMinutes = minutes + hours * 60 + days * 24 * 60;
    if (allMinutes <= AppSettings.AVAILABILITY_DURATION_MIN) {
      return 'Available'
    }

    if (days !== 0) {
      return days === 1 ? `1 day ago` : `${days} days ago`
    } else if (hours !== 0) {
      return hours > 12 ? `${hours} hours ago` : `${hours} hours, ${minutes} minutes ago`;
    } else {
      return `${minutes} minutes ago`;
    }
  }

}
