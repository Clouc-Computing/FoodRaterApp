// src/app/openai.service.ts

import { Injectable } from '@angular/core';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class OpenAIService {

  private apiKey = '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';  // Replace with your actual OpenAI API key
  private apiUrl = 'https://api.openai.com/v1/chat/completions';

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
}

