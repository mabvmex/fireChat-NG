import { Injectable } from "@angular/core";
import { AngularFirestore, AngularFirestoreCollection } from "@angular/fire/firestore";
import { Mensaje } from "../interface/mensaje.interface";
import { map } from "rxjs/operators";
import { AngularFireAuth } from "@angular/fire/auth";
import firebase from "firebase/app";

@Injectable({
  providedIn: "root",
})
export class ChatService {
  private chatsCollection: AngularFirestoreCollection<Mensaje>;
  public chats: Mensaje[] = [];

  public usuario: any = {};

  constructor(private afs: AngularFirestore, public afAuth: AngularFireAuth) {
    this.afAuth.authState.subscribe((usuario) => {
	  console.log("Estado del usuario: ", usuario);
	  
	  if(!usuario){
		  return;
	  }
	  this.usuario.nombre = usuario.displayName;
	  this.usuario.uid = usuario.uid;
    });
  }

  login(proveedor: string) {
	  if(proveedor === 'google'){
		this.afAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider());

	} if(proveedor === 'github') {
		this.afAuth.signInWithPopup(new firebase.auth.GithubAuthProvider());

	} if(proveedor === 'facebook') {
		this.afAuth.signInWithPopup(new firebase.auth.FacebookAuthProvider());
	}
  }

  logout() {
	  this.usuario = {};
    this.afAuth.signOut();
  }

  cargarMensajes() {
    this.chatsCollection = this.afs.collection<Mensaje>("chats", (ref) =>
      ref.orderBy("fecha", "desc").limit(5)
    );
    return this.chatsCollection.valueChanges().pipe(
      map((mensajes: Mensaje[]) => {
        console.log(mensajes);

        this.chats = [];

        for (let mensaje of mensajes) {
          this.chats.unshift(mensaje);
        }
        return this.chats;
      })
    );
  }

  agregarMensaje(texto: string) {
    let mensaje: Mensaje = {
      nombre: this.usuario.nombre,
      mensaje: texto,
      fecha: new Date().getTime(),
      uid: this.usuario.uid
    };

    return this.chatsCollection.add(mensaje);
  }

}
