import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotesListService } from '../../services/notes-list.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import {Note} from '../../mocks/note';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'new-note',
  templateUrl: './new-note.component.html'
})

export class NewNote implements OnInit {
  host = environment.apiServer;
  preview: string;
  newNoteForm: FormGroup;
  selectedFile: null;
  formLoading: boolean = false;
  progressSpinner = {
    color: 'primary',
    mode: 'indeterminate'
  }
  // variables for editing notes
  noteId: string = '';
  note: any;

  constructor(
    private fb: FormBuilder,
    public notesListService: NotesListService,
    private matSnackBar: MatSnackBar,
    private activatedRoute: ActivatedRoute,
  ) {

    this.noteId = activatedRoute.snapshot.params['id'];

    this.newNoteForm = this.fb.group({
      noteTitle: ['', [
        Validators.required
      ]],
      noteThumb: [null, [
        Validators.required
      ]],
      noteText: ['', [
        Validators.required
      ]]
    })
  }

  ngOnInit(): void {
    if(this.noteId) {
      this.getNote();
    }
  }

  getNote() {
    this.notesListService.getNote(this.noteId)
      .subscribe((data: Note) => {
        console.log(data);
        this.note = data;
        this.preview = environment.apiServer + data.thumb;
        this.newNoteForm.patchValue({
          noteTitle: data.title,
          noteThumb: data.thumb,
          noteText: data.text,
        });
      })
  }

  uploadFile(event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.newNoteForm.patchValue({
      noteThumb: file
    });
    this.newNoteForm.get('noteThumb').updateValueAndValidity();

    const reader = new FileReader();
    reader.onload = () => {
      this.preview = reader.result as string;
    }
    reader.readAsDataURL(file);
    this.selectedFile = this.newNoteForm.value.noteThumb;
    console.log(this.newNoteForm.value.noteThumb);
  }

  submit() {
    this.formLoading = true;
    if(this.note) {
      this.notesListService.updateNote(
        this.noteId,
        this.newNoteForm.value.noteTitle,
        this.newNoteForm.value.noteThumb,
        this.newNoteForm.value.noteText,
        )
        .subscribe((data: any) => {
          this.formLoading = false;
          this.matSnackBar.open(data.text, 'Ok', {
            duration: 5000,
          });
        });
    } else {
      this.notesListService.createNote(
        this.newNoteForm.value.noteTitle,
        this.newNoteForm.value.noteThumb,
        this.newNoteForm.value.noteText,
      ).subscribe((data: any) => {
        this.newNoteForm.reset();
        this.selectedFile = null;
        this.preview = '';
        Object.keys(this.newNoteForm.controls).forEach((name) => {
          let control = this.newNoteForm.controls[name];
          control.setErrors(null);
        });
        this.newNoteForm.markAsUntouched();
        this.matSnackBar.open(data.text, 'Ok', {
          duration: 5000,
        });

        this.formLoading = false;
      });
    }
  }
}
