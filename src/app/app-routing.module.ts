import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { notesList } from './components/notesList/notes-list.component';
import { NewNote } from './components/newNote/new-note.component';

const routes: Routes = [
  {path: '', component: notesList},
  {path: 'new-note', component: NewNote},
  {path: 'edit-note/:id', component: NewNote},
  { path: '',
    redirectTo: '/admin',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
