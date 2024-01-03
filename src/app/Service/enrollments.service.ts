import { Inject, Injectable } from '@angular/core';
import { AppService } from './app.service';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EnrollmentsService {
  url = ''
  constructor(
    private appService: AppService,
    @Inject(HttpClient) private  http: HttpClient) {
      this.url = this.appService.getUrlEnroll();
  }
  addEnroll(email: string, id: number): Observable<any>{
    let obj = {userEmail: email, courseId: id} 
    return this.http.post(`${this.url}enroll`, obj).pipe();
  }

}
