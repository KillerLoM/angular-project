import { NgModule } from '@angular/core';
import {
  FormControl,
  FormGroupDirective,
  NgForm,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { vi_VN } from 'ng-zorro-antd/i18n';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomePageComponent } from './home-page/home-page.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { LoginComponent } from './component/login/login.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { SignUPComponent } from './component/sign-up/sign-up.component';
import { NgToastModule } from 'ng-angular-popup'; // to be added
import { NgSwitch, NgSwitchCase, AsyncPipe } from '@angular/common';
import { CategoryComponent } from './component/category/category.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AppService } from './Service/app.service';
import { AuthService } from './Service/auth.service';
import { InterceptorService } from './Interceptor/interceptor.service';
import { AdvertisementComponent } from './component/advertisement/advertisement.component';
import { LessonsComponent } from './component/lessons/lessons.component';
import {MatRadioModule} from '@angular/material/radio';
import {ProgressSpinnerMode, MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatTabsModule} from '@angular/material/tabs';
import {MatListModule} from '@angular/material/list';
import { HighlightComponent } from './component/highlight/highlight.component';
import { NzSelectModule } from 'ng-zorro-antd/select';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { NzResultModule } from 'ng-zorro-antd/result';
import { ExceptionComponent } from './component/Exception/exception/exception.component';
import { NotFoundComponent } from './component/Exception/not-found/not-found.component';
import { DetailComponent } from './component/detail/detail.component';
import { BuyCourseComponent } from './component/buy-course/buy-course.component';
import {MatTableModule, MatTableDataSource} from '@angular/material/table';
import { InfiniteScrollModule } from "ngx-infinite-scroll";
import {MatCheckboxModule} from '@angular/material/checkbox';
import { SettingComponent } from './component/setting/setting.component';
import { AboutUsComponent } from './component/about-us/about-us.component';
import { MoreComponent } from './component/more/more.component';
@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    LoginComponent,
    SignUPComponent,
    CategoryComponent,
    AdvertisementComponent,
    LessonsComponent,
    HighlightComponent,
    ExceptionComponent,
    NotFoundComponent,
    DetailComponent,
    BuyCourseComponent,
    SettingComponent,
    AboutUsComponent,
    MoreComponent,
  ],
  providers: [
    AppService,
    AuthService,
    { provide: NZ_I18N, useValue: vi_VN },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorService,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
  imports: [
    BrowserModule,
    NgSwitch,
    NgSwitchCase,
    AppRoutingModule,
    MatProgressSpinnerModule,
    MatTableModule,
    BrowserAnimationsModule,
    MatAutocompleteModule,
    MatRadioModule,
    MatCheckboxModule,
    InfiniteScrollModule,
    MatSlideToggleModule,
    MatCardModule,
    MatButtonModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    NgToastModule,
    NzSelectModule,
    ReactiveFormsModule,
    FormsModule,
    MatProgressBarModule,
    MatExpansionModule,
    NzResultModule,
    HttpClientModule,
    MatTabsModule,
    MatListModule,
  ],
})
export class AppModule {}
