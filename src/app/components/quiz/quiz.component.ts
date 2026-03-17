import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

interface QuizQuestion {
  id: number;
  text: string;
  type: 'anatomy' | 'clinical';
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="max-w-4xl mx-auto p-4 md:p-8 pb-32 h-full flex flex-col">
      <div class="mb-6">
        <h1 class="text-3xl md:text-4xl font-display font-bold text-slate-800 dark:text-white mb-2">Quiz Clínico</h1>
        <p class="text-slate-600 dark:text-slate-400 text-sm md:text-base">Teste seus conhecimentos em anatomia e intervenções fisioterapêuticas.</p>
      </div>

      @if (!quizStarted()) {
        <div class="flex-1 flex flex-col items-center justify-center text-center bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-sm border border-slate-200/60 dark:border-slate-700/50">
          <div class="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-6">
            <mat-icon class="text-emerald-600 dark:text-emerald-400 text-4xl w-10 h-10">psychology</mat-icon>
          </div>
          <h2 class="text-2xl font-bold text-slate-800 dark:text-white mb-4">Pronto para o desafio?</h2>
          <p class="text-slate-600 dark:text-slate-400 mb-8 max-w-md">
            O quiz contém questões sobre origens, inserções, ações musculares e casos clínicos focados em intervenção fisioterapêutica.
          </p>
          <button (click)="startQuiz()" class="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-8 rounded-xl transition-colors w-full max-w-xs shadow-md shadow-emerald-600/20">
            Iniciar Quiz
          </button>
        </div>
      } @else if (quizCompleted()) {
        <div class="flex-1 flex flex-col items-center justify-center text-center bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-sm border border-slate-200/60 dark:border-slate-700/50">
          <div class="w-24 h-24 rounded-full flex items-center justify-center mb-6"
               [ngClass]="scorePercentage() >= 70 ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' : 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'">
            <mat-icon class="text-5xl w-12 h-12">{{ scorePercentage() >= 70 ? 'emoji_events' : 'school' }}</mat-icon>
          </div>
          <h2 class="text-3xl font-bold text-slate-800 dark:text-white mb-2">Quiz Concluído!</h2>
          <p class="text-slate-600 dark:text-slate-400 mb-6">Você acertou {{ score() }} de {{ questions.length }} questões.</p>
          
          <div class="w-full max-w-xs bg-slate-100 dark:bg-slate-900 rounded-2xl p-4 mb-8">
            <div class="text-sm text-slate-500 dark:text-slate-400 mb-1">Aproveitamento</div>
            <div class="text-3xl font-bold" [ngClass]="scorePercentage() >= 70 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'">
              {{ scorePercentage() }}%
            </div>
          </div>

          <button (click)="resetQuiz()" class="bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 dark:hover:bg-slate-600 text-white font-semibold py-3 px-8 rounded-xl transition-colors w-full max-w-xs">
            Tentar Novamente
          </button>
        </div>
      } @else {
        <div class="flex-1 flex flex-col">
          <!-- Progress Bar -->
          <div class="mb-6">
            <div class="flex justify-between text-sm font-semibold text-slate-500 dark:text-slate-400 mb-2">
              <span>Questão {{ currentQuestionIndex() + 1 }} de {{ questions.length }}</span>
              <span class="uppercase tracking-wider text-[10px] bg-slate-200 dark:bg-slate-700 px-2 py-1 rounded-md">
                {{ currentQuestion().type === 'clinical' ? 'Caso Clínico' : 'Anatomia' }}
              </span>
            </div>
            <div class="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div class="h-full bg-emerald-500 transition-all duration-300" [style.width.%]="((currentQuestionIndex() + 1) / questions.length) * 100"></div>
            </div>
          </div>

          <!-- Question Card -->
          <div class="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-200/60 dark:border-slate-700/50 mb-6 flex-1">
            <h3 class="text-lg md:text-xl font-medium text-slate-800 dark:text-white mb-6 leading-relaxed">
              {{ currentQuestion().text }}
            </h3>

            <div class="flex flex-col gap-3">
              @for (option of currentQuestion().options; track $index) {
                <button 
                  (click)="selectOption($index)"
                  [disabled]="isAnswered()"
                  class="text-left p-4 rounded-xl border-2 transition-all duration-200 relative overflow-hidden group"
                  [ngClass]="getOptionClass($index)">
                  <div class="flex items-start gap-3">
                    <div class="flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center mt-0.5 transition-colors"
                         [ngClass]="getOptionIconClass($index)">
                      @if (isAnswered() && $index === currentQuestion().correctAnswerIndex) {
                        <mat-icon class="text-[16px] w-4 h-4">check</mat-icon>
                      } @else if (isAnswered() && $index === selectedOption() && $index !== currentQuestion().correctAnswerIndex) {
                        <mat-icon class="text-[16px] w-4 h-4">close</mat-icon>
                      } @else {
                        <span class="text-xs font-bold">{{ ['A', 'B', 'C', 'D'][$index] }}</span>
                      }
                    </div>
                    <span class="text-sm md:text-base font-medium">{{ option }}</span>
                  </div>
                </button>
              }
            </div>

            <!-- Explanation Area -->
            @if (isAnswered()) {
              <div class="mt-6 p-4 rounded-xl" 
                   [ngClass]="selectedOption() === currentQuestion().correctAnswerIndex ? 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/50' : 'bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800/50'">
                <div class="flex items-center gap-2 mb-2 font-bold"
                     [ngClass]="selectedOption() === currentQuestion().correctAnswerIndex ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-700 dark:text-rose-400'">
                  <mat-icon>{{ selectedOption() === currentQuestion().correctAnswerIndex ? 'check_circle' : 'cancel' }}</mat-icon>
                  <span>{{ selectedOption() === currentQuestion().correctAnswerIndex ? 'Resposta Correta!' : 'Resposta Incorreta' }}</span>
                </div>
                <p class="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {{ currentQuestion().explanation }}
                </p>
              </div>
            }
          </div>

          <!-- Action Button -->
          <div class="flex justify-end">
            <button 
              (click)="nextQuestion()"
              [disabled]="!isAnswered()"
              class="flex items-center gap-2 bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 dark:hover:bg-slate-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              {{ currentQuestionIndex() === questions.length - 1 ? 'Finalizar Quiz' : 'Próxima Questão' }}
              <mat-icon>arrow_forward</mat-icon>
            </button>
          </div>
        </div>
      }
    </div>
  `
})
export class QuizComponent {
  questions: QuizQuestion[] = [
    {
      id: 1,
      type: 'clinical',
      text: 'Paciente com bruxismo apresenta dor intensa na região da mandíbula e dificuldade de oclusão. Qual músculo está hiperativado e qual a intervenção fisioterapêutica indicada?',
      options: [
        'Temporal / Fortalecimento isométrico',
        'Masseter / Liberação miofascial e termoterapia',
        'Pterigóideo lateral / Alongamento passivo forçado',
        'Bucinador / Eletroestimulação (FES)'
      ],
      correctAnswerIndex: 1,
      explanation: 'O masseter é um dos principais músculos da mastigação e oclusão. No bruxismo, ele sofre hiperatividade. A intervenção inicial envolve relaxamento muscular através de liberação miofascial e termoterapia (calor local).'
    },
    {
      id: 2,
      type: 'clinical',
      text: 'Recém-nascido apresenta inclinação da cabeça para a direita e rotação para a esquerda. O diagnóstico é torcicolo congênito. Qual músculo está encurtado e qual a ação principal deste músculo unilateralmente?',
      options: [
        'Escaleno anterior / Inclinação ipsilateral e rotação ipsilateral',
        'Trapézio superior / Extensão e rotação contralateral',
        'Esternocleidomastóideo direito / Inclinação ipsilateral e rotação contralateral',
        'Esplênio da cabeça / Inclinação contralateral e rotação ipsilateral'
      ],
      correctAnswerIndex: 2,
      explanation: 'O esternocleidomastóideo (ECOM), quando contraído unilateralmente, realiza a flexão lateral (inclinação) para o mesmo lado e a rotação da cabeça para o lado oposto.'
    },
    {
      id: 3,
      type: 'clinical',
      text: 'Paciente que trabalha 8 horas por dia no computador relata tensão constante na região cervical posterior e ombros, com elevação crônica das escápulas. Qual músculo está tensionado e qual a intervenção inicial?',
      options: [
        'Romboides / Fortalecimento concêntrico',
        'Trapézio superior / Alongamento, liberação miofascial e correção ergonômica',
        'Serrátil anterior / Exercícios de estabilização escapular',
        'Peitoral menor / Alongamento passivo'
      ],
      correctAnswerIndex: 1,
      explanation: 'O trapézio superior é responsável pela elevação da escápula e frequentemente acumula tensão em posturas inadequadas no computador. A conduta envolve relaxamento do músculo e ajustes ergonômicos.'
    },
    {
      id: 4,
      type: 'clinical',
      text: 'Nadador (estilo crawl) apresenta dor na região posterior do tronco durante a fase de puxada na água. O teste de força revela fraqueza na extensão, adução e rotação interna do ombro. Qual músculo está acometido?',
      options: [
        'Deltoide posterior',
        'Infraespinhal',
        'Latíssimo do dorso',
        'Redondo menor'
      ],
      correctAnswerIndex: 2,
      explanation: 'O latíssimo do dorso é um potente extensor, adutor e rotador interno do ombro, sendo o principal músculo propulsor na natação (estilo crawl).'
    },
    {
      id: 5,
      type: 'clinical',
      text: 'Paciente sofre ruptura do tendão da cabeça longa do bíceps braquial (Sinal do Popeye). Além da flexão do cotovelo, qual outra ação importante do antebraço estará enfraquecida?',
      options: [
        'Pronação',
        'Supinação',
        'Desvio ulnar',
        'Extensão do punho'
      ],
      correctAnswerIndex: 1,
      explanation: 'O bíceps braquial, além de fletir o cotovelo, é o mais potente supinador do antebraço (especialmente quando o cotovelo está fletido).'
    },
    {
      id: 6,
      type: 'clinical',
      text: 'Durante a avaliação da marcha, o fisioterapeuta observa o Sinal de Trendelenburg positivo (queda da pelve para o lado oposto ao membro de apoio). Qual músculo apresenta fraqueza e qual a intervenção indicada?',
      options: [
        'Glúteo máximo / Fortalecimento em cadeia cinética aberta',
        'Quadríceps / Agachamento profundo',
        'Glúteo médio do lado de apoio / Fortalecimento de abdutores do quadril',
        'Isquiotibiais / Alongamento passivo'
      ],
      correctAnswerIndex: 2,
      explanation: 'O glúteo médio é o principal estabilizador lateral da pelve. Sua fraqueza causa a queda da pelve contralateral durante a fase de apoio da marcha. O tratamento foca no fortalecimento dos abdutores.'
    },
    {
      id: 7,
      type: 'clinical',
      text: 'Paciente relata dor profunda na região glútea que irradia para a face posterior da coxa, piorando ao ficar muito tempo sentado. O teste de FAIR (Flexão, Adução e Rotação Interna) reproduz a dor. Qual a disfunção e o nervo possivelmente comprimido?',
      options: [
        'Síndrome do Trato Iliotibial / Nervo Femoral',
        'Síndrome do Piriforme / Nervo Isquiático (Ciático)',
        'Bursite trocantérica / Nervo Obturatório',
        'Tendinopatia patelar / Nervo Tibial'
      ],
      correctAnswerIndex: 1,
      explanation: 'A Síndrome do Piriforme ocorre quando o músculo piriforme sofre espasmo ou hipertrofia, comprimindo o nervo isquiático que passa logo abaixo (ou através) dele.'
    },
    {
      id: 8,
      type: 'clinical',
      text: 'Paciente apresenta marcha escarvante (pé caído) e incapacidade de realizar a dorsiflexão do tornozelo após trauma na região lateral do joelho (cabeça da fíbula). Qual músculo está comprometido e qual nervo foi possivelmente lesado?',
      options: [
        'Tibial Posterior / Nervo Tibial',
        'Tibial Anterior / Nervo Fibular Comum',
        'Gastrocnêmio / Nervo Isquiático',
        'Sóleo / Nervo Femoral'
      ],
      correctAnswerIndex: 1,
      explanation: 'O nervo fibular comum contorna a cabeça da fíbula e é superficial, sendo vulnerável a traumas. Sua lesão paralisa os dorsiflexores (principalmente o Tibial Anterior), resultando no "pé caído".'
    },
    {
      id: 9,
      type: 'clinical',
      text: 'Um corredor relata dor aguda na panturrilha direita ("pedrada") durante um sprint. Há dor à palpação do terço médio da perna e dor à dorsiflexão passiva. Qual a provável lesão e a conduta imediata (fase aguda 24-48h)?',
      options: [
        'Estiramento do Gastrocnêmio / Protocolo PRICE (Proteção, Repouso, Gelo, Compressão, Elevação)',
        'Tendinopatia de Aquiles / Alongamento agressivo e retorno à corrida',
        'Fratura de estresse da tíbia / Encaminhamento cirúrgico imediato',
        'Câimbra muscular / Massagem profunda e liberação miofascial intensa'
      ],
      correctAnswerIndex: 0,
      explanation: 'A sensação de "pedrada" durante aceleração é clássica do estiramento (lesão muscular) do gastrocnêmio. A conduta imediata é o protocolo PRICE (ou POLICE) para controlar o edema e proteger a lesão.'
    },
    {
      id: 10,
      type: 'clinical',
      text: 'Paciente idoso sofre queda sobre o ombro. Apresenta sinal de "Drop Arm" (Queda do Braço) positivo, não conseguindo sustentar a abdução a 90 graus ativamente. Qual a suspeita clínica e conduta fisioterapêutica conservadora inicial?',
      options: [
        'Luxação anterior do ombro / Redução imediata pelo fisioterapeuta',
        'Ruptura completa do manguito rotador (Supraespinhal) / Uso de tipoia, controle analgésico e encaminhamento ortopédico',
        'Bursite subacromial / Fortalecimento imediato de deltoide com halteres',
        'Capsulite adesiva / Mobilização articular grau IV sob dor'
      ],
      correctAnswerIndex: 1,
      explanation: 'O teste de Drop Arm positivo indica incapacidade de manter a abdução, sugerindo ruptura extensa do supraespinhal. A conduta inicial envolve proteção, analgesia e avaliação médica, pois rupturas completas podem ter indicação cirúrgica.'
    }
  ];

  quizStarted = signal(false);
  currentQuestionIndex = signal(0);
  selectedOption = signal<number | null>(null);
  isAnswered = signal(false);
  score = signal(0);
  quizCompleted = signal(false);

  currentQuestion = computed(() => this.questions[this.currentQuestionIndex()]);
  
  scorePercentage = computed(() => {
    return Math.round((this.score() / this.questions.length) * 100);
  });

  startQuiz() {
    this.quizStarted.set(true);
  }

  selectOption(index: number) {
    if (this.isAnswered()) return;
    
    this.selectedOption.set(index);
    this.isAnswered.set(true);
    
    if (index === this.currentQuestion().correctAnswerIndex) {
      this.score.update(s => s + 1);
    }
  }

  nextQuestion() {
    if (this.currentQuestionIndex() < this.questions.length - 1) {
      this.currentQuestionIndex.update(i => i + 1);
      this.selectedOption.set(null);
      this.isAnswered.set(false);
    } else {
      this.quizCompleted.set(true);
    }
  }

  resetQuiz() {
    this.quizStarted.set(false);
    this.currentQuestionIndex.set(0);
    this.selectedOption.set(null);
    this.isAnswered.set(false);
    this.score.set(0);
    this.quizCompleted.set(false);
  }

  // Styling helpers
  getOptionClass(index: number): string {
    if (!this.isAnswered()) {
      return this.selectedOption() === index 
        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400' 
        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-emerald-300 dark:hover:border-emerald-700 hover:bg-slate-50 dark:hover:bg-slate-800/80';
    }

    const isCorrect = index === this.currentQuestion().correctAnswerIndex;
    const isSelected = index === this.selectedOption();

    if (isCorrect) {
      return 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400';
    } else if (isSelected && !isCorrect) {
      return 'border-rose-500 bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-400';
    } else {
      return 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-400 dark:text-slate-500 opacity-60';
    }
  }

  getOptionIconClass(index: number): string {
    if (!this.isAnswered()) {
      return 'border-slate-300 dark:border-slate-600 text-slate-500 dark:text-slate-400';
    }

    const isCorrect = index === this.currentQuestion().correctAnswerIndex;
    const isSelected = index === this.selectedOption();

    if (isCorrect) {
      return 'border-emerald-500 bg-emerald-500 text-white';
    } else if (isSelected && !isCorrect) {
      return 'border-rose-500 bg-rose-500 text-white';
    } else {
      return 'border-slate-300 dark:border-slate-600 text-slate-400 dark:text-slate-500';
    }
  }
}
