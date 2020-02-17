import {Component, OnInit} from '@angular/core';
import { Note } from '../../mocks/note';
import { NotesListService } from '../../services/notes-list.service';
import { environment } from '../../../environments/environment';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'notes-list',
  templateUrl: 'notes-list.component.html'
})

export class notesList implements OnInit {
  host = environment.apiServer;
  notesLoading: boolean = true;
  searchValue: string = '';

  notes: Note[] = [];
  filteredNotes: Note[] = [];

  constructor(
    private notesListService: NotesListService,
    private matSnackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.getNotes();
  }

  getNotes(): void {
    this.notesListService.getNotes()
      .subscribe( (notes:Note[]) => {
        this.notes = notes;
        this.filteredNotes = notes;
        this.notesLoading = false;
        console.log(this.notes);
      });
  }

  deleteNote(id: string, index: number) {
    let deleteNote = confirm('Видалити нотатку?');

    if(deleteNote) {
      this.notes.splice(index, 1);
      this.notesListService.deleteNote(id)
        .subscribe((data :any) => {
          console.log(data);
          this.matSnackBar.open(data.text, 'Ok', {
            duration: 2000,
          });
        });
    }
  }

  searchNote(searchText: string) {
    if (searchText) {
      searchText = searchText.toLowerCase();
      this.filteredNotes = this.notes.filter(el => {
        return el.title.toLowerCase().indexOf(searchText) > -1;
      });
    } else {
      this.filteredNotes = this.notes;
    }
  }

}
