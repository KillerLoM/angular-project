import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { AppService } from './app.service';
import { Observable } from 'rxjs';
import { User } from '../Model/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  token: String | null = null;
  getUserById() {
    throw new Error('Method not implemented.');
  }
  url = '';
  private baseUrl = 'http://localhost:9000/api/profile/me';
  constructor(
    @Inject(HttpClient)private http: HttpClient, 
    private appService: AppService) {
    
  }
  //chức năng của hàm là để gọi api đăng nhập
  login(email: any, password: any) { 
    this.url = this.appService.geturlLogin();  
    let obj = {email, password}; 
    return this.http.post(`${this.url}`, obj, { withCredentials: true }).pipe();
  }
  register(fullname: any, email: any, password: any, confirmPass: any): Observable<any> {
   
    let obj = {fullname, email, password, confirmPass,  userRole: "ROLE_STUDENT"};
    this.url = this.appService.getUrlSignUp();
    console.log(obj);
    return this.http.post(`${this.url}`, obj).pipe();
  }
  validateToken(obj: any): Observable<any> {
    let token = {token: obj};
   this.url = this.appService.getUrlValidate();
   return this.http.post(`${this.url}`, token).pipe();
  }
  logout(): Observable<any> {
    this.url = this.appService.getUrlLogout();
    return this.http.post(`${this.url}`, {}).pipe();
  }
  getUserProfile(): Observable<User> {
    // Lấy thông tin người dùng từ server
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<User>(`${this.baseUrl}`);
  }
}
