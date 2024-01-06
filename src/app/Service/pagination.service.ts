import { Injectable } from '@angular/core';
import { Observable, delay, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaginationService {
  private totalItem = 20;
  constructor() { }
  getItem(page: number, itemsPerPage: number, totalItem: number): Observable<any> {
      const startIndex = (page -1)*itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const items = [];
      for(let i = startIndex; i<endIndex; i++) {
        if(i < this.totalItem){
          items.push(`Item ${i+1}`)
        }
      }
      return of(items).pipe(delay(500))
  }
}
