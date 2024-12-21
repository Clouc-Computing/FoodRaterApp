// src/app/openai.service.ts

import { Injectable } from '@angular/core';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class OpenAIService {

  private apiKey = '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';  // Replace with your actual OpenAI API key
  private apiUrl = 'https://api.openai.com/v1/chat/completions';
  private apiGatewayUrl = 'https://ykojrqnb9b.execute-api.us-east-2.amazonaws.com/dev'
  constructor() { }

  async getFoodSuggestion(): Promise<string> {
    try {
      const response = await axios.post(
        this.apiUrl,
        {
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'user', content: 'Suggest a new food dish to rate for a food rating app.' }
          ],
          max_tokens: 50,
          temperature: 0.7
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Access the message content from the response, formatted for chat completions
      const suggestion = response.data.choices[0].message.content.trim();
      return suggestion;
    } catch (error) {
      console.error('Error fetching AI response:', error);
      return 'Sorry, I couldn’t get a suggestion at the moment.';
    }
  }

async updateUser(resource_id: number, updatedFields: any): Promise<any> {
  try {
    console.log('Updating User ID:', resource_id, 'With Fields:', updatedFields);

    const response = await axios.put(
      `${this.apiGatewayUrl}/api/mainResource/${resource_id}`,
      updatedFields,
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );

    console.log('User updated successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error updating user:', error);
    throw new Error('Failed to update user');
  }
}

async getUserFoodSuggestion(message: string): Promise<string> {
  try {
    const response = await axios.post(
      this.apiUrl,
      {
        model: 'gpt-4o',
        messages: [
          { role: 'user', content: message }
        ],
        max_tokens: 600,
        temperature: 0.7
      },
      {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const aiResponse = response.data.choices[0].message.content.trim();
    return aiResponse;
  } catch (error) {
    console.error('Error fetching AI response:', error);
    return 'Sorry, I couldn’t process your suggestion at the moment.';
  }
}
  async getMainResource(page: number = 1, perPage: number = 10): Promise<any> {
    try {
      const response = await axios.get(`${this.apiGatewayUrl}/api/mainResource`, {
        params: { page, perPage },
      });
      console.log('Response data:', response.data);
      console.log('Users Array:', response.data.users);
      return response.data;
    } catch (error) {
      console.error('Error fetching main resource:', error);
      throw error;
    }
  }
  async createUser(user: { username: string; email: string; password: string }): Promise<any> {
    try {
      console.log("USER!!!");
      console.log("User parameters", user);
      const response = await axios.post(`${this.apiGatewayUrl}/api/mainResource`, user);
      console.log("Creatng User!!!!")
      return response.data;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }
async fetchItems(page: number = 1, perPage: number = 10): Promise<any> {
  try {
    console.log("Fetching items with pagination...");
    const response = await axios.get(`${this.apiGatewayUrl}/api/mainResource`, {
      params: { page, per_page: perPage }, // Query parameters for pagination
      headers: { 'Content-Type': 'application/json' },
    });
    console.log("Fetched items:", response.data);
    console.log("ITEM ARRAY 1", response.data.items);
    console.log("ITEM ARRAY 2", response.data.items.items);
    return response.data.items.items;
  } catch (error) {
    console.error('Error fetching items:', error);
    throw error;
  }
}

async fetchUsers(page: number = 1, perPage: number = 10, username?: string): Promise<any> {
  try {
    console.log("Fetching users with pagination...");
    const params: any = { page, per_page: perPage };
    if (username) params.username = username;
    const response = await axios.get(`${this.apiGatewayUrl}/api/mainResource/users`, { params });
    console.log("Fetched users:", response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
}

async addFoodItem(foodItem: { name: string; description: string }): Promise<any> {
  try {
    console.log("Adding food item...");
    const response = await axios.post(`${this.apiGatewayUrl}/api/mainResource`, foodItem, {
      headers: { 'Content-Type': 'application/json' },
    });
    console.log("Food item created:", response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating food item:', error);
    throw error;
  }
}

async addReview(itemId: number, reviewData: { review: string; rating: number }): Promise<any> {
  try {
    console.log("Adding review for item ID:", itemId);
    const response = await axios.post(
      `${this.apiGatewayUrl}/api/mainResource/${itemId}/subResource`,
      reviewData,
      { headers: { 'Content-Type': 'application/json' } }
    );
    console.log("Review added:", response.data);
    return response.data;
  } catch (error) {
    console.error('Error adding review:', error);
    throw error;
  }
}

async fetchReviews(itemId: number, page: number = 1, perPage: number = 10): Promise<any> {
  try {
    console.log(`Fetching reviews for item ID ${itemId} with pagination...`);
    const response = await axios.get(`${this.apiGatewayUrl}/api/mainResource/${itemId}/subResource`, {
      params: { page, per_page: perPage },
    });
    console.log("Fetched reviews:", response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching reviews:', error);
    throw error;
  }
}

}
