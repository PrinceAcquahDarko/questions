import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { AppService } from '../appService/app.service';
import { Icontent, Iresults } from '../interface';
import { style, transition, trigger, animate } from '@angular/animations';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
  animations: [
    trigger('enterAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('700ms', style({ opacity: 1 })),
      ]),
    ]),
  ],
})
export class DetailComponent implements OnInit {
  showButton = false;
  results: Iresults[] = [];
  showResults = false;
  level!: string;
  total_results!: number;
  constructor(private route: ActivatedRoute, private _as: AppService) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.level = params['difficulty'];
      this.getQuestion();
    });
  }

  getQuestion() {
    this._as
      .getQuestions(
        this._as.question.category,
        this._as.question.type,
        this.level
      )
      .pipe(
        map((response) => {
          const questions = response['results'].map((question: Iresults) => {
            return {
              ...question,
              question: this._as.decodeHtmlEntity(question['question']),
              correct_answer: this._as.decodeHtmlEntity(
                question['correct_answer']
              ),
              incorrect_answers: question['incorrect_answers'].map(
                (answer: string) => this._as.decodeHtmlEntity(answer)
              ),
            };
          });

          return questions;
        })
      )
      .subscribe((response) => {
        let res = this.manipulateQtn(response);
        res.forEach((i, index) => {
          if (index === 0) {
            i.show = true;
          } else {
            i.show = false;
          }
          i.opt = [];
          i.id = index;
          i.incorrect_answers.forEach((incorrect) => {
            i.opt?.push({
              content: [
                {
                  text: incorrect,
                  selected: false,
                  id: index,
                },
              ],
            });
          });

          i.opt.push({
            content: [
              {
                text: i.correct_answer,
                selected: false,
                id: index,
              },
            ],
          });
        });

        this.results = res;
      });
  }

  selectOption(options: Icontent, results: Iresults) {
    if (!this.showResults) {
      let responds = this.results.filter((i) => i.id === options.id);
      responds.forEach((res) => {
        res.opt?.forEach((re) => {
          re.content.forEach((con) => {
            if (con.text === options.text) {
              con.selected = true;
              if (options.text === res.correct_answer) {
                res.correct = true;
              } else {
                res.correct = false;
              }
            } else {
              con.selected = false;
            }
          });
        });
      });

      let index = this.results.findIndex((i) => i.id === results.id);
      try {
        this.results[index + 1].show = true;
      } catch (error) {
        this.showButton = true;
      }
    }
  }

  //so this is basically to set the question that was selected as the first question
  manipulateQtn(res: Iresults[]) {
    let response;
    let index = res.findIndex(
      (i) => i.question === this._as.selectedQuestion.question
    );

    if (index !== -1) {
      response = res.filter(
        (i) => i.correct_answer !== this._as.selectedQuestion.correct_answer
      );

      response[0] = this._as.selectedQuestion;
    } else {
      res[0] = this._as.selectedQuestion;
      response = res;
    }

    return response;
  }

  submitAnswers() {
    this.showResults = true;
    this.total_results = this.results.filter((i) => i.correct).length;
  }
}
