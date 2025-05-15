// Initializes a dynamic particles.js animation after view load, tears it down on destroy, and transitions to the auth page with a light-theme effect.


import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

declare const particlesJS: any;

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements AfterViewInit, OnDestroy {
  constructor(private router: Router) {}

  ngAfterViewInit(): void {
    console.log('particlesJS is', typeof particlesJS);
    if (typeof particlesJS === 'function') {
      particlesJS('particles-js', {
        particles: {
          number: { value: 50, density: { enable: true, value_area: 800 } },
          color: { value: '#4cd863' },
          shape: { type: 'circle' },
          opacity: { value: 0.5 },
          size: { value: 3, random: true },
          line_linked: {
            enable:   true,
            distance: 150,
            color:    '#fe3b2f',
            opacity:  0.4,
            width:    1
          },
          move: { enable: true, speed: 4, out_mode: 'out' }
        },
        interactivity: {
          detect_on: 'canvas',
          events: {
            onhover: { enable: true, mode: 'repulse' },
            onclick: { enable: true, mode: 'push' }
          },
          modes: {
            repulse: { distance: 200 },
            push: { particles_nb: 4 }
          }
        },
        retina_detect: true
      });
      console.log('particles initialized');
    } else {
      console.error('particlesJS isn’t loaded!');
    }
  }

  ngOnDestroy(): void {
    const domArray = (window as any).pJSDom as any[] | undefined;
    if (Array.isArray(domArray)) {
      domArray.forEach(p => p.pJS.fn.vendors.destroypJS());
      (window as any).pJSDom = [];
    }
  }

  goToAuth(): void {
    document.body.classList.add('light-theme');
    setTimeout(() => this.router.navigate(['/auth']), 2700);
  }
}
