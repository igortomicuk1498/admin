import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Note } from '../mocks/note';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class NotesListService {
  private siteUrl = environment.apiServer;

  constructor(private http: HttpClient) { }

  getNotes(): Observable<Note[]> {
    return this.http.get<Note[]>(this.siteUrl + '/api/notes');
  }

  createNote(noteTitle: string, noteThumb: File, noteText: string) {
    var formData: any = new FormData();
    formData.append("noteTitle", noteTitle);
    formData.append("noteThumb", noteThumb);
    formData.append("noteText", noteText);

    return this.http.post(this.siteUrl + '/api/notes', formData);
  }

  updateNote(id: string, noteTitle: string, noteThumb: File, noteText: string) {
    var formData: any = new FormData();
    formData.append("noteId", id);
    formData.append("noteTitle", noteTitle);
    formData.append("noteThumb", noteThumb);
    formData.append("noteText", noteText);

    return this.http.post(this.siteUrl + '/api/notes/' + id, formData);
  }

  deleteNote(id: string) {
    return this.http.delete(this.siteUrl + '/api/notes/' + id);
  }

  getNote(id: string) {
    return this.http.get(this.siteUrl + '/api/notes/' + id);
  }

}
