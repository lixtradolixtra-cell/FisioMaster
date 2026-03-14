import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MuscleService, Muscle } from '../../services/muscle.service';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule],
  template: `
    <div class="max-w-3xl mx-auto px-4 py-6">
      <div class="relative mb-8 group">
        <div class="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
          <mat-icon class="text-slate-400 group-focus-within:text-emerald-500 transition-colors">search</mat-icon>
        </div>
        <input 
          type="text" 
          [value]="searchQuery()"
          (input)="onSearch($event)"
          placeholder="Buscar músculo, ação ou grupo..." 
          class="w-full pl-14 pr-4 py-4 bg-white dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/50 rounded-[2rem] shadow-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 text-lg transition-all duration-300 backdrop-blur-sm"
        >
      </div>

      <div class="space-y-4">
        @if (searchResults().length > 0) {
          <p class="text-sm font-medium text-slate-500 dark:text-slate-400 mb-4 px-2">{{ searchResults().length }} resultados encontrados</p>
          @for (muscle of searchResults(); track muscle.id) {
            <a 
              [routerLink]="['/muscle', muscle.id]"
              class="block bg-white dark:bg-slate-800/80 rounded-[2rem] p-5 shadow-sm border border-slate-200/60 dark:border-slate-700/50 hover:border-emerald-300 dark:hover:border-emerald-600 hover:shadow-md transition-all duration-300 group active:scale-[0.98]"
            >
              <div class="flex justify-between items-start gap-4">
                <div class="flex-1">
                  <h3 class="text-xl font-display font-bold text-slate-800 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors mb-1">{{ muscle.name }}</h3>
                  <div class="inline-flex items-center px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-500/10 text-xs font-medium text-emerald-700 dark:text-emerald-400 mb-3 border border-emerald-100 dark:border-emerald-500/20">
                    {{ muscle.group }}
                  </div>
                  <p class="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">{{ muscle.action }}</p>
                </div>
                <div class="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center shrink-0 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-500/10 transition-colors border border-slate-200/50 dark:border-slate-700/50 group-hover:border-emerald-200 dark:group-hover:border-emerald-500/30">
                  <mat-icon class="text-slate-400 dark:text-slate-500 group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors">chevron_right</mat-icon>
                </div>
              </div>
            </a>
          }
        } @else if (searchQuery().length > 0) {
          <div class="text-center py-16 px-4 bg-slate-50 dark:bg-slate-800/30 rounded-[2rem] border border-dashed border-slate-200 dark:border-slate-700">
            <div class="w-16 h-16 mx-auto bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shadow-sm mb-4 border border-slate-200/50 dark:border-slate-700/50">
              <mat-icon class="text-3xl text-slate-300 dark:text-slate-600">search_off</mat-icon>
            </div>
            <p class="text-slate-600 dark:text-slate-300 font-medium text-lg">Nenhum músculo encontrado para "{{ searchQuery() }}"</p>
            <p class="text-slate-400 dark:text-slate-500 text-sm mt-2">Tente buscar por termos mais genéricos.</p>
          </div>
        } @else {
          <div class="text-center py-16 px-4">
            <div class="w-20 h-20 mx-auto bg-emerald-50 dark:bg-emerald-500/10 rounded-full flex items-center justify-center mb-6 shadow-inner border border-emerald-100 dark:border-emerald-500/20">
              <mat-icon class="text-4xl text-emerald-500 dark:text-emerald-400">manage_search</mat-icon>
            </div>
            <h3 class="text-xl font-display font-bold text-slate-800 dark:text-slate-100 mb-2">O que você está procurando?</h3>
            <p class="text-slate-500 dark:text-slate-400 text-sm max-w-xs mx-auto">Você pode buscar por nome do músculo, grupo muscular ou ação específica.</p>
          </div>
        }
      </div>
    </div>
  `
})
export class SearchComponent {
  searchQuery = signal('');
  searchResults = signal<Muscle[]>([]);

  private muscleService = inject(MuscleService);

  onSearch(event: Event) {
    const query = (event.target as HTMLInputElement).value;
    this.searchQuery.set(query);
    
    if (query.trim().length > 0) {
      this.searchResults.set(this.muscleService.searchMuscles(query));
    } else {
      this.searchResults.set([]);
    }
  }
}
