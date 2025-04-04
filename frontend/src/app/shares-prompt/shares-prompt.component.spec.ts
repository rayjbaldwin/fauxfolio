import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharesPromptComponent } from './shares-prompt.component';

describe('SharesPromptComponent', () => {
  let component: SharesPromptComponent;
  let fixture: ComponentFixture<SharesPromptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharesPromptComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SharesPromptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
