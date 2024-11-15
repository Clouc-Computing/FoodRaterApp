import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';  // Import CommonModule for ngFor

@Component({
  selector: 'app-root',
  standalone: true,  // Keep the component standalone
  imports: [CommonModule],  // Add CommonModule here
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'FoodRater 🍲';  // Static app title
  categories = [
    { name: 'Pasta', rating: 0 },
    { name: 'Pizza', rating: 0 },
    { name: 'Sushi', rating: 0 },
    { name: 'Tacos', rating: 0 },
    { name: 'Burgers', rating: 0 },
  ];

  // Method to update the rating for a dish
  rateDish(dish: any) {
    dish.rating++;
    this.title = `You rated ${dish.name} ${dish.rating} times! 🍕`;  // Dynamic title change
  }

  // Method to reset all ratings
  resetRatings() {
    this.categories.forEach(dish => dish.rating = 0);
    this.title = 'FoodRater 🍲';  // Reset to default title
  }
}
