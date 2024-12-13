import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { OpenAIService } from './openai.service';  // Import the service
import { UserListComponent } from './user-list/user-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, UserListComponent],  
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

  constructor(private openAIService: OpenAIService) { }

  rateDish(dish: any) {
    dish.rating++;
    this.title = `You rated ${dish.name} ${dish.rating} times! 🍕`;
  }

  resetRatings() {
    this.categories.forEach(dish => dish.rating = 0);
    this.title = 'FoodRater 🍲';
  }

  // Method to call the OpenAI service and get a food suggestion
  async getFoodSuggestion() {
    this.aiResponse = await this.openAIService.getFoodSuggestion();
  }
}

