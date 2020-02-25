
import {  Pipe, PipeTransform  } from '@angular/core';

@Pipe({name: 'fileTypeOut'})
export class fileTypeOut implements PipeTransform{
  transform(expression: string): string {
      if(expression) {
           return expression.split('.')[0];
      }
      return;
   
  }
}