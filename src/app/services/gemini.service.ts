import { Injectable } from '@angular/core';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import { KNOWLEDGE_BASE } from '../data/knowledge-base';

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

@Injectable({
  providedIn: 'root'
})
export class GeminiService {
  private ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

  async generatePathologies(muscleName: string): Promise<string> {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3.1-flash-lite-preview',
        contents: `Liste as principais patologias associadas ao músculo ${muscleName}, com uma breve descrição e possíveis tratamentos fisioterapêuticos. Seja conciso, prático e formate em Markdown.\n\nUtilize a seguinte base de conhecimento se relevante:\n${KNOWLEDGE_BASE}`,
      });
      return response.text || 'Não foi possível gerar as patologias.';
    } catch (error) {
      console.error('Error generating pathologies:', error);
      return 'Erro ao gerar patologias. Tente novamente mais tarde.';
    }
  }

  async chat(message: string, history: ChatMessage[], useWeb: boolean, useThinking: boolean): Promise<string> {
    try {
      let model = 'gemini-3.1-flash-lite-preview';
      const config: Record<string, unknown> = {
        systemInstruction: `Você é o Atlas, o assistente virtual e tutor especialista do aplicativo FisioMaster.
Sua personalidade é acolhedora, didática, paciente e altamente técnica, mas capaz de explicar conceitos complexos de forma simples usando analogias (como comparar o corpo a um sistema de engrenagens ou continentes).
Seu objetivo é ajudar estudantes de fisioterapia, educação física e medicina a entenderem anatomia, biomecânica, o sistema miofascial e patologias.
Responda sempre em primeira pessoa como "Atlas". Seja encorajador.
Responda de forma clara, prática e baseada em evidências. Use formatação Markdown para facilitar a leitura.

Utilize a seguinte base de conhecimento para embasar suas respostas, especialmente sobre o assoalho pélvico e sistema neuromuscular:

${KNOWLEDGE_BASE}`,
      };

      if (useThinking) {
        model = 'gemini-3.1-pro-preview';
        config['thinkingConfig'] = { thinkingLevel: ThinkingLevel.HIGH };
      } else if (useWeb) {
        model = 'gemini-3-flash-preview';
        config['tools'] = [{ googleSearch: {} }];
      }

      // Convert history to the format expected by the SDK, or just append it to the prompt for simplicity
      // Since we are creating a new chat instance, we can pass history if we format it correctly.
      // The SDK expects history as an array of Content objects: { role: string, parts: [{ text: string }] }
      const formattedHistory = history.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.text }]
      }));

      const chat = this.ai.chats.create({
        model: model,
        config: config,
        history: formattedHistory
      });

      const response = await chat.sendMessage({ message });
      
      let text = response.text || '';
      
      // Extract grounding chunks if web search was used
      if (useWeb && response.candidates?.[0]?.groundingMetadata?.groundingChunks) {
        const chunks = response.candidates[0].groundingMetadata.groundingChunks;
        const urls = chunks.map((c: { web?: { uri?: string } }) => c.web?.uri).filter((uri: string | undefined): uri is string => !!uri);
        if (urls.length > 0) {
          text += '\n\n**Fontes:**\n' + urls.map((u: string) => `- [${u}](${u})`).join('\n');
        }
      }
      
      return text;
    } catch (error) {
      console.error('Error in chat:', error);
      return 'Desculpe, ocorreu um erro ao processar sua mensagem.';
    }
  }

  async generateSpeech(text: string): Promise<string> {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash-preview-tts',
        contents: [{ parts: [{ text }] }],
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Kore' }
            }
          }
        }
      });
      return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || '';
    } catch (error) {
      console.error('Error generating speech:', error);
      return '';
    }
  }
}
