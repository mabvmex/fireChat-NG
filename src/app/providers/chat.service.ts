import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Mensaje } from "../interface/mensaje.interface";
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class ChatService {
  private chatsCollection: AngularFirestoreCollection<Mensaje>;
  public chats: Mensaje[] = [];

  constructor( private afs : AngularFirestore ) { 

  }

  cargarMensajes() {
    this.chatsCollection = this.afs.collection<Mensaje>('chats', ref => ref.orderBy('fecha', 'desc').limit(5))
    return this.chatsCollection.valueChanges().pipe(map((mensajes: Mensaje[]) => {
    	console.log(mensajes);

    	this.chats = [];

    	for (let mensaje of mensajes) {
    		this.chats.unshift(mensaje)
    	}
    	return this.chats;
    })
    )
  }


agregarMensaje( texto: string) {
	let mensaje: Mensaje = {
		nombre: 'DEMO',
		mensaje: texto,
		fecha: new Date().getTime()
	}

	return this.chatsCollection.add(mensaje)
}

}