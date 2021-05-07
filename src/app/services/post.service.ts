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

  //  postMessage(message: string, ownerName: string, otherItems): void {
    postMessage(post: PostData): void {

      post.time = firebase.default.firestore.FieldValue.serverTimestamp();

      this.afs.collection('posts').add(post)
      .then(res => console.log(res))
      .catch(err => console.log(err));

    // this.afs.collection('posts').add({
    //   message,
    //   title: ownerName,
    //   user_id: this.currentUser.uid,
    //   time: firebase.default.firestore.FieldValue.serverTimestamp(),
    //   likes: [],
    //   ...otherItems
    // }).then(res => console.log(res)).catch(err => console.log(err))
    // ;
    
   }

   dislikePost(postId: string, userId: string): void {
    
    var docRef = this.afs.collection('posts').doc(postId);

    docRef.update({
      likes: firebase.default.firestore.FieldValue.arrayRemove(userId)
    });

   }

   likePost(postId: string, userId: string): void {

    var docRef = this.afs.collection('posts').doc(postId);

    docRef.update({
      likes: firebase.default.firestore.FieldValue.arrayUnion(userId)
    });

   }

   deletePost(postId: string): void {

    this.afs.collection('posts').doc(postId).delete()
    .then(result => console.log("Deleted post " + postId))
    .catch(err => console.error(err))
   }
}

export interface PostData {
  avatar: string,
  firstName: string,
  lastName: string,
  likes: string[],
  message: string,
  time?: {},
  title: string,
  user_id: string,
  id?: string
}
