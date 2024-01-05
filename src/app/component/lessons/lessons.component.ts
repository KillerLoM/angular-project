import {
  AfterContentInit,
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import { Course } from 'src/app/Model/course';
import { Goals } from 'src/app/Model/goals';
import { Lessons } from 'src/app/Model/lessons';
import { AppService } from 'src/app/Service/app.service';
import { CourseService } from 'src/app/Service/course.service';
import { LessonsService } from 'src/app/Service/lessons.service';
import { ShareService } from '../../../app/Service/shared/share.service';
import { Injectable } from '@angular/core';
import { EnrollmentsService } from 'src/app/Service/enrollments.service';
import { AuthService } from 'src/app/Service/auth.service';
import { Enrollments } from 'src/app/Model/enrollments';

@Injectable({
  providedIn: 'root',
})
@Component({
  selector: 'app-lessons',
  templateUrl: './lessons.component.html',
  styleUrls: ['./lessons.component.scss'],
})
export class LessonsComponent implements OnInit, AfterViewInit {
  color: ThemePalette = 'accent';
  mode: ProgressSpinnerMode = 'determinate';
  value = 50;
  idn: number | null = null;
  STT: number | null = null;
  lessonsList: Lessons[] | null = [];
  goalsList: Goals[] | null = [];
  lessonId: number | null = 0;
  course: Course | null = null;
  lastSeekTime: number = 0;
  idActive: number | null = null;
  newId: number | null = null;
  percentProgress: number = 0;
  maxProgress: number ;
  indexActive: number;
  isRating : boolean = false;
  start: number | null = 0;
  numberOfLessons : number = 10;
  isChecked: boolean = false;
  idDemo = 0;
  checkValid = false;
  videoUrl : string | null=null;
  lecturer: string  = ' ';
  enroll : Enrollments | null = null;
  numberLessonsCompleted = 0;
  @ViewChild('myVideo') myVideo: ElementRef | undefined;
  @ViewChild('progressBar') progressBar: ElementRef | undefined;
  checkboxValue: boolean[] = [];
  progress: number = 0;
width: any;
  constructor(
     private lessonService: LessonsService,
      private route: ActivatedRoute,
    private courseService: CourseService,
    private appService: AppService,
    private shareService: ShareService,
    private enrollService: EnrollmentsService,
    private authService: AuthService,

  ) {
    this.idn = 1;
    this.indexActive = 0;
    this.maxProgress = 0;  
  }
  ngAfterViewInit(): void {
    this.setupVideo();
  }
  ngOnInit() {
    this.CheckValid();
    setTimeout(() =>{
      if(this.checkValid == true) {
      this.route.paramMap.subscribe((params) => {
        const idParam = params.get('id') ?? null;
        if (idParam !== null) {
          this.lessonId = +idParam;
        } else {
          console.error('No lesson ID found in the URL.');
        }
      });
      this.getAllLessons();
      this.getGoalsCourse();
      this.init();
      this.getStatusEnroll();
      this.myVideo?.nativeElement.addEventListener('timeupdate', () =>
        this.updateProgress()
      );
    }
    },500)

  }
  getStatusEnroll(){
    if(this.lessonId)
    this.enrollService.getFromCourse(this.lessonId).subscribe((data: Enrollments) => {
      this.enroll = data;
      if(data.progress > this.numberOfLessons){
        this.appService.notiSuccess('Đã hoàn thành kháo học','Hoàn thành khóa học');
        this.checkboxValue = Array(this.numberOfLessons).fill(true);
      }
      else{
        for(let i = 1; i< data.nextPosition; i++){
          this.checkboxValue[i-1] = true;
          this.percentProgress = (data.progress - 1)/this.numberOfLessons * 100;
          this.numberLessonsCompleted = data.progress
        } 
      }
})}
  updateProgress() {
    const video = this.myVideo?.nativeElement;
    const progressBar = this.progressBar?.nativeElement;

    this.progress = Math.floor((video.currentTime / video.duration) * 100);
    if (
      video.currentTime > this.lastSeekTime &&
      Math.abs(video.currentTime - this.lastSeekTime) > 6
    ) {
      video.pause();
       video.currentTime = this.lastSeekTime;
        alert('Bạn đừng tua quá nhanh kẻo miss kiến thức nhé');
        video.play();
    }
    
    if (this.progress > this.maxProgress) {
      this.maxProgress = this.progress;
      progressBar.value = this.progress;
    }

    if (this.progress >= this.maxProgress) {
      progressBar.value = this.progress;
    } 
    if(progressBar.value < this.maxProgress) {
      progressBar.value = this.maxProgress;
    }
    this.lastSeekTime = video.currentTime;
  }
  toggleCheckbox() {
    this.isChecked = !this.isChecked;
  }
  getAllLessons() {
    if (this.lessonId)
      this.lessonService.getLessons(this.lessonId).subscribe((data: any) => {
        this.lessonsList = data.getLessonsByCourseId.content[0];
        console.log(data.getLessonsByCourseId.content);
        this.numberOfLessons = data.numberOfItems;
        this.checkboxValue = Array(this.numberOfLessons).fill(false);
        if (data.getLessonsByCourseId.content)
          this.lessonsList = data.getLessonsByCourseId.content;
      });
    if (this.lessonId)
      this.courseService
        .getDetailsCourse(this.lessonId)
        .subscribe((data: any) => {
          this.course = data;
          console.log(data);
          this.lecturer = data.name_user;
        });
  }
  getGoalsCourse(){
    if(this.lessonId){
      this.courseService.getObjectiveCourse(this.lessonId).subscribe((data: any) => {
        this.goalsList = data.getCourseObjectives;
        console.log(this.goalsList);
      },
      Error =>{
        console.log(Error.message);
      })
      console.log(this.goalsList);
    }   
  }
  checkNetworkSpeed() {
    const isSlowNetwork = true; 
    return isSlowNetwork;
  }
  updateVideoResolution() {
    if(this.myVideo){
      const videoElement: HTMLVideoElement = this.myVideo.nativeElement;

      if (this.checkNetworkSpeed()) {
        videoElement.width = 720;
        videoElement.height = 480;
      } else {
        videoElement.width = 1280;
        videoElement.height = 720;
      }
    }
  }
  setupVideo() {
    if(this.myVideo){
      const videoElement: HTMLVideoElement = this.myVideo.nativeElement;
      videoElement.addEventListener('play', () => this.updateVideoResolution());
    }

  }
  handleInput(id: any, position: number,event: Event) {
    const video = this.myVideo?.nativeElement;
    const checkbox = event.target as HTMLInputElement;
    let btn = document.getElementById(id) as HTMLInputElement;
    const isChecked = checkbox.checked;

    if (id != this.idActive && isChecked == true) {
      btn.click();
      video.pause();
      alert('Bạn vui lòng học cho xong bài hiện tại');
      return;
    }
    if (this.progress < 90 && isChecked == true && id == this.idActive) {
      btn.click();

      video.pause()
      alert(

        'Bạn chưa hoàn thành xem video. Hãy xem video cho đến khi đạt đủ 90% để kết thúc bài học'
      );
      video.play();
      return;
    }
    if(this.enroll && this.lessonId){
      if(position - this.enroll.progress >= 2){
        video.pause();
        alert("Bạn nên hoàn thành bài học theo thứ tự mà giảng viên đưa ra");
        this.appService.notiWarning("Dỗi","Tiến độ học của bạn sẽ không được lưu lại trên hệ thống của chúng tôi");
        video.play();
        return;
      }
        else{
          let isCompleted = ((position + 1) - this.numberOfLessons) > 0 ? true: false; 
          this.enrollService.updateEnroll(this.enroll.id, position, this.lessonId, position+1, isCompleted).subscribe((data: any)=>{
            console.log(data);
            this.appService.notiSuccess("Thành công","Đã cập nhật thành công tiến độ học tập");
          })
        }

    
    }
  }
  handleClick(id: number, index: number) {
    if(this.newId == id){
      return;
    }

    this.newId = id;
    this.reset();
    this.idActive = id;
    this.indexActive = index;
    if(this.lessonsList)
    this.videoUrl = this.lessonsList[index].video_url;
    this.setActive();
  }
  ngAfterViewChecked(): void {
    if (this.newId == null) {
      this.init();
    }
    if (this.newId != null) {
      return;
    }
  }
  setActive() {
    if (this.lessonsList) {
      if (this.indexActive >= 0) {
        if (this.lessonsList[this.indexActive]) {
          this.idActive = this.lessonsList[this.indexActive].id;
        }
        let btn = document.getElementById(this.indexActive?.toString());
        if (btn) {
          btn.classList.add('active');
          btn.removeAttribute('type');
        }
      }
    }
  }
 reset() {
  if (this.indexActive == 0) {
    let btn = document.getElementById('0');
    if (btn) {
      btn.classList.remove('active');
      btn.removeAttribute('type');
    }
  }
  if (this.indexActive) {
    let btn = document.getElementById(this.indexActive.toString());
    if (btn) {
      btn.classList.remove('active');
      btn.removeAttribute('type');
    }
  }
}
  init() {
    if (this.lessonsList) {
      if (this.lessonsList[0]) {
        this.idActive = this.lessonsList[0].id;
        this.videoUrl = this.lessonsList[0].video_url;
        console.log(this.videoUrl);
      }
      let btn = document.getElementById('0');
      if (btn) {
        btn.classList.add('active');
        btn.removeAttribute('type');
      }
    }
    this.newId = this.idActive;
  }
  handleHover(e: Event) {
    console.log(e.target);
    let stars = document.querySelectorAll('input[type="radio"]');
    let showValue = document.querySelector('#rating-value');
  
    for (let i = 0; i < stars.length; i++) {
      stars[i].addEventListener('click', (event) => {
        let rating = parseFloat((<HTMLInputElement>event.target).value);
        this.start = rating;
        if (showValue) {
          showValue.innerHTML = rating + " trên 5 sao";
        }
      });
    }
  }
  
  
  handleClose(){
    this.isRating = false;
  }
  handleRating(){
    this.isRating = true
  }
  ratingSend(message: string){
    if(message == ''){
      this.appService.notiWarning("Thiếu góp ý","Bạn không muốn đóng góp ý kiến cho tụi mình sao");
      return;
    }
    
  }
  CheckValid(){
    this.authService.getUserProfile().subscribe(data => {
      this.checkValid = true;
      return;
      alert(1);
    });
  }

}
