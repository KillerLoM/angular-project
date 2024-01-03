import { Inject, Injectable } from '@angular/core';
import { AppService } from './app.service';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  url = '';
  urlMine = ''
  constructor(
    private appService: AppService,
    @Inject(HttpClient) private http: HttpClient
  ) { 
    this.url = this.appService.getUrlCart();
    this.urlMine = this.appService.getUrlCartMine();
  }
  addCart(id: number): Observable<any> {
    return this.http.post(`${this.url}course/${id}`,{}).pipe();
  }
  deleteCart(id: number): Observable<any> {
    return this.http.delete(`${this.url}course/${id}`,{}).pipe();
  }
  getStatusCart(id: number): Observable<any> {
    return this.http.get(`${this.url}status/c/${id}`,{}).pipe();
  }
  getTotalCart(): Observable<any> {
    return this.http.get(`${this.urlMine}/count`,{}).pipe();
  }
  getTotalBill(): Observable<any> {
    return this.http.get(`${this.urlMine}/bill`,{}).pipe();
  }
  getCart(): Observable<any> {
    return this.http.get(`${this.urlMine}`,{}).pipe();
  }
}
