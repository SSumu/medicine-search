import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpError } from './http-error';

describe('HttpError', () => {
  let component: HttpError;
  let fixture: ComponentFixture<HttpError>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpError],
    }).compileComponents();

    fixture = TestBed.createComponent(HttpError);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
