
import { Routes } from '@angular/router';
import { HomeComponent } from './components/home.component';
import { ReadingComponent } from './components/reading.component';
import { JournalComponent } from './components/journal.component';
import { LibraryComponent } from './components/library.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'reading', component: ReadingComponent },
  { path: 'journal', component: JournalComponent },
  { path: 'library', component: LibraryComponent },
  { path: '**', redirectTo: '' }
];
