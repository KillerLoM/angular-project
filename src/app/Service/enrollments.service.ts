import { Inject, Injectable } from '@angular/core';
import { AppService } from './app.service';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Enrollments } from '../Model/enrollments';

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
    return this.http.post(`${this.url}/enroll`, obj).pipe();
  }
  getEnroll(): Observable<any>{
    return this.http.get(`${this.url}/`);
  }
  getFromCourse(id: number): Observable<Enrollments>{
    return this.http.get<Enrollments>(`${this.url}/course/${id}`);
  }
  getFromEnroll(id: number): Observable<Enrollments>{
    return this.http.get<Enrollments>(`${this.url}/${id}`)
  }
  updateEnroll(id: number, progress: number, course_id: number, nextPosition: number, completed: boolean): Observable<any>{
    let obj = {id: id, progress: progress, course_id: course_id, nextPosition: nextPosition, completed: completed}
    return this.http.put(`${this.url}`, obj);
  }
  getAllEnroll(): Observable<Enrollments[]>{
    return this.http.get<Enrollments[]>(`${this.url}/all`);
  }
}
