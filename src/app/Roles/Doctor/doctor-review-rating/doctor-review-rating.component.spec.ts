import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorReviewRatingComponent } from './doctor-review-rating.component';

describe('DoctorReviewRatingComponent', () => {
  let component: DoctorReviewRatingComponent;
  let fixture: ComponentFixture<DoctorReviewRatingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DoctorReviewRatingComponent]
    });
    fixture = TestBed.createComponent(DoctorReviewRatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
