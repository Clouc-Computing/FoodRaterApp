import { Component, OnInit } from '@angular/core';
import { OpenAIService } from '../openai.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})

export class UserListComponent {
  formattedAiSteps: string[] | null = null;
  successMessageUser: string = '';
  errorMessageUser: string = '';
  successMessageFood: string = '';
  errorMessageFood: string = '';
  users: any[] = [];
  items: any[] = [];
  newUser = { username: '', email: '', password: '' };
  newFoodItem = { name: '', description: '' };
  aiResponse: string = '';
  constructor(private apiService: OpenAIService) { }

  fetchUsers(): void {
    this.apiService.getMainResource()
      .then((response: any) => {
        this.users = response.data.users.users; 
	console.log("User data: ", this.users);
      })
      .catch((error: any) => {
        console.error('Error fetching users:', error);
        this.errorMessageUser = 'Failed to load users';
      });
  }

  fetchItems(): void {
    this.apiService.getMainResource()
      .then((response: any) => {
        this.items = response.items.items;
      })
      .catch((error: any) => {
        console.error('Error fetching items:', error);
        this.errorMessageFood = 'Failed to load items';
      });
  }
  submitUserForm(event: Event): void {
    event.preventDefault(); // Prevent the default form submission
    this.apiService.createUser(this.newUser)
      .then((response) => {
        this.successMessageUser = 'User created successfully!';
        this.errorMessageUser = '';
        console.log('Response:', response);
        this.newUser = { username: '', email: '', password: '' }; 
      })
      .catch((error) => {
        this.successMessageUser = '';
        this.errorMessageUser = 'Failed to create user.';
        console.error('Error:', error);
      });
  }

submitFoodForm(event: Event): void {
  event.preventDefault(); // Prevent default form submission
  this.apiService.addFoodItem(this.newFoodItem)
    .then((response: any) => {
      this.successMessageFood = 'Food item added successfully!';
      this.errorMessageFood = '';
      console.log('Response:', response);
      console.log(this.successMessageFood)
      this.apiService.fetchItems();
      const userMessage = 'Give me a detailed recipe with measurements to ' + this.newFoodItem.name + 'with this description' + this.newFoodItem.description;
      console.log(userMessage)
      this.apiService.getUserFoodSuggestion(userMessage)
        .then((aiResponse: string) => {
          this.formatAiResponse(aiResponse);
          console.log('AI Response:', aiResponse);
        })
        .catch((error: any) => {
          console.error('Error in AI response:', error);
        }); 
    })
    .catch((error: any) => {
      this.successMessageFood = '';
      this.errorMessageFood = 'Failed to add food item.';
      console.error('Error:', error);
    });
}

formatAiResponse(aiResponse: string): void {
  const cleanedResponse = aiResponse.replace(/#+/g, '').trim();
  const steps = cleanedResponse
    .split(/\n+/) 
    .map((step) => step.trim()) 
    .filter((step) => step);

  this.formattedAiSteps = steps.map((step) => {
    const formattedStep = step.replace(/^\d+\.\s*/, '');
    return formattedStep.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  });
}
}
