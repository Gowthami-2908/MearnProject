import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

export interface Recipe {
  id: number;
  title: string;
  image: string;
  usedIngredientCount: number;
  missedIngredientCount: number;
  likes: number;
}

export interface RecipeDetails extends Recipe {
  instructions: string;
  summary: string;
  readyInMinutes: number;
  servings: number;
  sourceUrl: string;
}

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  searchRecipesByIngredients(ingredients: string): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(`${this.apiUrl}/recipes/findByIngredients`, {
      params: { ingredients }
    }).pipe(
      catchError(this.handleError)
    );
  }

  getRecipeDetails(id: number): Observable<RecipeDetails> {
    return this.http.get<RecipeDetails>(`${this.apiUrl}/recipes/${id}/information`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
} 