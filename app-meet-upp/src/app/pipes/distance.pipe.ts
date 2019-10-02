import { Pipe, PipeTransform } from '@angular/core';

/**
 * Transforms meters into displayed distance string
 * e.g.
 * - 150 -> '150 m'
 * - 1234 -> '1,2 km'
 */
@Pipe({
  name: 'distance'
})
export class DistancePipe implements PipeTransform {

  transform(value: number): string {
    if (value < 1000) {
      return value + ' m';
    } else {
      let thousands = Math.floor(value / 1000);
      let hundreds = Math.floor((value-thousands*1000) / 100);
      return `${thousands},${hundreds} km`;
    }
  }

}
