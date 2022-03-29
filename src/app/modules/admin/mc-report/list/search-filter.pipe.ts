import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'filter',
    pure: false
})
export class SearchFilterPipe implements PipeTransform {
   transform(value: any, filterString: string, propName: string):any {

       if(value.length === 0 || filterString === ''){
           return value;
       }

       const result = [];
       for(const item of value){
            if(item[propName].indexOf(filterString) !== -1){
                result.push(item);
            }
       }
       console.log(result);
       return result;
   }
}