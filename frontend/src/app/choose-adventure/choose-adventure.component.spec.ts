import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseAdventureComponent } from './choose-adventure.component';

describe('ChooseAdventureComponent', () => {
  let component: ChooseAdventureComponent;
  let fixture: ComponentFixture<ChooseAdventureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChooseAdventureComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChooseAdventureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
