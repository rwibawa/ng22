import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {Home} from './home/home';

@Component({
  selector: 'app-root',
  imports: [Home], // [RouterOutlet],
  template: `
    <main>
      <header class="brand-name">
        <img class="brand-logo" src="/public/logo.svg" alt="logo" aria-hidden="true" />
      </header>
      <section class="content">
        <app-home />
      </section>
    </main>
  `,
  // templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  title = 'default';
  // protected readonly title = signal('ng22');
}
