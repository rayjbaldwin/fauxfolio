import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleAuthComponent } from './single-auth.component';

describe('SingleAuthComponent', () => {
  let component: SingleAuthComponent;
  let fixture: ComponentFixture<SingleAuthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SingleAuthComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SingleAuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
