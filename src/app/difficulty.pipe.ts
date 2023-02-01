import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'difficultyPipe',
})
export class DifficultyPipe implements PipeTransform {
  transform(value: any, ...args: any[]) {
    let return_value;
    switch (value) {
      case 'hard':
        return_value = 'A hard question';
        break;
      case 'easy':
        return_value = 'An easy question';
        break;
      case 'medium':
        return_value = 'A medium question';
        break;
      }
      
      return return_value
  }
}
