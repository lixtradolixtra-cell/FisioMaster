import {Routes} from '@angular/router';
import { MuscleListComponent } from './components/muscle-list/muscle-list.component';
import { MuscleDetailComponent } from './components/muscle-detail/muscle-detail.component';
import { SearchComponent } from './components/search/search.component';
import { ChatbotComponent } from './components/chatbot/chatbot.component';

export const routes: Routes = [
  { path: '', redirectTo: '/muscles', pathMatch: 'full' },
  { path: 'muscles', component: MuscleListComponent },
  { path: 'muscle/:id', component: MuscleDetailComponent },
  { path: 'search', component: SearchComponent },
  { path: 'chat', component: ChatbotComponent },
];
