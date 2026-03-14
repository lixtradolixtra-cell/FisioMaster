import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MuscleService, Muscle } from '../../services/muscle.service';
import { GeminiService } from '../../services/gemini.service';
import { marked } from 'marked';

@Component({
  selector: 'app-muscle-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule],
  template: `
    <div class="max-w-4xl mx-auto px-4 py-6">
      @if (muscle(); as m) {
        <a routerLink="/muscles" class="inline-flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 mb-6 transition-colors bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-slate-200/60 dark:border-slate-700/50 w-fit active:scale-95">
          <mat-icon class="text-[18px]">arrow_back</mat-icon>
          Voltar
        </a>

        <div class="bg-white dark:bg-[#151E2E] rounded-3xl md:rounded-[2.5rem] shadow-sm border border-slate-200/60 dark:border-slate-700/50 overflow-hidden mb-6 md:mb-8 transition-colors duration-300">
          <div class="h-64 md:h-[28rem] relative flex items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-[#0B1121] border-b border-slate-100 dark:border-slate-800/50 overflow-hidden group">
            <!-- Decorative background elements -->
            <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.05)_0%,transparent_70%)] dark:bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.1)_0%,transparent_70%)]"></div>
            
            <img [src]="m.imageUrl ? m.imageUrl : 'https://picsum.photos/seed/' + m.id + '/800/400'" 
                 [alt]="m.name" 
                 loading="lazy"
                 referrerpolicy="no-referrer"
                 class="w-full h-full object-contain p-6 md:p-12 transition-transform duration-1000 group-hover:scale-105 relative z-10" />
                 
            <div class="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent pointer-events-none z-20"></div>
            
            <div class="absolute bottom-0 left-0 w-full p-5 md:p-8 z-30 flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <span class="inline-flex items-center px-2.5 py-1 md:px-3 md:py-1 rounded-full text-[10px] md:text-xs font-bold bg-emerald-500/20 text-emerald-100 backdrop-blur-md border border-emerald-400/30 mb-2 md:mb-3 shadow-sm">
                  {{ m.group }}
                </span>
                <h2 class="text-3xl md:text-5xl font-display font-bold text-white drop-shadow-lg tracking-tight leading-tight">{{ m.name }}</h2>
              </div>
              
              <button 
                (click)="playAudio()" 
                class="flex items-center justify-center gap-2 text-white hover:bg-emerald-500 bg-emerald-600/90 backdrop-blur-md px-5 py-3 md:py-3 rounded-2xl md:rounded-full transition-all duration-300 active:scale-95 border border-emerald-400/30 shadow-lg w-full md:w-fit"
                [disabled]="isAudioPlaying()"
              >
                <mat-icon class="text-[22px]">{{ isAudioPlaying() ? 'volume_up' : 'play_arrow' }}</mat-icon>
                <span class="text-sm font-bold tracking-wide">{{ isAudioPlaying() ? 'Ouvindo...' : 'Ouvir Resumo' }}</span>
              </button>
            </div>
            
            @if (!m.imageUrl) {
              <div class="absolute top-4 right-4 bg-black/40 text-white/80 text-[10px] px-2 py-1 rounded-md backdrop-blur-sm z-30">Seed: {{ m.id }}</div>
            }
          </div>

          <div class="p-5 md:p-8">
            <!-- Bento Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              <div class="bg-slate-50/80 dark:bg-slate-900/40 p-5 md:p-6 rounded-3xl md:rounded-[2rem] border border-slate-100 dark:border-slate-800/50 transition-colors duration-300 hover:shadow-md hover:border-emerald-200 dark:hover:border-emerald-500/30 group">
                <div class="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm border border-slate-200/60 dark:border-slate-700/50 mb-3 md:mb-4 group-hover:scale-110 transition-transform">
                  <mat-icon class="text-emerald-500 dark:text-emerald-400 text-[20px]">trip_origin</mat-icon>
                </div>
                <h3 class="text-[10px] md:text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1 md:mb-2">Origem</h3>
                <p class="text-slate-700 dark:text-slate-300 font-medium text-sm md:text-base leading-relaxed">{{ m.origin }}</p>
              </div>

              <div class="bg-slate-50/80 dark:bg-slate-900/40 p-5 md:p-6 rounded-3xl md:rounded-[2rem] border border-slate-100 dark:border-slate-800/50 transition-colors duration-300 hover:shadow-md hover:border-emerald-200 dark:hover:border-emerald-500/30 group">
                <div class="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm border border-slate-200/60 dark:border-slate-700/50 mb-3 md:mb-4 group-hover:scale-110 transition-transform">
                  <mat-icon class="text-emerald-500 dark:text-emerald-400 text-[20px]">place</mat-icon>
                </div>
                <h3 class="text-[10px] md:text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1 md:mb-2">Inserção</h3>
                <p class="text-slate-700 dark:text-slate-300 font-medium text-sm md:text-base leading-relaxed">{{ m.insertion }}</p>
              </div>

              <div class="bg-slate-50/80 dark:bg-slate-900/40 p-5 md:p-6 rounded-3xl md:rounded-[2rem] border border-slate-100 dark:border-slate-800/50 transition-colors duration-300 hover:shadow-md hover:border-emerald-200 dark:hover:border-emerald-500/30 group">
                <div class="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm border border-slate-200/60 dark:border-slate-700/50 mb-3 md:mb-4 group-hover:scale-110 transition-transform">
                  <mat-icon class="text-emerald-500 dark:text-emerald-400 text-[20px]">bolt</mat-icon>
                </div>
                <h3 class="text-[10px] md:text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1 md:mb-2">Inervação</h3>
                <p class="text-slate-700 dark:text-slate-300 font-medium text-sm md:text-base leading-relaxed">{{ m.innervation }}</p>
              </div>

              <div class="bg-slate-50/80 dark:bg-slate-900/40 p-5 md:p-6 rounded-3xl md:rounded-[2rem] border border-slate-100 dark:border-slate-800/50 transition-colors duration-300 hover:shadow-md hover:border-emerald-200 dark:hover:border-emerald-500/30 group">
                <div class="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm border border-slate-200/60 dark:border-slate-700/50 mb-3 md:mb-4 group-hover:scale-110 transition-transform">
                  <mat-icon class="text-emerald-500 dark:text-emerald-400 text-[20px]">directions_run</mat-icon>
                </div>
                <h3 class="text-[10px] md:text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1 md:mb-2">Ação</h3>
                <p class="text-slate-700 dark:text-slate-300 font-medium text-sm md:text-base leading-relaxed">{{ m.action }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Pathologies Section -->
        <div class="bg-white dark:bg-slate-800/80 rounded-3xl md:rounded-[2.5rem] shadow-sm border border-slate-200/60 dark:border-slate-700/50 p-6 md:p-10 transition-colors duration-300">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-5 md:gap-6 mb-6 md:mb-8">
            <h3 class="text-xl md:text-2xl font-display font-bold text-slate-800 dark:text-slate-100 flex items-center gap-3 md:gap-4 tracking-tight">
              <div class="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-gradient-to-br from-rose-50 to-orange-50 dark:from-rose-900/40 dark:to-orange-900/20 flex items-center justify-center text-rose-500 dark:text-rose-400 shadow-inner border border-rose-100/50 dark:border-rose-500/20">
                <mat-icon class="text-[24px] md:text-[28px]">healing</mat-icon>
              </div>
              Patologias Associadas
            </h3>
            @if (!pathologies()) {
              <button 
                (click)="generatePathologies()" 
                class="flex items-center justify-center gap-3 bg-slate-900 dark:bg-emerald-600 text-white px-6 py-3.5 rounded-2xl md:rounded-full hover:bg-slate-800 dark:hover:bg-emerald-500 transition-all duration-300 active:scale-95 shadow-md hover:shadow-lg hover:-translate-y-0.5 w-full md:w-fit"
                [disabled]="isLoadingPathologies()"
              >
                @if (!isLoadingPathologies()) {
                  <mat-icon class="text-[22px]">auto_awesome</mat-icon>
                } @else {
                  <mat-icon class="animate-spin text-[22px]">refresh</mat-icon>
                }
                <span class="text-sm font-bold tracking-wide">{{ isLoadingPathologies() ? 'Gerando com Atlas...' : 'Gerar com IA' }}</span>
              </button>
            }
          </div>

          @if (pathologies()) {
            <div class="prose prose-slate dark:prose-invert prose-emerald max-w-none prose-headings:font-display prose-headings:tracking-tight prose-a:text-emerald-600 dark:prose-a:text-emerald-400 prose-p:leading-relaxed prose-li:marker:text-emerald-500 bg-slate-50/50 dark:bg-slate-900/30 p-6 md:p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800/50" [innerHTML]="pathologies()"></div>
          }
          
          @if (!pathologies() && !isLoadingPathologies()) {
            <div class="text-center py-12 px-6 bg-slate-50/80 dark:bg-slate-900/40 rounded-[2rem] border-2 border-dashed border-slate-200 dark:border-slate-700/60">
              <div class="w-20 h-20 mx-auto bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shadow-sm mb-5 border border-slate-100 dark:border-slate-700">
                <mat-icon class="text-4xl text-slate-300 dark:text-slate-600">medical_services</mat-icon>
              </div>
              <p class="text-slate-500 dark:text-slate-400 font-medium max-w-md mx-auto leading-relaxed">Clique no botão acima para pedir ao Atlas para gerar as patologias mais comuns e tratamentos fisioterapêuticos para este músculo.</p>
            </div>
          }
        </div>
      } @else {
        <div class="text-center py-20 px-4">
          <div class="w-20 h-20 mx-auto bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
            <mat-icon class="text-4xl text-slate-300 dark:text-slate-600">search_off</mat-icon>
          </div>
          <p class="text-slate-500 dark:text-slate-400 font-medium text-lg">Músculo não encontrado.</p>
          <a routerLink="/muscles" class="inline-block mt-4 text-emerald-600 dark:text-emerald-400 font-semibold hover:underline">Voltar para o guia</a>
        </div>
      }
    </div>
  `
})
export class MuscleDetailComponent implements OnInit {
  muscle = signal<Muscle | undefined>(undefined);
  pathologies = signal<string | null>(null);
  isLoadingPathologies = signal(false);
  isAudioPlaying = signal(false);

  private route = inject(ActivatedRoute);
  private muscleService = inject(MuscleService);
  private geminiService = inject(GeminiService);

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.muscle.set(this.muscleService.getMuscleById(id));
        this.pathologies.set(null);
      }
    });
  }

  async generatePathologies() {
    const m = this.muscle();
    if (!m) return;

    this.isLoadingPathologies.set(true);
    try {
      const markdown = await this.geminiService.generatePathologies(m.name);
      const html = await marked.parse(markdown);
      this.pathologies.set(html);
    } catch (e) {
      console.error(e);
    } finally {
      this.isLoadingPathologies.set(false);
    }
  }

  async playAudio() {
    const m = this.muscle();
    if (!m || this.isAudioPlaying()) return;

    this.isAudioPlaying.set(true);
    const textToRead = "Músculo " + m.name + ". Origem: " + m.origin + ". Inserção: " + m.insertion + ". Inervação: " + m.innervation + ". Ação: " + m.action + ".";
    
    try {
      const base64Audio = await this.geminiService.generateSpeech(textToRead);
      if (base64Audio) {
        const audio = new Audio("data:audio/mp3;base64," + base64Audio);
        audio.onended = () => this.isAudioPlaying.set(false);
        audio.play();
      } else {
        this.isAudioPlaying.set(false);
      }
    } catch (e) {
      console.error(e);
      this.isAudioPlaying.set(false);
    }
  }
}
