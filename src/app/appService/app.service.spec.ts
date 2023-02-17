import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { AppService } from './app.service';

describe('AppService', () => {
  let service: AppService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(AppService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should make a get request to  https://opentdb.com/api_category.php when getCategories is called', () => {
    service.getCategories().subscribe();

    const req = httpTestingController.expectOne(
      'https://opentdb.com/api_category.php'
    );

    expect(req).toBeTruthy();
  });

  it('should make a get request to  https://opentdb.com/api.php?amount=10&category=2&type=multiple&difficulty=10 when getQuestions is called', () => {
    service.getQuestions(2, 'multiple', '10').subscribe();

    const req = httpTestingController.expectOne(
      'https://opentdb.com/api.php?amount=10&category=2&type=multiple&difficulty=10'
    );

    expect(req).toBeTruthy();
  });

  it(`should transfrom the html entity to normal html`, () => {
    let res = service.decodeHtmlEntity('Sysiphus&#039;s');

    expect(res).toEqual("Sysiphus's");
  });
});
