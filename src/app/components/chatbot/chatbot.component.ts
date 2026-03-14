import { Component, signal, ViewChild, ElementRef, AfterViewChecked, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { GeminiService, ChatMessage } from '../../services/gemini.service';
import { marked } from 'marked';

interface DisplayMessage extends ChatMessage {
  html?: string;
  isThinking?: boolean;
}

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  host: { class: 'flex-1 flex flex-col w-full min-h-0' },
  template: `
    <div class="max-w-6xl w-full mx-auto flex flex-col flex-1 min-h-0 pt-4 px-4 pb-4">
      
      <!-- Header / Controls -->
      <div class="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-3xl p-4 shadow-sm border border-slate-200/60 dark:border-slate-700/50 mb-4 flex flex-wrap gap-4 items-center justify-between shrink-0 transition-colors duration-300">
        <div class="flex items-center gap-3 text-emerald-700 dark:text-emerald-400">
          <div class="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center">
            <mat-icon>smart_toy</mat-icon>
          </div>
          <div>
            <h2 class="font-display font-bold text-slate-800 dark:text-slate-100 leading-tight">Atlas</h2>
            <p class="text-[10px] font-medium text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Seu Tutor de Anatomia</p>
          </div>
        </div>
        
        <div class="flex gap-4 bg-slate-50 dark:bg-slate-900/50 p-2 rounded-2xl border border-slate-100 dark:border-slate-800/50">
          <label class="flex items-center gap-2 cursor-pointer group">
            <div class="relative">
              <input type="checkbox" class="sr-only" [(ngModel)]="useWeb" (change)="useThinking = false">
              <div class="block bg-slate-200 dark:bg-slate-700 w-9 h-5 rounded-full transition-colors" [class.bg-emerald-500]="useWeb" [class.dark:bg-emerald-500]="useWeb"></div>
              <div class="dot absolute left-1 top-1 bg-white w-3 h-3 rounded-full transition-transform shadow-sm" [class.translate-x-4]="useWeb"></div>
            </div>
            <span class="text-xs font-semibold text-slate-500 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200 transition-colors flex items-center gap-1">
              Web
            </span>
          </label>

          <div class="w-px h-5 bg-slate-200 dark:bg-slate-700"></div>

          <label class="flex items-center gap-2 cursor-pointer group">
            <div class="relative">
              <input type="checkbox" class="sr-only" [(ngModel)]="useThinking" (change)="useWeb = false">
              <div class="block bg-slate-200 dark:bg-slate-700 w-9 h-5 rounded-full transition-colors" [class.bg-purple-500]="useThinking" [class.dark:bg-purple-500]="useThinking"></div>
              <div class="dot absolute left-1 top-1 bg-white w-3 h-3 rounded-full transition-transform shadow-sm" [class.translate-x-4]="useThinking"></div>
            </div>
            <span class="text-xs font-semibold text-slate-500 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200 transition-colors flex items-center gap-1">
              Profundo
            </span>
          </label>
        </div>
      </div>

      <!-- Chat Area -->
      <div class="flex-1 bg-white/50 dark:bg-slate-800/30 backdrop-blur-sm rounded-[2.5rem] shadow-inner border border-slate-200/60 dark:border-slate-700/50 overflow-hidden flex flex-col relative transition-colors duration-300">
        
        <!-- Messages -->
        <div class="flex-1 overflow-y-auto p-4 md:p-6 space-y-6" #scrollContainer>
          @if (messages().length === 0) {
            <div class="h-full flex flex-col items-center justify-center text-center p-6">
              <div class="w-24 h-24 bg-gradient-to-br from-emerald-100 to-teal-50 dark:from-emerald-900/40 dark:to-teal-900/20 rounded-full flex items-center justify-center mb-6 shadow-inner border border-emerald-200/50 dark:border-emerald-500/20">
                <mat-icon class="text-6xl text-emerald-600 dark:text-emerald-400">school</mat-icon>
              </div>
              <h3 class="text-3xl font-display font-bold text-slate-800 dark:text-slate-100 mb-4 tracking-tight">Olá! Eu sou o Atlas.</h3>
              <p class="text-slate-500 dark:text-slate-400 font-medium max-w-md leading-relaxed">Seu tutor especialista em anatomia, biomecânica e fisioterapia. Como posso te ajudar a explorar o corpo humano hoje?</p>
              <div class="mt-10 flex flex-col sm:flex-row justify-center gap-3 w-full max-w-lg">
                <button (click)="inputText = 'O que é o manguito rotador?'; sendMessage()" class="flex-1 px-5 py-3 bg-white dark:bg-slate-800 rounded-2xl text-sm font-semibold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-600 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all shadow-sm hover:shadow-md active:scale-95">O que é o manguito rotador?</button>
                <button (click)="inputText = 'Como tratar tendinite?'; sendMessage()" class="flex-1 px-5 py-3 bg-white dark:bg-slate-800 rounded-2xl text-sm font-semibold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-600 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all shadow-sm hover:shadow-md active:scale-95">Como tratar tendinite?</button>
              </div>
            </div>
          }

          @for (msg of messages(); track $index) {
            <div class="flex gap-3" [class.flex-row-reverse]="msg.role === 'user'">
              <div class="w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm"
                   [class.bg-emerald-100]="msg.role === 'user'"
                   [class.dark:bg-emerald-900/50]="msg.role === 'user'"
                   [class.text-emerald-700]="msg.role === 'user'"
                   [class.dark:text-emerald-400]="msg.role === 'user'"
                   [class.bg-white]="msg.role === 'model'"
                   [class.dark:bg-slate-800]="msg.role === 'model'"
                   [class.text-slate-700]="msg.role === 'model'"
                   [class.dark:text-slate-300]="msg.role === 'model'"
                   [class.border]="msg.role === 'model'"
                   [class.border-slate-200]="msg.role === 'model'"
                   [class.dark:border-slate-700]="msg.role === 'model'">
                <mat-icon class="text-[20px]">{{ msg.role === 'user' ? 'person' : 'smart_toy' }}</mat-icon>
              </div>
              
              <div class="max-w-[95%] md:max-w-[85%] rounded-[1.5rem] px-6 py-4 shadow-sm"
                   [class.rounded-tr-sm]="msg.role === 'user'"
                   [class.rounded-tl-sm]="msg.role === 'model'"
                   [class.bg-emerald-600]="msg.role === 'user'"
                   [class.dark:bg-emerald-700]="msg.role === 'user'"
                   [class.text-white]="msg.role === 'user'"
                   [class.bg-white]="msg.role === 'model'"
                   [class.dark:bg-slate-800]="msg.role === 'model'"
                   [class.text-slate-800]="msg.role === 'model'"
                   [class.dark:text-slate-200]="msg.role === 'model'"
                   [class.border]="msg.role === 'model'"
                   [class.border-slate-200/60]="msg.role === 'model'"
                   [class.dark:border-slate-700/50]="msg.role === 'model'">
                
                @if (msg.role === 'user') {
                  <p class="whitespace-pre-wrap font-medium leading-relaxed">{{ msg.text }}</p>
                } @else {
                  @if (msg.isThinking) {
                    <div class="flex items-center gap-3 text-slate-500 dark:text-slate-400 py-2">
                      <mat-icon class="animate-spin text-[20px] text-emerald-500">autorenew</mat-icon>
                      <span class="text-sm font-semibold tracking-wide">Atlas está pensando...</span>
                    </div>
                  } @else {
                    <div class="prose prose-sm md:prose-base prose-slate dark:prose-invert prose-emerald max-w-none prose-headings:font-display prose-headings:tracking-tight" [innerHTML]="msg.html"></div>
                  }
                }
              </div>
            </div>
          }
        </div>

        <!-- Input Area -->
        <div class="sticky bottom-0 p-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border-t border-slate-200/60 dark:border-slate-700/50 transition-colors duration-300 z-10">
          <form (ngSubmit)="sendMessage()" class="relative flex items-center gap-3 max-w-6xl mx-auto">
            <input 
              type="text" 
              [(ngModel)]="inputText" 
              name="inputText"
              placeholder="Pergunte ao Atlas sobre anatomia..." 
              class="flex-1 pl-6 pr-4 py-4 bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-700/80 rounded-full text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all duration-300 shadow-inner font-medium"
              [disabled]="isLoading()"
            >
            <button 
              type="submit" 
              class="w-14 h-14 flex items-center justify-center rounded-full text-white transition-all duration-300 shrink-0 shadow-md"
              [class.bg-emerald-600]="inputText.trim().length > 0 && !isLoading()"
              [class.hover:bg-emerald-500]="inputText.trim().length > 0 && !isLoading()"
              [class.hover:shadow-lg]="inputText.trim().length > 0 && !isLoading()"
              [class.hover:-translate-y-0.5]="inputText.trim().length > 0 && !isLoading()"
              [class.active:scale-95]="inputText.trim().length > 0 && !isLoading()"
              [class.dark:bg-emerald-600]="inputText.trim().length > 0 && !isLoading()"
              [class.dark:hover:bg-emerald-500]="inputText.trim().length > 0 && !isLoading()"
              [class.bg-slate-300]="inputText.trim().length === 0 || isLoading()"
              [class.dark:bg-slate-700]="inputText.trim().length === 0 || isLoading()"
              [class.text-slate-400]="inputText.trim().length === 0 || isLoading()"
              [class.dark:text-slate-500]="inputText.trim().length === 0 || isLoading()"
              [disabled]="inputText.trim().length === 0 || isLoading()"
            >
              <mat-icon class="text-[24px]" [class.ml-1]="inputText.trim().length > 0 && !isLoading()">send</mat-icon>
            </button>
          </form>
        </div>
      </div>
    </div>
  `
})
export class ChatbotComponent implements AfterViewChecked {
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;
  
  messages = signal<DisplayMessage[]>([]);
  inputText = '';
  isLoading = signal(false);
  
  useWeb = false;
  useThinking = false;

  private geminiService = inject(GeminiService);

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    try {
      this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
    } catch {
      // Ignore scroll errors
    }
  }

  async sendMessage() {
    const text = this.inputText.trim();
    if (!text || this.isLoading()) return;

    // Add user message
    const userMsg: DisplayMessage = { role: 'user', text };
    this.messages.update(m => [...m, userMsg]);
    this.inputText = '';
    this.isLoading.set(true);

    // Add placeholder for model response
    const placeholderIdx = this.messages().length;
    this.messages.update(m => [...m, { role: 'model', text: '', isThinking: true }]);

    try {
      // Get history (excluding the current thinking placeholder)
      const history = this.messages().slice(0, -1).map(m => ({ role: m.role, text: m.text }));
      
      const responseText = await this.geminiService.chat(text, history, this.useWeb, this.useThinking);
      const html = await marked.parse(responseText);

      // Update the placeholder with actual response
      this.messages.update(msgs => {
        const newMsgs = [...msgs];
        newMsgs[placeholderIdx] = { role: 'model', text: responseText, html, isThinking: false };
        return newMsgs;
      });
    } catch (error) {
      console.error(error);
      this.messages.update(msgs => {
        const newMsgs = [...msgs];
        newMsgs[placeholderIdx] = { 
          role: 'model', 
          text: 'Ocorreu um erro.', 
          html: '<p class="text-red-500">Desculpe, ocorreu um erro ao processar sua mensagem.</p>', 
          isThinking: false 
        };
        return newMsgs;
      });
    } finally {
      this.isLoading.set(false);
    }
  }
}
