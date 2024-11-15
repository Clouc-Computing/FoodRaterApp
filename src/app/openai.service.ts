import { Injectable } from '@angular/core';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class OpenaiService {

  private openaiApiKey = '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'; // Add your OpenAI API key here
  private apiUrl = 'https://api.openai.com/v1/completions';  // OpenAI endpoint

  constructor() { }

  async getFoodSuggestion(prompt: string): Promise<string> {
    try {
      const response = await axios.post(this.apiUrl, {
        model: 'text-davinci-003',  // You can use GPT-3 or GPT-4 model
        prompt: prompt,
        max_tokens: 100,
        temperature: 0.7,
      }, {
        headers: {
          'Authorization': `Bearer ${this.openaiApiKey}`,
          'Content-Type': 'application/json'
        }
      });

      return response.data.choices[0].text.trim(); // Return the generated text from OpenAI
    } catch (error) {
      console.error('Error calling OpenAI API:', error);
      throw error;  // Handle error accordingly
    }
  }
}

