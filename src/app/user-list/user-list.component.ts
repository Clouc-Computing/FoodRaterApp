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
  successMessageReview: string = '';
  errorMessageReview: string = '';
  reviews: any[] = [];
  newUser = { username: '', email: '', password: '' };
  newFoodItem = { name: '', description: '' };
  newReview = { review: '', rating: 0 };
  selectedItemId: number | null = null;
  selectedItem: any = null; 
  aiResponse: string = '';
  showUpdateEmailForm: boolean = false;
  currUserId: number = 0;
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
updateUserEmail(event: Event): void {
  event.preventDefault(); // Prevent default form submission

  if (!this.newUser.username || !this.newUser.email) {
    this.errorMessageUser = 'Please ensure the username and email are filled in.';
    return;
  }
  console.log("USER ID", this.newUser)

  // Send PUT request to update the user's email
  this.apiService.updateUser(this.currUserId, { email: this.newUser.email })
    .then(() => {
      this.successMessageUser = 'Email updated successfully!';
      this.errorMessageUser = '';
    })
    .catch((error) => {
      this.successMessageUser = '';
      this.errorMessageUser = 'Failed to update email.';
      console.error('Error updating email:', error);
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
	console.log("USER ID", response.id);
	this.currUserId = response.id;
        this.showUpdateEmailForm = true; 
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
      this.apiService.fetchItems()
        .then((response: any) => {
          this.items = response; // Update items array with the latest data
	  console.log("Testing here", response);
          console.log('Updated Items:', this.items);
        })
        .catch((error: any) => {
          console.error('Error fetching items:', error);
          this.errorMessageFood = 'Failed to load items.';
        });
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

  fetchReviews(itemId: number | null): void {
    if (itemId === null) {
      console.error('Cannot fetch reviews for a null item ID.');
      return;
    }
    this.selectedItemId = itemId; // Set the item for which reviews are fetched
    this.apiService.fetchReviews(itemId)
      .then((response: any) => {
        this.reviews = response.reviews;
        console.log('Reviews:', this.reviews);
      })
      .catch((error: any) => {
        console.error('Error fetching reviews:', error);
        this.errorMessageReview = 'Failed to load reviews.';
      });
  }
  selectItemForReview(item: any): void {
    this.selectedItemId = item.id; // Set the selected item's ID
    this.selectedItem = item; // Optionally set the full item
    console.log('Selected Item ID:', this.selectedItemId);
    console.log('Selected Item:', this.selectedItem);  
}

  submitReviewForm(event: Event): void {
    event.preventDefault();
    if (this.selectedItemId === null) {
      this.errorMessageReview = 'Please select an item to review.';
      return;
    }
    
    this.apiService.addReview(this.selectedItemId, this.newReview)
      .then((response: any) => {
        console.log("INSIDE REVIEW STATEMENT");
        this.successMessageReview = 'Review added successfully!';
        this.errorMessageReview = '';
        console.log('Review Response:', response);
        this.newReview = { review: '', rating: 0 }; // Reset the form
        this.fetchReviews(this.selectedItemId); // Refresh reviews
      })
      .catch((error: any) => {
        this.successMessageReview = '';
        this.errorMessageReview = 'Failed to add review.';
        console.error('Error adding review:', error);
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
