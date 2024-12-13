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
  users: any[] = [];
  items: any[] = [];
  newUser = { username: '', email: '', password: '' };
  successMessage: string = '';
  errorMessage: string = '';
  constructor(private apiService: OpenAIService) { }

  fetchUsers(): void {
    this.apiService.getMainResource()
      .then((response: any) => {
        this.users = response.data.users.users; // Load users on button click
	console.log("User data: ", this.users);
      })
      .catch((error: any) => {
        console.error('Error fetching users:', error);
        this.errorMessage = 'Failed to load users';
      });
  }

  fetchItems(): void {
    this.apiService.getMainResource()
      .then((response: any) => {
        this.items = response.items.items; // Automatically load items
      })
      .catch((error: any) => {
        console.error('Error fetching items:', error);
        this.errorMessage = 'Failed to load items';
      });
  }
  submitUserForm(event: Event): void {
    event.preventDefault(); // Prevent the default form submission
    this.apiService.createUser(this.newUser)
      .then((response) => {
        this.successMessage = 'User created successfully!';
        this.errorMessage = '';
        console.log('Response:', response);
        this.newUser = { username: '', email: '', password: '' }; // Reset the form
      })
      .catch((error) => {
        this.successMessage = '';
        this.errorMessage = 'Failed to create user.';
        console.error('Error:', error);
      });
  }


}
