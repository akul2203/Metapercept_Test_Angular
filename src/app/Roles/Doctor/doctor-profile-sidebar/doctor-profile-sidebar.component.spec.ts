import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorProfileSidebarComponent } from './doctor-profile-sidebar.component';

describe('DoctorProfileSidebarComponent', () => {
  let component: DoctorProfileSidebarComponent;
  let fixture: ComponentFixture<DoctorProfileSidebarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DoctorProfileSidebarComponent]
    });
    fixture = TestBed.createComponent(DoctorProfileSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
