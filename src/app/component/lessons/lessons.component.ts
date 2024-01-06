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
import { PaginationService } from 'src/app/Service/pagination.service';
import { ReviewService } from 'src/app/Service/review.service';

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
  lastPageAvailabel = false;
  lessonId =  0;
  course: Course | null = null;
  lastSeekTime: number = 0;
  idActive: number | null = null;
  idReview = 0;
  newId: number | null = null;
  percentProgress: number = 0;
  titleForm = "Đánh giá khóa học";
  contentRating = "Điểm bạn cho chúng tôi là: "
  maxProgress: number ;
  firstInit = true;
  isEdit = false;
  isLoading = false;
  numberOfItemsPerPage = 10;
  currentPage = 0;
  indexActive: number;
  isRating : boolean = false;
  start = 0;
  contentReview = '';
  ratingReview = '';
  numberOfLessons : number = 10;
  isChecked: boolean = false;
  idDemo = 0;
  checkValid = false;
  videoUrl : string | null=null;
  loadMore = true;
  lecturer: string  = ' ';
  enroll : Enrollments | null = null;
  numberLessonsCompleted = 0;
  @ViewChild('myVideo') myVideo: ElementRef | undefined;
  @ViewChild('progressBar') progressBar: ElementRef | undefined;
  checkboxValue: boolean[] = [];
  progress: number = 0;
  categoryLessons = '';

  width: any;
  constructor(
     private lessonService: LessonsService,
      private route: ActivatedRoute,
    private                   courseService: CourseService,
    private appService: AppService,
    private shareService: ShareService,
    private enrollService: EnrollmentsService,
    private authService: AuthService,
    private paginationService: PaginationService,
    private reviewService: ReviewService,

  ) {
    this.idn = 1;
    this.indexActive = 0;
    this.maxProgress = 0; 
    this.loadMore = true; 
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
      setTimeout(() => {
        this.getAllLessons();
        this.getGoalsCourse();
        this.init();
      })

      setTimeout(() => {
        this.getStatusEnroll();
      }, 200)

      this.myVideo?.nativeElement.addEventListener('timeupdate', () =>
        this.updateProgress()
      );
    }
    },300)

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
    if (this.lessonId) {
      this.lessonService.getLessons(this.lessonId, this.currentPage).subscribe((data: any) => {
        this.lastPageAvailabel = data.getLessonsByCourseId.last;
        this.firstInit = data.getLessonsByCourseId.first;
        
        if (this.firstInit) {
          this.lessonsList = data.getLessonsByCourseId.content;
        } else {
          this.lessonsList?.push(...data.getLessonsByCourseId.content);
          console.log(this.lessonsList);
        }
  
        this.numberOfLessons = data.numberOfItems;
        this.checkboxValue = Array(this.numberOfLessons).fill(false);
      });
  
      this.courseService.getDetailsCourse(this.lessonId).subscribe((data: any) => {
        this.course = data;
        console.log(data);
        this.lecturer = data.name_user;
        this.categoryLessons = data.category;
      });
    }
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
      });
    }
    if(this.isEdit){
      this.contentRating = "Điểm mới: " ;
    }
  }

  
  handleClose(){
    this.isRating = false;
    this.currentPage = 0;
    this.getGoalsCourse();
    this.getAllLessons();
    setTimeout(() => {
      this.getStatusEnroll();
    }, 300)
  }
  handleRating(){
    if(this.lessonId){
      this.reviewService.getReviewMine(this.lessonId).subscribe((data: any) => {
         if(data.review == null){
          this.isEdit = false;

         }
         else{
          this.isEdit = true;
          this.contentReview = data.review.content;
          this.start = data.review.rating;
          this.titleForm = "Cập nhật nhận xét khóa học";
          this.idReview = data.review.id;
          this.contentRating = "Điểm lần trước: "
         }
      })
      this.isRating = true;
    }
    else{
      alert("Lỗi rồi đừng cố bấm vào mình nữa")
    }
  }
  ratingSend(){
    if( this.contentReview == '' ){
      this.appService.notiWarning("Thiếu góp ý","Bạn không muốn đóng góp ý kiến cho tụi mình sao");
      return;
    }
    if(this.lessonId || this.start){
      if(this.isEdit && this.idReview){
        this.reviewService.putReview(this.start, this.contentReview, this.lessonId, this.idReview).subscribe(data => {
          this.appService.notiSuccess("Thành công","Bạn đã cập nhật nhận xét về khóa học của chúng tôi");
          this.handleClose();
          return;
        })
      }
      if(this.idReview == 0 ){
        this.reviewService.postReview(this.start, this.contentReview, this.lessonId).subscribe((data: any) =>{
          this.appService.notiSuccess("Đã thêm lời nhận xét", "Chúng tôi xin chân thành cảm ơn ý kiến đóng góp của bạn.");
          this.handleClose();
        })
      }


    }
    
  }
  onScroll(){
    this.currentPage++;
    
    if(this.lastPageAvailabel != true){
      this.isLoading = true;
      setTimeout(() => {
        this.isLoading = false;
      }, 1000)
      this.getAllLessons();
      setTimeout(() => {
        this.getStatusEnroll();
      } , 100)

    }
    else{
      this.loadMore = false;
    }
  }
  CheckValid(){
    this.authService.getUserProfile().subscribe(data => {
      this.checkValid = true;
      return;
    });
  }

}
