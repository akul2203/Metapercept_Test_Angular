import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfiledialogboxComponent } from './profiledialogbox.component';

describe('ProfiledialogboxComponent', () => {
  let component: ProfiledialogboxComponent;
  let fixture: ComponentFixture<ProfiledialogboxComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProfiledialogboxComponent]
    });
    fixture = TestBed.createComponent(ProfiledialogboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
