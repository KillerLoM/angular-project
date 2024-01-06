import { Inject, Injectable } from '@angular/core';
import { AppService } from './app.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  url = '';
  constructor(
    private appService: AppService,
    @Inject(HttpClient) private http: HttpClient,
  ) {
    this.url = this.appService.getUrlReview();
   }
   getReviewMine(id: number) : Observable<any> {
      return this.http.get(`${this.url}mine/c/${id}`).pipe();
   }
   postReview(rating: number, content: string, courseId: number): Observable<any> {
    let obj = {rating: rating, content: content, courseId: courseId}; {
      return this.http.post(`${this.url}`,obj)
    }}
    putReview(rating: number, content: string, courseId: number, id: number): Observable<any> {
      let obj = {rating: rating, content: content, courseId: courseId};
      return this.http.put(`${this.url}id/${id}`, obj);
    }
}
