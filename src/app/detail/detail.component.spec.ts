import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { AppService } from '../appService/app.service';

import { DetailComponent } from './detail.component';

describe('DetailComponent', () => {
  let component: DetailComponent;
  let fixture: ComponentFixture<DetailComponent>;
  let mockActivatedRoute: ActivatedRoute;
  let mockAppService: jasmine.SpyObj<AppService>;
  let questions = {
    results: [
      {
        category: 'multiple',
        correct_answer: 'hello',
        difficulty: 'average',
        incorrect_answers: ['one', 'two', 'three', 'four'],
        question: 'are we okay?',
        type: 'hmmm',
      },
      {
        category: 'boolean',
        correct_answer: 'again',
        difficulty: 'hard',
        incorrect_answers: ['five', 'six', 'seven', 'eight'],
        question: 'are we okay again?',
        type: 'olololo',
      },
    ],
    response_code: 1,
  };
  beforeEach(async () => {
    mockAppService = jasmine.createSpyObj(['decodeHtmlEntity', 'getQuestions']);
    mockActivatedRoute = {
      params: of({ difficulty: 'medium' }),
    } as unknown as ActivatedRoute;

    mockAppService.getQuestions.and.returnValue(of(questions));
    mockAppService.decodeHtmlEntity.and.callFake((value: string) => {
      return value;
    });

    await TestBed.configureTestingModule({
      declarations: [DetailComponent],
      providers: [
        { provide: AppService, useValue: mockAppService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it(`should retrieve params from the activated route`, () => {
    expect(component.level).toBe('medium');
  });

  it(`should call the qetquestions when initialized`, () => {
    spyOn(component, 'getQuestion');
    component.ngOnInit();

    expect(component.getQuestion).toHaveBeenCalled();
  });

  it(`should call the getQuestions method from the service when getQuestions is called`, () => {
    mockAppService.question = {
      category: null,
      type: null,
    };
    spyOn(component, 'manipulateQtn').and.returnValue(questions.results);

    component.getQuestion();

    expect(mockAppService.getQuestions).toHaveBeenCalled();
  });

  it(`should set the results array to the formatted response after calling the getQuestions method`, () => {
    mockAppService.question = {
      category: null,
      type: null,
    };
    spyOn(component, 'manipulateQtn').and.returnValue(questions.results);

    component.getQuestion();
    console.log(component.results[0].opt, 'from opt');
    expect(component.results[0].opt).toEqual([
      {
        content: [
          {
            text: 'one',
            selected: false,
            id: 0,
          },
        ],
      },
      {
        content: [
          {
            text: 'two',
            selected: false,
            id: 0,
          },
        ],
      },
      {
        content: [
          {
            text: 'three',
            selected: false,
            id: 0,
          },
        ],
      },
      {
        content: [
          {
            text: 'four',
            selected: false,
            id: 0,
          },
        ],
      },
      {
        content: [
          {
            text: 'hello',
            selected: false,
            id: 0,
          },
        ],
      },
    ]);
  });
});
