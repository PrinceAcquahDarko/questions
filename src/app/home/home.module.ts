import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DifficultyPipe } from '../difficulty.pipe';
const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
];

@NgModule({
  declarations: [HomeComponent, DifficultyPipe],
  imports: [CommonModule, FormsModule, RouterModule.forChild(routes)],
})
export class HomeModule {}
