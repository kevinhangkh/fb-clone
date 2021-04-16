import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from '@firebase/auth-types';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  currentUser: User;

  constructor(private afs: AngularFirestore, private afa: AngularFireAuth) { 
    this.afa.authState.subscribe(user => {this.currentUser = user});
   }

   getAllPosts(): Observable<any> {
    return this.afs.collection<any>('posts', ref => ref.orderBy('time','desc'))
      .snapshotChanges()
      .pipe(
        map(actions => {
          return actions.map(item => {
            return {
              id: item.payload.doc.id,
              ...item.payload.doc.data()
            }
          })
        })
      );
   }

   postMessage(message: string, ownerName: string, otherItems): void {
    this.afs.collection('posts').add({
      message,
      title: ownerName,
      user_id: this.currentUser.uid,
      time: firebase.default.firestore.FieldValue.serverTimestamp(),
      ...otherItems
    }).then(res => console.log(res)).catch(err => console.log(err))
    ;
    
   }
}
