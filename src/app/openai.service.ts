import { Injectable } from '@angular/core';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class OpenaiService {

  private openaiApiKey = 'YOUR_OPENAI_API_KEY'; // Add your OpenAI API key here
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

