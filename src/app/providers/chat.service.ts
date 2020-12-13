import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';


@Injectable({
  providedIn: 'root'
})

export class ChatService {
  private chatsCollection: AngularFirestoreCollection<any>;
  public chats: any[] = [];

  constructor( private afs : AngularFirestore ) { 

  }


  cargarMensajes() {
    this.chatsCollection = this.afs.collection<any>('chats');
    return this.chatsCollection.valueChanges();
  }
}
