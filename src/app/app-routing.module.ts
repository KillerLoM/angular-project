import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { CategoryComponent } from './component/category/category.component';
import { LessonsComponent } from './component/lessons/lessons.component';

const routes: Routes = [
{  path: '',
    component: HomePageComponent,
    title: 'FEDUCATION',
  },
  {
    path: 'category/:category',
    component: CategoryComponent,
    title: 'FEDUCATION',
  },
  {
    path: 'lessons/:id',
    component: LessonsComponent,
    title: 'FEDUCATION',
  },


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
