import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { AppService } from 'src/app/Service/app.service';
import { AuthService } from 'src/app/Service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent {
  hide = true;
  loading = false;
  progressValue: number | null = 0;
  isLogIn = true;
  isSignUp = false;
  icon = '';
  type = 'password'
  margin: any;
  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  passwordFormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(8),
  ]);
  myForm = new FormGroup({
    email: this.emailFormControl,
    password: this.passwordFormControl,
  });
  constructor(
    private toast: NgToastService,
    private router: Router,
    private authService: AuthService,
    private appService: AppService,
    private http: HttpClient) {
      this.loading = false;
  }
  handleSignUp() {
    this.isLogIn = false;
    this.isSignUp = true;
  }
  handleLogin(email: any, password: any, loginForm: NgForm) {
    email = email.value;
    password = password.value;
    if (loginForm.valid) {

      console.log(email);
      this.authService.login(email, password).subscribe((data: any ) =>{
        
        if(data.success == true){
          this.appService.notiSuccess("Bạn đã đăng nhập thành công","Chúc bạn có trải nghiệm tuyệt vời cùng FEDUCATION");
        }
        localStorage.setItem('token', data.token);
        this.loading = true;
        location.reload();
      },
      error =>{
        this.appService.notiError("OOPS! Lỗi rồi","Hình như bạn đã nhập sai email hoặc mật khẩu rồi. Bạn vui lòng kiểm tra lại nhé!");
      });
    }
    else{
        this.appService.notiError("OOPS! Lỗi rồi","Bạn đã không hoàn thành theo form đăng nhập yêu cầu");
    }
  }

}
