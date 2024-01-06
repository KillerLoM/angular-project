import { Component, Inject, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Course } from 'src/app/Model/course';
import { AppService } from 'src/app/Service/app.service';
import { ShareService } from 'src/app/Service/shared/share.service';
import { WishlistService } from 'src/app/Service/wishlist.service';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss']
})
export class WishlistComponent implements OnInit {
  displayedColumns = [
    'title',
    'subtitle',
    'category',
    'rating',
    'price',
    'avatar',
    'handle',
  ];
  listCourses : Course[] =[];
  data : Course[] = [];
  loadMore = true;
  currentPage = 0;
  numberOfElements = 5;
  numberOfPages = 0;
  isLast = false;
  dataSource: MatTableDataSource<Course> = new MatTableDataSource<Course>();

  isFirst = true;
  constructor(
    private shareService: ShareService,
    public appService: AppService,
    private wishListService: WishlistService,
    @Inject(Router) private router: Router){

    }
  ngOnInit(): void {

    this.getData();
  }
  getData(): void {
    this.wishListService.getWishList(this.currentPage).subscribe((data: any) => {
      this.numberOfPages = data.getMyWishlistPaged.totalPages;
      this.isFirst = data.getMyWishlistPaged.first;
      if(this.isFirst == true){
        this.listCourses = data.getMyWishlistPaged.content;
      } else{
        this.listCourses?.push(...data.getMyWishlistPaged.content);
      }
      if(this.dataSource)
      this.dataSource.data = this.listCourses;
      console.log(this.listCourses);
    })
  }
  handleSendData(id: number): void{
    this.shareService.setIdDetail(id);
    this.router.navigate(['']);
  }
  onScroll(){
    this.currentPage++;
    if(this.currentPage < this.numberOfPages ){
        this.getData();
      return;
    }
    else{
      this.currentPage = 0;
      return;
    }
  }
}
