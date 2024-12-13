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
      return response.data; // Handle the success response
    } catch (error) {
      console.error('Error creating user:', error);
      throw error; // Handle the error
    }
  }
}


