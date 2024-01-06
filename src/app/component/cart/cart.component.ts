import { Component, Inject, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Course } from 'src/app/Model/course';
import { AppService } from 'src/app/Service/app.service';
import { CartService } from 'src/app/Service/cart.service';
import { ShareService } from 'src/app/Service/shared/share.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
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
    private cartService: CartService,
    @Inject(Router) private router: Router){

    }
  ngOnInit(): void {

    this.getData();
  }
  getData(): void {
    this.cartService.getCartMine(this.currentPage).subscribe((data: any) => {
      this.numberOfPages = data.getAllMyCartItems.totalPages;
      this.isFirst = data.getAllMyCartItems.first;
      if(this.isFirst == true){
        this.listCourses = data.getAllMyCartItems.content;
      } else{
        this.listCourses?.push(...data.getAllMyCartItems.content);
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
