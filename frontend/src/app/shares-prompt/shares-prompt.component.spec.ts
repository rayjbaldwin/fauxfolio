import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SharesPromptComponent } from './shares-prompt.component';

describe('SharesPromptComponent', () => {
  let component: SharesPromptComponent;
  let fixture: ComponentFixture<SharesPromptComponent>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<SharesPromptComponent>>;

  beforeEach(async () => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [SharesPromptComponent],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy },
        {
          provide: MAT_DIALOG_DATA,
          useValue: { ticker: 'TEST', shares: undefined }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SharesPromptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should default shares to 1 when data.shares is undefined', () => {
    expect(component.shares).toBe(1);
  });

  it('onCancel should close dialog without data', () => {
    component.onCancel();
    expect(dialogRefSpy.close).toHaveBeenCalledWith();
  });

  it('onConfirm should close with shares when shares > 0', () => {
    component.shares = 5;
    component.onConfirm();
    expect(dialogRefSpy.close).toHaveBeenCalledWith(5);
  });

  it('onConfirm should alert and not close when shares <= 0', () => {
    spyOn(window, 'alert');
    component.shares = 0;
    component.onConfirm();
    expect(window.alert).toHaveBeenCalledWith('Please enter a valid number of shares.');
    expect(dialogRefSpy.close).not.toHaveBeenCalled();
  });
});
