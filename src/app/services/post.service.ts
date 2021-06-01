import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { User } from '@firebase/auth-types';
import { Observable, of, from, observable, forkJoin } from 'rxjs';
import { map, finalize } from 'rxjs/operators';
import * as firebase from 'firebase';
import { textChangeRangeIsUnchanged } from 'typescript';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  currentUser: User;
  basePath: string = '/images';
  posting: boolean = false;

  constructor(private afs: AngularFirestore, private afa: AngularFireAuth, private storage: AngularFireStorage) { 
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

  //  isPosting(): Observable<boolean> {
  //    var subject = new Subject<boolean>();
  //    this.posting.pipe()
  //    return ;
  //  }

  //  postMessage(message: string, ownerName: string, otherItems): void {
    postMessage(post: PostData, postImage: any): Observable<any> {

      console.log("postMessage");
      console.log(postImage);

      post.time = firebase.default.firestore.FieldValue.serverTimestamp();

      if (postImage != null) {

        //Upload image
        const fileName = `${postImage.name}_${new Date().getTime()}`;
        const filePath = `${this.basePath}/${fileName}`;
        const storageRef = this.storage.ref(filePath);
        const uploadTask = this.storage.upload(filePath, postImage);

        return uploadTask.snapshotChanges().pipe(
          finalize(() => {
            storageRef.getDownloadURL().subscribe(downloadURL => {
              post.imageUrl = downloadURL;
              post.imageName = fileName;
              // this.saveFileData(fileUpload);

              //Create post in Firebase with link to image
              this.afs.collection('posts').add(post)
              .then(res => console.log(res))
              .catch(err => console.log(err));

            });
          })
        );
      }
      else {
        
        //Create post in Firebase without image
        this.afs.collection('posts').add(post)
        .then(res => {
          console.log(res);
          return of(res);
        })
        .catch(err => console.log(err));
        
        return of("Post creation without image complete!");
      }

      
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

   //Removes post and any associated image
   removePost(post: PostData): void {

    this.deletePost(post.id);
    if (post.imageName) {
      this.deleteImage(post.imageName);
      console.log("Deleted image " + post.imageName);
    }
   }

   //Remove post from firebase database
   private deletePost(postId: string): void {

    this.afs.collection('posts').doc(postId).delete()
    .then(result => console.log("Deleted post " + postId))
    .catch(err => console.error(err));
   }

   //Remove image from firebase storage
   private deleteImage(imageName: string): void {
    const storageRef = this.storage.ref(this.basePath);
    storageRef.child(imageName).delete();
   }

   updatePostTextAndImage(postId: string, postText: string, oldImage: string, postImage: any): Observable<any> {
     return forkJoin([
      this.updatePostText(postId, postText),
      this.updatePostImage(postId, oldImage, postImage)
     ]);
   }

   updatePostText(postId: string, postText: string): Observable<any> {
    return from(this.afs.collection('posts').doc(postId).update({
        message: postText
      }));
   }

   updatePostImage(postId: string, oldImage: string, postImage: any): any {

    //If new image is not null
    if (postImage != null) {

      //Delete old image if exists
      if (oldImage !== "")
        this.deleteImage(oldImage);

      //Upload image
      const fileName = `${postImage.name}_${new Date().getTime()}`;
      const filePath = `${this.basePath}/${fileName}`;
      const storageRef = this.storage.ref(filePath);
      const uploadTask = this.storage.upload(filePath, postImage);

      return uploadTask.snapshotChanges().pipe(
        finalize(() => {
          storageRef.getDownloadURL().subscribe(downloadURL => {
            let imageUrl = downloadURL;
            let imageName = fileName;

            //Update post in Firebase with link to new image
            this.afs.collection('posts').doc(postId).update(
              {
                imageUrl: imageUrl,
                imageName: imageName
              }
            )
            .then(res => console.log(res))
            .catch(err => console.log(err));
          });
        })
      );
    }
    //If new image IS NULL
    else {
      this.deleteImage(oldImage);

      //Update post in Firebase with link no image
      return from(
        this.afs.collection('posts').doc(postId).update(
        {
          imageUrl: '',
          imageName: ''
        }
      ));
      // .then(res => console.log(res))
      // .catch(err => console.log(err));
    }
   }

   updatePost(postId: string, postText: string, postImage: any): void {
  //  Promise<any> {
    
    // THIS METHOD NEEDS TO BE UPDATED ASAP

    // if postText != already posted text 
    // if postImage != already posted image or  postImage is a new image
    // return this.afs.collection('posts').doc(postId).update({
    //   message: postText
    //   // time: firebase.default.firestore.FieldValue.serverTimestamp()
    // });


    // .then(() => {
    //   console.log("Document successfully updated!");
    // })
    // .catch((error) => {
    //     console.error("Error updating document: ", error);
    // });
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
  imageUrl?: string,
  imageName?: string,
  id?: string
}
