import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RecipeSearchComponent } from './components/recipe-search/recipe-search.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RecipeSearchComponent],
  template: `
    <div class="app-container">
      <app-recipe-search></app-recipe-search>
    </div>
  `,
  styles: [`
    .app-container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }
  `]
})
export class AppComponent {
  title = 'Recipe Finder';
}
