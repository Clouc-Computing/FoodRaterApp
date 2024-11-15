import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Make sure CommonModule is imported

@Component({
  selector: 'app-root',
  standalone: true,  // Keep the component standalone
  imports: [CommonModule],  // Add CommonModule here
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'FoodRater 🍲';
  categories = [
    { name: 'Pasta', rating: 0 },
    { name: 'Pizza', rating: 0 },
    { name: 'Sushi', rating: 0 },
    { name: 'Tacos', rating: 0 },
    { name: 'Burgers', rating: 0 },
  ];

  aiResponse: string | null = null;  // Store the AI suggestion

  // Method to update the rating for a dish
  rateDish(dish: any) {
    dish.rating++;
    this.title = `You rated ${dish.name} ${dish.rating} times! 🍕`;
  }

  // Method to reset all ratings
  resetRatings() {
    this.categories.forEach(dish => dish.rating = 0);
    this.title = 'FoodRater 🍲';
  }

  // Add this method to handle AI food suggestions
  getFoodSuggestion() {
    // Simple logic to return a suggestion, this could be replaced with an API call
    const suggestions = [
      'Try a spicy curry with rice 🍛',
      'How about a sweet and sour soup 🍲',
      'Pasta with garlic bread 🍝🍞',
      'A big juicy burger 🍔 with fries 🍟',
      'Fresh sushi rolls 🍣 with wasabi'
    ];

    // Randomly pick a suggestion from the list
    const randomIndex = Math.floor(Math.random() * suggestions.length);
    this.aiResponse = suggestions[randomIndex];
  }
}

