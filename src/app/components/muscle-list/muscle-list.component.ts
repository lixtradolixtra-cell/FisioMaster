import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MuscleService, Muscle } from '../../services/muscle.service';

@Component({
  selector: 'app-muscle-list',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule],
  template: `
    <div class="max-w-4xl mx-auto px-4 py-8">
      <div class="mb-10 text-center md:text-left">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mb-6 shadow-sm border border-emerald-100/50 dark:border-emerald-500/20">
          <mat-icon class="text-4xl">accessibility_new</mat-icon>
        </div>
        <h2 class="text-4xl md:text-5xl font-display font-bold text-slate-800 dark:text-white mb-4 tracking-tight">Guia de Músculos</h2>
        <p class="text-lg text-slate-500 dark:text-slate-400 max-w-2xl">Explore a anatomia humana detalhada por segmentos corporais. Selecione um grupo para ver os músculos correspondentes.</p>
      </div>

      <div class="space-y-4 md:space-y-6">
        @for (group of groups(); track group) {
          <div class="bg-white dark:bg-[#151E2E] rounded-3xl md:rounded-[2.5rem] border border-slate-200/60 dark:border-slate-700/50 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-emerald-200 dark:hover:border-emerald-500/30 group/card">
            <button 
              (click)="toggleGroup(group)"
              class="w-full flex items-center justify-between p-5 md:p-8 bg-transparent transition-colors active:bg-slate-50 dark:active:bg-slate-800/50 group/btn"
            >
              <div class="flex items-center gap-4 md:gap-6">
                <div class="w-14 h-14 md:w-20 md:h-20 rounded-2xl md:rounded-[1.5rem] bg-gradient-to-br from-emerald-50 to-teal-100 dark:from-emerald-900/40 dark:to-teal-900/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 transition-transform duration-500 group-hover/btn:scale-110 group-hover/btn:rotate-3 border border-emerald-100/50 dark:border-emerald-500/20 shadow-inner shrink-0">
                  <mat-icon class="text-[28px] md:text-[40px]">{{ getGroupIcon(group) }}</mat-icon>
                </div>
                <div class="text-left">
                  <span class="block font-display font-bold text-xl md:text-3xl text-slate-800 dark:text-white leading-tight mb-1">{{ group }}</span>
                  <span class="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] md:text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">{{ musclesByGroup(group).length }} músculos</span>
                </div>
              </div>
              <div class="w-10 h-10 md:w-12 md:h-12 rounded-full bg-slate-50 dark:bg-[#1E293B] flex items-center justify-center transition-all duration-300 group-hover/btn:bg-emerald-50 dark:group-hover/btn:bg-emerald-900/30 group-hover/btn:shadow-sm shrink-0 ml-2">
                <mat-icon class="text-slate-400 dark:text-slate-300 transition-transform duration-500 group-hover/btn:text-emerald-600 dark:group-hover/btn:text-emerald-400" [class.rotate-180]="expandedGroup() === group">
                  expand_more
                </mat-icon>
              </div>
            </button>
            
            <div 
              class="overflow-hidden transition-all duration-500 ease-in-out"
              [class.max-h-0]="expandedGroup() !== group"
              [class.max-h-[3000px]]="expandedGroup() === group"
              [class.opacity-0]="expandedGroup() !== group"
              [class.opacity-100]="expandedGroup() === group"
            >
              <div class="px-5 pb-6 pt-1 md:px-8 md:pb-8 md:pt-2">
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                  @for (muscle of musclesByGroup(group); track muscle.id) {
                    <a 
                      [routerLink]="['/muscle', muscle.id]"
                      class="flex items-center justify-between p-4 md:p-5 rounded-2xl bg-slate-50/80 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/50 hover:bg-white dark:hover:bg-slate-800 hover:shadow-md hover:border-emerald-200 dark:hover:border-emerald-500/30 transition-all duration-300 group/item active:scale-[0.98] hover:-translate-y-1"
                    >
                      <span class="text-slate-700 dark:text-slate-300 font-semibold group-hover/item:text-emerald-600 dark:group-hover/item:text-emerald-400 transition-colors text-sm md:text-base pr-2">{{ muscle.name }}</span>
                      <div class="w-8 h-8 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm border border-slate-100 dark:border-slate-700 opacity-0 -translate-x-4 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all duration-300 shrink-0">
                        <mat-icon class="text-emerald-500 dark:text-emerald-400 text-[18px]">arrow_forward</mat-icon>
                      </div>
                    </a>
                  }
                </div>
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  `
})
export class MuscleListComponent implements OnInit {
  groups = signal<string[]>([]);
  expandedGroup = signal<string | null>(null);

  private muscleService = inject(MuscleService);

  ngOnInit() {
    this.groups.set(this.muscleService.getGroups());
    if (this.groups().length > 0) {
      this.expandedGroup.set(this.groups()[0]);
    }
  }

  musclesByGroup(group: string): Muscle[] {
    return this.muscleService.getMusclesByGroup(group);
  }

  toggleGroup(group: string) {
    if (this.expandedGroup() === group) {
      this.expandedGroup.set(null);
    } else {
      this.expandedGroup.set(group);
    }
  }

  getGroupIcon(group: string): string {
    const lowerGroup = group.toLowerCase();
    if (lowerGroup.includes('cabeça') || lowerGroup.includes('face')) return 'face';
    if (lowerGroup.includes('pescoço')) return 'person';
    if (lowerGroup.includes('tórax') || lowerGroup.includes('abdome')) return 'fitness_center';
    if (lowerGroup.includes('costas')) return 'accessibility_new';
    if (lowerGroup.includes('ombro') || lowerGroup.includes('braço') || lowerGroup.includes('antebraço')) return 'sports_mma';
    if (lowerGroup.includes('quadril') || lowerGroup.includes('assoalho pélvico')) return 'airline_seat_recline_normal';
    if (lowerGroup.includes('coxa') || lowerGroup.includes('perna')) return 'directions_run';
    return 'accessibility';
  }
}
