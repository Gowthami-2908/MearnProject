import { Routes } from '@angular/router';
import { RecipeSearchComponent } from './components/recipe-search/recipe-search.component';

export const routes: Routes = [
  { path: '', component: RecipeSearchComponent },
  { path: '**', redirectTo: '' }
];
