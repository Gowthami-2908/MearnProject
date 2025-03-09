import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RecipeService } from '../../services/recipe.service';

@Component({
  selector: 'app-recipe-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="recipe-search-container">
      <h1>Recipe Finder 🍽️</h1>
      <div class="search-box">
        <input
          type="text"
          [(ngModel)]="ingredients"
          placeholder="Enter ingredients (comma separated)"
          class="search-input"
          (keyup.enter)="searchRecipes()"
        />
        <button (click)="searchRecipes()" class="search-button" [disabled]="loading">
          {{ loading ? 'Searching...' : 'Search Recipes' }}
        </button>
      </div>

      <div class="recipes-grid" *ngIf="recipes.length > 0">
        <div *ngFor="let recipe of recipes" class="recipe-card">
          <img [src]="recipe.image" [alt]="recipe.title" class="recipe-image"/>
          <div class="recipe-content">
            <h3>{{ recipe.title }}</h3>
            <p>Used Ingredients: {{ recipe.usedIngredientCount }}</p>
            <p>Missing Ingredients: {{ recipe.missedIngredientCount }}</p>
            <button (click)="viewRecipeDetails(recipe.id)" class="view-details-button">
              View Details
            </button>
          </div>
        </div>
      </div>

      <div *ngIf="loading" class="loading">
        <p>Searching for recipes... 🔍</p>
      </div>

      <div *ngIf="error" class="error">
        <p>{{ error }}</p>
      </div>

      <div *ngIf="!loading && !error && recipes.length === 0 && searched" class="no-results">
        <p>No recipes found. Try different ingredients! 🌿</p>
      </div>
    </div>
  `,
  styles: [`
    .recipe-search-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }

    h1 {
      text-align: center;
      color: #333;
      margin-bottom: 30px;
    }

    .search-box {
      display: flex;
      gap: 10px;
      margin-bottom: 30px;
    }

    .search-input {
      flex: 1;
      padding: 12px;
      border: 2px solid #ddd;
      border-radius: 8px;
      font-size: 16px;
      transition: border-color 0.3s;
    }

    .search-input:focus {
      outline: none;
      border-color: #4CAF50;
    }

    .search-button {
      padding: 12px 24px;
      background-color: #4CAF50;
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-size: 16px;
      transition: background-color 0.3s;
    }

    .search-button:hover:not(:disabled) {
      background-color: #45a049;
    }

    .search-button:disabled {
      background-color: #cccccc;
      cursor: not-allowed;
    }

    .recipes-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 20px;
      margin-top: 20px;
    }

    .recipe-card {
      border: 1px solid #ddd;
      border-radius: 8px;
      overflow: hidden;
      transition: transform 0.3s, box-shadow 0.3s;
      background: white;
    }

    .recipe-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    }

    .recipe-image {
      width: 100%;
      height: 200px;
      object-fit: cover;
    }

    .recipe-content {
      padding: 15px;
    }

    .recipe-card h3 {
      margin: 0 0 10px 0;
      font-size: 18px;
      color: #333;
    }

    .recipe-card p {
      margin: 5px 0;
      color: #666;
    }

    .view-details-button {
      width: 100%;
      padding: 10px;
      background-color: #2196F3;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.3s;
      margin-top: 10px;
    }

    .view-details-button:hover {
      background-color: #1976D2;
    }

    .loading, .error, .no-results {
      text-align: center;
      padding: 20px;
      margin-top: 20px;
    }

    .loading {
      color: #666;
    }

    .error {
      color: #f44336;
      background-color: #ffebee;
      border-radius: 4px;
    }

    .no-results {
      color: #666;
      font-style: italic;
    }

    @media (max-width: 600px) {
      .search-box {
        flex-direction: column;
      }
      
      .search-button {
        width: 100%;
      }
    }
  `]
})
export class RecipeSearchComponent {
  ingredients: string = '';
  recipes: any[] = [];
  loading: boolean = false;
  error: string = '';
  searched: boolean = false;

  constructor(private recipeService: RecipeService) {}

  searchRecipes() {
    if (!this.ingredients.trim()) {
      this.error = 'Please enter at least one ingredient';
      return;
    }

    this.loading = true;
    this.error = '';
    this.recipes = [];
    this.searched = true;

    this.recipeService.searchRecipesByIngredients(this.ingredients)
      .subscribe({
        next: (data) => {
          this.recipes = data;
          this.loading = false;
          if (data.length === 0) {
            this.error = 'No recipes found with these ingredients. Try different ones!';
          }
        },
        error: (error) => {
          console.error('Error fetching recipes:', error);
          this.error = 'Error fetching recipes. Please try again.';
          this.loading = false;
        }
      });
  }

  viewRecipeDetails(id: number) {
    this.recipeService.getRecipeDetails(id)
      .subscribe({
        next: (data) => {
          // Here you can implement a modal or navigation to show recipe details
          console.log('Recipe details:', data);
        },
        error: (error) => {
          console.error('Error fetching recipe details:', error);
          this.error = 'Error fetching recipe details.';
        }
      });
  }
} 