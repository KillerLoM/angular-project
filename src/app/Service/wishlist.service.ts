import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { AppService } from './app.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  url = '';
    constructor(
    @Inject(HttpClient) private http: HttpClient,
    private appService: AppService
  ) { 
    this.url = this.appService.getUrlWishlist();
  }
  addWishList(id: number): Observable<any> {
    return this.http.post(`${this.url}course/${id}`,{}).pipe();
  }
  deleteWishList(id: number): Observable<any> {
    return this.http.delete(`${this.url}course/${id}`).pipe();
  }
  getStatusWishList(id: number): Observable<any>{
    return this.http.get(`${this.url}status/c/${id}`).pipe();
  }
  getWishListMine(): Observable<any>{
    return this.http.get(`${this.url}mine`).pipe();
  }
  getWishList(page: number): Observable<any>{
    let params = new HttpParams().set('page', page);
    return this.http.get(`${this.url}mine`, {params}).pipe();
  }
}
