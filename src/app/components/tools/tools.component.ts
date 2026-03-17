import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-tools',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  template: `
    <div class="max-w-4xl mx-auto p-4 md:p-8 pb-32">
      <div class="mb-6 md:mb-8">
        <h1 class="text-3xl md:text-4xl font-display font-bold text-slate-800 dark:text-white mb-2">Ferramentas</h1>
        <p class="text-slate-600 dark:text-slate-400 text-sm md:text-base">Utilitários práticos para avaliação e prática clínica.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
        
        <!-- Calculadoras Section -->
        <div class="col-span-1 md:col-span-2 flex items-center gap-2 mt-2 mb-1">
          <mat-icon class="text-emerald-600 dark:text-emerald-400">calculate</mat-icon>
          <h2 class="text-lg font-bold text-slate-800 dark:text-white uppercase tracking-wider">Calculadoras</h2>
        </div>

        <!-- IMC Calculator -->
        <div class="bg-white dark:bg-slate-800 rounded-3xl p-5 md:p-6 shadow-sm border border-slate-200/60 dark:border-slate-700/50">
          <div class="flex items-center gap-3 mb-5 text-emerald-600 dark:text-emerald-400">
            <div class="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center">
              <mat-icon>monitor_weight</mat-icon>
            </div>
            <h3 class="text-lg font-bold text-slate-800 dark:text-white leading-tight">Calculadora de IMC</h3>
          </div>
          <div class="space-y-4">
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">Peso (kg)</label>
                <input type="number" [(ngModel)]="weight" placeholder="Ex: 75" class="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3 text-slate-800 dark:text-white focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none transition-all text-lg">
              </div>
              <div>
                <label class="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">Altura (cm)</label>
                <input type="number" [(ngModel)]="height" placeholder="Ex: 175" class="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3 text-slate-800 dark:text-white focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none transition-all text-lg">
              </div>
            </div>
            <button (click)="calculateIMC()" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3.5 rounded-2xl transition-all active:scale-[0.98] shadow-sm flex justify-center items-center gap-2">
              <mat-icon class="text-[20px]">check_circle</mat-icon> Calcular IMC
            </button>
            
            @if (imcResult() !== null) {
              <div class="mt-4 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl text-center border border-emerald-100 dark:border-emerald-800/30 animate-in fade-in slide-in-from-bottom-2">
                <div class="text-3xl font-display font-bold text-emerald-600 dark:text-emerald-400">{{ imcResult() | number:'1.1-1' }}</div>
                <div class="text-sm font-medium text-slate-700 dark:text-slate-300 mt-1">{{ imcCategory() }}</div>
              </div>
            }
          </div>
        </div>

        <!-- 1RM Calculator -->
        <div class="bg-white dark:bg-slate-800 rounded-3xl p-5 md:p-6 shadow-sm border border-slate-200/60 dark:border-slate-700/50">
          <div class="flex items-center gap-3 mb-5 text-emerald-600 dark:text-emerald-400">
            <div class="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center">
              <mat-icon>fitness_center</mat-icon>
            </div>
            <h3 class="text-lg font-bold text-slate-800 dark:text-white leading-tight">Estimativa de 1RM</h3>
          </div>
          <div class="space-y-4">
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">Carga (kg)</label>
                <input type="number" [(ngModel)]="rmWeight" placeholder="Ex: 50" class="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3 text-slate-800 dark:text-white focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none transition-all text-lg">
              </div>
              <div>
                <label class="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">Repetições</label>
                <input type="number" [(ngModel)]="rmReps" placeholder="Ex: 8" class="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3 text-slate-800 dark:text-white focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none transition-all text-lg">
              </div>
            </div>
            <button (click)="calculate1RM()" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3.5 rounded-2xl transition-all active:scale-[0.98] shadow-sm flex justify-center items-center gap-2">
              <mat-icon class="text-[20px]">check_circle</mat-icon> Estimar 1RM
            </button>
            
            @if (rmResult() !== null) {
              <div class="mt-4 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl text-center border border-emerald-100 dark:border-emerald-800/30 animate-in fade-in slide-in-from-bottom-2">
                <div class="text-3xl font-display font-bold text-emerald-600 dark:text-emerald-400">{{ rmResult() | number:'1.0-0' }} <span class="text-lg">kg</span></div>
                <div class="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">Fórmula de Brzycki</div>
              </div>
            }
          </div>
        </div>

        <!-- Karvonen Calculator -->
        <div class="bg-white dark:bg-slate-800 rounded-3xl p-5 md:p-6 shadow-sm border border-slate-200/60 dark:border-slate-700/50 md:col-span-2">
          <div class="flex items-center gap-3 mb-5 text-emerald-600 dark:text-emerald-400">
            <div class="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center">
              <mat-icon>favorite</mat-icon>
            </div>
            <h3 class="text-lg font-bold text-slate-800 dark:text-white leading-tight">Frequência Cardíaca Alvo (Karvonen)</h3>
          </div>
          <div class="space-y-4">
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">Idade</label>
                <input type="number" [(ngModel)]="age" placeholder="Ex: 45" class="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3 text-slate-800 dark:text-white focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none transition-all text-lg">
              </div>
              <div>
                <label class="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">FC Repouso (bpm)</label>
                <input type="number" [(ngModel)]="restingHr" placeholder="Ex: 70" class="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3 text-slate-800 dark:text-white focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none transition-all text-lg">
              </div>
            </div>
            <button (click)="calculateKarvonen()" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3.5 rounded-2xl transition-all active:scale-[0.98] shadow-sm flex justify-center items-center gap-2">
              <mat-icon class="text-[20px]">check_circle</mat-icon> Calcular Zonas
            </button>
            
            @if (karvonenResult() !== null) {
              <div class="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 animate-in fade-in slide-in-from-bottom-2">
                <div class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800/30 text-center">
                  <div class="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase mb-1">Leve (50-60%)</div>
                  <div class="text-xl font-display font-bold text-slate-800 dark:text-slate-200">{{ karvonenResult()?.z1?.[0] }} - {{ karvonenResult()?.z1?.[1] }} <span class="text-sm font-normal text-slate-500">bpm</span></div>
                </div>
                <div class="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl border border-emerald-100 dark:border-emerald-800/30 text-center">
                  <div class="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase mb-1">Moderada (60-70%)</div>
                  <div class="text-xl font-display font-bold text-slate-800 dark:text-slate-200">{{ karvonenResult()?.z2?.[0] }} - {{ karvonenResult()?.z2?.[1] }} <span class="text-sm font-normal text-slate-500">bpm</span></div>
                </div>
                <div class="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-2xl border border-orange-100 dark:border-orange-800/30 text-center">
                  <div class="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase mb-1">Intensa (70-80%)</div>
                  <div class="text-xl font-display font-bold text-slate-800 dark:text-slate-200">{{ karvonenResult()?.z3?.[0] }} - {{ karvonenResult()?.z3?.[1] }} <span class="text-sm font-normal text-slate-500">bpm</span></div>
                </div>
              </div>
            }
          </div>
        </div>

        <!-- Referências Section -->
        <div class="col-span-1 md:col-span-2 flex items-center gap-2 mt-6 mb-1">
          <mat-icon class="text-emerald-600 dark:text-emerald-400">menu_book</mat-icon>
          <h2 class="text-lg font-bold text-slate-800 dark:text-white uppercase tracking-wider">Guias e Referências</h2>
        </div>

        <!-- Escala de Borg -->
        <div class="bg-white dark:bg-slate-800 rounded-3xl p-5 md:p-6 shadow-sm border border-slate-200/60 dark:border-slate-700/50">
          <div class="flex items-center gap-3 mb-5 text-emerald-600 dark:text-emerald-400">
            <div class="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center">
              <mat-icon>speed</mat-icon>
            </div>
            <h3 class="text-lg font-bold text-slate-800 dark:text-white leading-tight">Escala de Borg (Modificada)</h3>
          </div>
          <div class="space-y-2">
            <div class="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl text-sm">
              <span class="font-bold text-slate-800 dark:text-white w-8">0</span>
              <span class="flex-1 text-slate-600 dark:text-slate-400">Repouso absoluto</span>
            </div>
            <div class="flex justify-between items-center p-3 bg-blue-50/50 dark:bg-blue-900/10 rounded-xl text-sm">
              <span class="font-bold text-blue-600 dark:text-blue-400 w-8">1-2</span>
              <span class="flex-1 text-slate-600 dark:text-slate-400">Muito leve / Leve</span>
            </div>
            <div class="flex justify-between items-center p-3 bg-emerald-50/50 dark:bg-emerald-900/10 rounded-xl text-sm">
              <span class="font-bold text-emerald-600 dark:text-emerald-400 w-8">3-4</span>
              <span class="flex-1 text-slate-600 dark:text-slate-400">Moderado / Um pouco difícil</span>
            </div>
            <div class="flex justify-between items-center p-3 bg-orange-50/50 dark:bg-orange-900/10 rounded-xl text-sm">
              <span class="font-bold text-orange-600 dark:text-orange-400 w-8">5-6</span>
              <span class="flex-1 text-slate-600 dark:text-slate-400">Difícil</span>
            </div>
            <div class="flex justify-between items-center p-3 bg-rose-50/50 dark:bg-rose-900/10 rounded-xl text-sm">
              <span class="font-bold text-rose-600 dark:text-rose-400 w-8">7-9</span>
              <span class="flex-1 text-slate-600 dark:text-slate-400">Muito difícil</span>
            </div>
            <div class="flex justify-between items-center p-3 bg-red-100/50 dark:bg-red-900/20 rounded-xl text-sm">
              <span class="font-bold text-red-700 dark:text-red-400 w-8">10</span>
              <span class="flex-1 text-slate-600 dark:text-slate-400">Exaustivo (Máximo)</span>
            </div>
          </div>
        </div>

        <!-- Testes Ortopédicos -->
        <div class="bg-white dark:bg-slate-800 rounded-3xl p-5 md:p-6 shadow-sm border border-slate-200/60 dark:border-slate-700/50 md:col-span-2">
          <div class="flex items-center gap-3 mb-5 text-emerald-600 dark:text-emerald-400">
            <div class="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center">
              <mat-icon>health_and_safety</mat-icon>
            </div>
            <h3 class="text-lg font-bold text-slate-800 dark:text-white leading-tight">Testes Ortopédicos Específicos</h3>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            
            <!-- Ombro -->
            <details class="group bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
              <summary class="flex justify-between items-center font-medium cursor-pointer list-none p-4 text-slate-800 dark:text-white">
                <span class="flex items-center gap-2"><mat-icon class="text-slate-400 text-[18px]">front_hand</mat-icon> Ombro</span>
                <span class="transition group-open:rotate-180"><mat-icon>expand_more</mat-icon></span>
              </summary>
              <div class="text-sm text-slate-600 dark:text-slate-400 p-4 pt-0 border-t border-slate-200 dark:border-slate-700 mt-2 space-y-2">
                <p><strong>Neer:</strong> Impacto subacromial.</p>
                <p><strong>Hawkins-Kennedy:</strong> Impacto subacromial.</p>
                <p><strong>Jobe (Lata Vazia):</strong> Lesão do supraespinhal.</p>
                <p><strong>Gerber (Lift-off):</strong> Lesão do subescapular.</p>
                <p><strong>Speed (Palm-up):</strong> Tendinite bicipital.</p>
                <p><strong>Yergason:</strong> Instabilidade do tendão bicipital.</p>
                <p><strong>Apreensão:</strong> Instabilidade anterior do ombro.</p>
                <p><strong>Queda do Braço (Drop Arm):</strong> Ruptura extensa do manguito rotador.</p>
              </div>
            </details>

            <!-- Cotovelo e Punho -->
            <details class="group bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
              <summary class="flex justify-between items-center font-medium cursor-pointer list-none p-4 text-slate-800 dark:text-white">
                <span class="flex items-center gap-2"><mat-icon class="text-slate-400 text-[18px]">pan_tool</mat-icon> Cotovelo e Punho</span>
                <span class="transition group-open:rotate-180"><mat-icon>expand_more</mat-icon></span>
              </summary>
              <div class="text-sm text-slate-600 dark:text-slate-400 p-4 pt-0 border-t border-slate-200 dark:border-slate-700 mt-2 space-y-2">
                <p><strong>Cozen:</strong> Epicondilite lateral (Tênis).</p>
                <p><strong>Mill:</strong> Epicondilite lateral.</p>
                <p><strong>Cotovelo de Golfe:</strong> Epicondilite medial.</p>
                <p><strong>Phalen / Phalen Invertido:</strong> Síndrome do Túnel do Carpo.</p>
                <p><strong>Tinel (Punho):</strong> Síndrome do Túnel do Carpo.</p>
                <p><strong>Finkelstein:</strong> Tenossinovite de De Quervain.</p>
              </div>
            </details>

            <!-- Coluna Cervical e Lombar -->
            <details class="group bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
              <summary class="flex justify-between items-center font-medium cursor-pointer list-none p-4 text-slate-800 dark:text-white">
                <span class="flex items-center gap-2"><mat-icon class="text-slate-400 text-[18px]">accessibility_new</mat-icon> Coluna Cervical e Lombar</span>
                <span class="transition group-open:rotate-180"><mat-icon>expand_more</mat-icon></span>
              </summary>
              <div class="text-sm text-slate-600 dark:text-slate-400 p-4 pt-0 border-t border-slate-200 dark:border-slate-700 mt-2 space-y-2">
                <p><strong>Spurling:</strong> Radiculopatia cervical.</p>
                <p><strong>Distração Cervical:</strong> Alívio de compressão radicular.</p>
                <p><strong>Lasègue (SLR):</strong> Radiculopatia lombar / Compressão do Ciático.</p>
                <p><strong>Slump Test:</strong> Tensão neural / Radiculopatia lombar.</p>
                <p><strong>Schober:</strong> Mobilidade da coluna lombar (Espondilite Anquilosante).</p>
                <p><strong>Milgram:</strong> Patologia intratecal / Hérnia de disco.</p>
              </div>
            </details>

            <!-- Quadril -->
            <details class="group bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
              <summary class="flex justify-between items-center font-medium cursor-pointer list-none p-4 text-slate-800 dark:text-white">
                <span class="flex items-center gap-2"><mat-icon class="text-slate-400 text-[18px]">airline_seat_legroom_extra</mat-icon> Quadril</span>
                <span class="transition group-open:rotate-180"><mat-icon>expand_more</mat-icon></span>
              </summary>
              <div class="text-sm text-slate-600 dark:text-slate-400 p-4 pt-0 border-t border-slate-200 dark:border-slate-700 mt-2 space-y-2">
                <p><strong>Thomas:</strong> Encurtamento de flexores do quadril (Iliopsoas).</p>
                <p><strong>Trendelenburg:</strong> Fraqueza de glúteo médio.</p>
                <p><strong>Patrick (FABER):</strong> Patologia sacroilíaca ou coxo-femoral.</p>
                <p><strong>Ober:</strong> Encurtamento do trato iliotibial.</p>
                <p><strong>Ely:</strong> Encurtamento do reto femoral.</p>
                <p><strong>Piriforme:</strong> Síndrome do piriforme.</p>
              </div>
            </details>

            <!-- Joelho -->
            <details class="group bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
              <summary class="flex justify-between items-center font-medium cursor-pointer list-none p-4 text-slate-800 dark:text-white">
                <span class="flex items-center gap-2"><mat-icon class="text-slate-400 text-[18px]">directions_walk</mat-icon> Joelho</span>
                <span class="transition group-open:rotate-180"><mat-icon>expand_more</mat-icon></span>
              </summary>
              <div class="text-sm text-slate-600 dark:text-slate-400 p-4 pt-0 border-t border-slate-200 dark:border-slate-700 mt-2 space-y-2">
                <p><strong>Lachman:</strong> Lesão do Ligamento Cruzado Anterior (LCA).</p>
                <p><strong>Gaveta Anterior:</strong> Lesão do LCA.</p>
                <p><strong>Gaveta Posterior:</strong> Lesão do Ligamento Cruzado Posterior (LCP).</p>
                <p><strong>Estresse em Valgo:</strong> Lesão do Ligamento Colateral Medial (LCM).</p>
                <p><strong>Estresse em Varo:</strong> Lesão do Ligamento Colateral Lateral (LCL).</p>
                <p><strong>McMurray:</strong> Lesão meniscal.</p>
                <p><strong>Apley (Compressão/Tração):</strong> Lesão meniscal vs ligamentar.</p>
                <p><strong>Sinal de Clarke:</strong> Condromalácia patelar.</p>
              </div>
            </details>

            <!-- Tornozelo e Pé -->
            <details class="group bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
              <summary class="flex justify-between items-center font-medium cursor-pointer list-none p-4 text-slate-800 dark:text-white">
                <span class="flex items-center gap-2"><mat-icon class="text-slate-400 text-[18px]">do_not_step</mat-icon> Tornozelo e Pé</span>
                <span class="transition group-open:rotate-180"><mat-icon>expand_more</mat-icon></span>
              </summary>
              <div class="text-sm text-slate-600 dark:text-slate-400 p-4 pt-0 border-t border-slate-200 dark:border-slate-700 mt-2 space-y-2">
                <p><strong>Gaveta Anterior (Tornozelo):</strong> Lesão do ligamento talofibular anterior.</p>
                <p><strong>Talar Tilt (Inversão):</strong> Lesão do ligamento calcaneofibular.</p>
                <p><strong>Thompson:</strong> Ruptura do tendão de Aquiles.</p>
                <p><strong>Homan:</strong> Trombose Venosa Profunda (TVP) - *Uso com cautela*.</p>
                <p><strong>Windlass:</strong> Fascite plantar.</p>
              </div>
            </details>

          </div>
        </div>

        <!-- Goniometry Reference -->
        <div class="bg-white dark:bg-slate-800 rounded-3xl p-5 md:p-6 shadow-sm border border-slate-200/60 dark:border-slate-700/50 md:col-span-2">
          <div class="flex items-center gap-3 mb-5 text-emerald-600 dark:text-emerald-400">
            <div class="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center">
              <mat-icon>accessibility_new</mat-icon>
            </div>
            <h3 class="text-lg font-bold text-slate-800 dark:text-white leading-tight">Valores de Referência ADM (Goniometria)</h3>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div class="p-4 bg-slate-50/80 dark:bg-slate-900/40 rounded-2xl border border-slate-100 dark:border-slate-800/50">
              <h4 class="font-bold text-slate-800 dark:text-white mb-3 flex items-center gap-2">
                <mat-icon class="text-slate-400 text-[18px]">front_hand</mat-icon> Ombro
              </h4>
              <ul class="text-sm text-slate-600 dark:text-slate-400 space-y-2">
                <li class="flex justify-between border-b border-slate-200/50 dark:border-slate-700/50 pb-1.5"><span>Flexão</span> <span class="font-mono font-medium text-slate-800 dark:text-slate-300">0° - 180°</span></li>
                <li class="flex justify-between border-b border-slate-200/50 dark:border-slate-700/50 pb-1.5"><span>Extensão</span> <span class="font-mono font-medium text-slate-800 dark:text-slate-300">0° - 45°/60°</span></li>
                <li class="flex justify-between border-b border-slate-200/50 dark:border-slate-700/50 pb-1.5"><span>Abdução</span> <span class="font-mono font-medium text-slate-800 dark:text-slate-300">0° - 180°</span></li>
                <li class="flex justify-between border-b border-slate-200/50 dark:border-slate-700/50 pb-1.5"><span>Rot. Interna</span> <span class="font-mono font-medium text-slate-800 dark:text-slate-300">0° - 70°</span></li>
                <li class="flex justify-between"><span>Rot. Externa</span> <span class="font-mono font-medium text-slate-800 dark:text-slate-300">0° - 90°</span></li>
              </ul>
            </div>
            <div class="p-4 bg-slate-50/80 dark:bg-slate-900/40 rounded-2xl border border-slate-100 dark:border-slate-800/50">
              <h4 class="font-bold text-slate-800 dark:text-white mb-3 flex items-center gap-2">
                <mat-icon class="text-slate-400 text-[18px]">pan_tool</mat-icon> Cotovelo & Punho
              </h4>
              <ul class="text-sm text-slate-600 dark:text-slate-400 space-y-2">
                <li class="flex justify-between border-b border-slate-200/50 dark:border-slate-700/50 pb-1.5"><span>Flexão Cotovelo</span> <span class="font-mono font-medium text-slate-800 dark:text-slate-300">0° - 145°</span></li>
                <li class="flex justify-between border-b border-slate-200/50 dark:border-slate-700/50 pb-1.5"><span>Pron./Supin.</span> <span class="font-mono font-medium text-slate-800 dark:text-slate-300">0° - 90°</span></li>
                <li class="flex justify-between border-b border-slate-200/50 dark:border-slate-700/50 pb-1.5"><span>Flexão Punho</span> <span class="font-mono font-medium text-slate-800 dark:text-slate-300">0° - 80°</span></li>
                <li class="flex justify-between"><span>Extensão Punho</span> <span class="font-mono font-medium text-slate-800 dark:text-slate-300">0° - 70°</span></li>
              </ul>
            </div>
            <div class="p-4 bg-slate-50/80 dark:bg-slate-900/40 rounded-2xl border border-slate-100 dark:border-slate-800/50">
              <h4 class="font-bold text-slate-800 dark:text-white mb-3 flex items-center gap-2">
                <mat-icon class="text-slate-400 text-[18px]">directions_walk</mat-icon> Quadril & Joelho
              </h4>
              <ul class="text-sm text-slate-600 dark:text-slate-400 space-y-2">
                <li class="flex justify-between border-b border-slate-200/50 dark:border-slate-700/50 pb-1.5"><span>Flexão Quadril</span> <span class="font-mono font-medium text-slate-800 dark:text-slate-300">0° - 125°</span></li>
                <li class="flex justify-between border-b border-slate-200/50 dark:border-slate-700/50 pb-1.5"><span>Extensão Quadril</span> <span class="font-mono font-medium text-slate-800 dark:text-slate-300">0° - 15°</span></li>
                <li class="flex justify-between border-b border-slate-200/50 dark:border-slate-700/50 pb-1.5"><span>Abdução Quadril</span> <span class="font-mono font-medium text-slate-800 dark:text-slate-300">0° - 45°</span></li>
                <li class="flex justify-between"><span>Flexão Joelho</span> <span class="font-mono font-medium text-slate-800 dark:text-slate-300">0° - 140°</span></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ToolsComponent {
  // IMC
  weight = signal<number | null>(null);
  height = signal<number | null>(null);
  imcResult = signal<number | null>(null);
  imcCategory = signal<string>('');

  calculateIMC() {
    const w = this.weight();
    const h = this.height();
    if (w && h) {
      const heightInMeters = h / 100;
      const imc = w / (heightInMeters * heightInMeters);
      this.imcResult.set(imc);
      
      if (imc < 18.5) this.imcCategory.set('Abaixo do peso');
      else if (imc < 24.9) this.imcCategory.set('Peso normal');
      else if (imc < 29.9) this.imcCategory.set('Sobrepeso');
      else if (imc < 34.9) this.imcCategory.set('Obesidade Grau I');
      else if (imc < 39.9) this.imcCategory.set('Obesidade Grau II');
      else this.imcCategory.set('Obesidade Grau III');
    }
  }

  // 1RM
  rmWeight = signal<number | null>(null);
  rmReps = signal<number | null>(null);
  rmResult = signal<number | null>(null);

  calculate1RM() {
    const w = this.rmWeight();
    const r = this.rmReps();
    if (w && r) {
      // Brzycki formula: 1RM = Weight / (1.0278 - 0.0278 * Reps)
      const rm = w / (1.0278 - 0.0278 * r);
      this.rmResult.set(rm);
    }
  }

  // Karvonen
  age = signal<number | null>(null);
  restingHr = signal<number | null>(null);
  karvonenResult = signal<{max: number, z1: [number, number], z2: [number, number], z3: [number, number]} | null>(null);

  calculateKarvonen() {
    const a = this.age();
    const r = this.restingHr();
    if (a && r) {
      const max = 220 - a;
      const reserve = max - r;
      this.karvonenResult.set({
        max,
        z1: [Math.round(reserve * 0.5 + r), Math.round(reserve * 0.6 + r)],
        z2: [Math.round(reserve * 0.6 + r), Math.round(reserve * 0.7 + r)],
        z3: [Math.round(reserve * 0.7 + r), Math.round(reserve * 0.8 + r)],
      });
    }
  }
}
