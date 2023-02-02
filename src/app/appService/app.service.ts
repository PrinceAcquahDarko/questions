import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { IGetQuestions, question, Iquestions, Iresults } from '../interface';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  category_url = 'https://opentdb.com/api_category.php';
  questions_url = 'https://opentdb.com/api.php';
  question: Iquestions = {
    category: null,
    type: null,
  };

  selectedQuestion!: Iresults;

  constructor(private http: HttpClient) {}

  getCategories(): Observable<IGetQuestions> {
    return this.http
      .get<IGetQuestions>(this.category_url)
      .pipe(catchError(this.handleError));
  }

  getQuestions(
    category: number | null,
    typeOfQuestion: number | null,
    level: string | null
  ): Observable<question> {
    let params = new HttpParams();
    params = params.append('amount', 10);
    if (category) {
      params = params.append('category', category);
    }
    if (typeOfQuestion) {
      params = params.append('type', typeOfQuestion);
    }

    if (level) {
      params = params.append('difficulty', level);
    }

    return this.http
      .get<question>(this.questions_url, { params })
      .pipe(catchError(this.handleError));
  }

  handleError(err: HttpErrorResponse) {
    let message = '';

    if (err.error instanceof ErrorEvent) {
      message = `an error occured: ${err.error.message}`;
    } else {
      message = err.error;
    }

    return throwError(message);
  }

  decodeHtmlEntity(str: string) {
    const txt = document.createElement('textarea');
    txt.innerHTML = str;

    return txt.value;
  }
}
