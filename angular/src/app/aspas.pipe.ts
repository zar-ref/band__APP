
import {  Pipe, PipeTransform  } from '@angular/core';

@Pipe({name: 'aspasOut'})
export class aspasOut implements PipeTransform{
  transform(expression: string): string {
      if(expression) {
           return expression.replace(/['"]+/g, '');
      }
      return;
   
  }
}