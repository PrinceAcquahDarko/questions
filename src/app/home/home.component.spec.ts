import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { AppService } from '../appService/app.service';

import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let mockAppService: jasmine.SpyObj<AppService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let obj = {
    trivia_categories: [
      {
        id: 1,
        name: 'prince',
      },
      {
        id: 2,
        name: 'Hello',
      },
    ],
  };
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
    ],
    response_code: 1,
  };
  beforeEach(async () => {
    mockAppService = jasmine.createSpyObj([
      'getCategories',
      'decodeHtmlEntity',
      'getQuestions',
    ]);

    mockRouter = jasmine.createSpyObj(['navigate']);

    mockAppService.getCategories.and.returnValue(of(obj));
    mockAppService.getQuestions.and.returnValue(of(questions));
    mockAppService.decodeHtmlEntity.and.callFake((value: string) => {
      return value;
    });

    await TestBed.configureTestingModule({
      declarations: [HomeComponent],
      imports: [FormsModule],
      providers: [
        { provide: AppService, useValue: mockAppService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should set the categories array on to their trivia_categories from the service on first load', () => {
    expect(component.categories).toEqual(obj.trivia_categories);
  });

  it(`should populate the select tag with the categories array`, () => {
    fixture.detectChanges();

    const select = fixture.nativeElement.querySelector('select');
    const options = select.children;

    //Greater than 2 because the first is hard coded
    expect(options.length).toBeGreaterThan(2);
  });

  it(`should set the question.category property on the component to the option that was selected in the select tag`, () => {
    fixture.detectChanges();
    const select = fixture.nativeElement.querySelector('select');
    select.selectedIndex = 1;

    select.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(+component.question.category!).toEqual(obj.trivia_categories[0].id);
  });

  //so next would be the based on the top ones we work on the submit buttons
  it(`should raise an alert with a message 'please select options and proceed', when the user clicks on the submit button without selecting a category`, () => {
    const button = fixture.nativeElement.querySelector('#qetQuestions');
    spyOn(window, 'alert');
    button.click();

    expect(window.alert).toHaveBeenCalledWith(
      'please select options and proceed'
    );
  });

  it(`should call the service when category  and type of questions are selected `, () => {
    const select = fixture.nativeElement.querySelector('select');
    select.selectedIndex = 1;

    select.dispatchEvent(new Event('change'));

    const typeOfQtns = fixture.nativeElement.querySelector('#typeInput');
    typeOfQtns.selectedIndex = 1;

    typeOfQtns.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('#qetQuestions');
    button.click();

    expect(mockAppService.getQuestions).toHaveBeenCalled();
  });

  it(`should set the results array to value of the response from the service after clicking submit button`, (done) => {
    const select = fixture.nativeElement.querySelector('select');
    select.selectedIndex = 1;

    select.dispatchEvent(new Event('change'));

    const typeOfQtns = fixture.nativeElement.querySelector('#typeInput');
    typeOfQtns.selectedIndex = 1;

    typeOfQtns.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('#qetQuestions');
    button.click();
    done();

    expect(component.results).toEqual(questions.results);
  });

  it(`should set call the router.navigate method when routeToDetail is called`, () => {
    mockAppService.question = {
      category: null,
      type: null,
    };
    const select = fixture.nativeElement.querySelector('select');
    select.selectedIndex = 1;

    select.dispatchEvent(new Event('change'));

    const typeOfQtns = fixture.nativeElement.querySelector('#typeInput');
    typeOfQtns.selectedIndex = 2;

    typeOfQtns.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    component.routeToDetail(questions.results[0]);

    expect(mockRouter.navigate).toHaveBeenCalled();
    expect(+mockAppService.question.category!).toBe(1);
    expect(mockAppService.question.type).toBe("multiple");
  });
});
