import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs';
import { AppService } from '../appService/app.service';
import { Icategories, Iquestions, Iresults } from '../interface';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  question: Iquestions = {
    category: null,
    type: null,
  };
  categories!: Icategories[];
  results: Iresults[] = [];
  constructor(private _as: AppService, private _router: Router) {}

  ngOnInit(): void {
    this._as
      .getCategories()
      .pipe(map((x) => x.trivia_categories))
      .subscribe((res) => {
        this.categories = res;
        console.log(res, 'from respond');
      });
  }

  submitQuestion() {
    if (this.question.type === null || this.question.category === null) {
      alert('please select options and proceed');
    }
    this._as
      .getQuestions(this.question.category, this.question.type)
      .pipe(map((x) => x.results))
      .subscribe((res) => {
        // this.categories = res;
        console.log(res, 'from resquestpond');
        this.results = res;
      });
  }

  routeToDetail(difficulty: string) {
    this._router.navigate(['questions', difficulty]);
  }
}
