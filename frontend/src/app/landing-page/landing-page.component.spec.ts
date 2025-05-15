import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';

import { LandingPageComponent } from './landing-page.component';

describe('LandingPageComponent', () => {
  let fixture: ComponentFixture<LandingPageComponent>;
  let component: LandingPageComponent;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    (window as any).particlesJS = jasmine.createSpy('particlesJS');
    (window as any).pJSDom = [
      { pJS: { fn: { vendors: { destroypJS: jasmine.createSpy('destroypJS') } } } }
    ];



    TestBed.configureTestingModule({
      imports: [LandingPageComponent],
      providers: [
        { provide: Router, useValue: routerSpy }
      ]
    });

    fixture = TestBed.createComponent(LandingPageComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should initialize particlesJS if available', () => {
    component.ngAfterViewInit();
    expect((window as any).particlesJS)
      .toHaveBeenCalledWith('particles-js', jasmine.any(Object));
  });

  it('should destroy all pJS instances on destroy', () => {
    component.ngOnDestroy();

    const entry = (window as any).pJSDom[0];
    expect(entry.pJS.fn.vendors.destroypJS).toHaveBeenCalled();

    expect((window as any).pJSDom).toEqual([]);
  });

  it('should add light-theme and navigate after delay', fakeAsync(() => {
    component.goToAuth();

    expect(document.body.classList).toContain('light-theme');
    tick(2700);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/auth']);
  }));
});
