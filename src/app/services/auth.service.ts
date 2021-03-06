import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { User } from '@firebase/auth-types';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { UserData } from '../shared/userdata.model';
import { MiscdataService } from './miscdata.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  private userData: Observable<User>
  private currentUser: UserData;
  private currentUser$: BehaviorSubject<UserData> = new BehaviorSubject<UserData>(null);
  private userDataSub;

  constructor(private afs: AngularFirestore, private afa: AngularFireAuth, private router: Router, private miscdataService: MiscdataService) { 
    
    this.userData = afa.authState;
    
    this.userDataSub = this.userData.subscribe(user => {
      if (user) {
        this.afs.collection<UserData>('users')
        .doc<UserData>(user.uid)
        .valueChanges()
        .subscribe(currentUser => {
          if (currentUser != undefined) {
            this.currentUser = currentUser;
            this.currentUser.id = user.uid;
            this.currentUser$.next(this.currentUser);
          }
          else {
            this.currentUser = null;
            this.currentUser$.next(this.currentUser);
          }
        })
      }
    });

    // userDataSub.unsubscribe();
  }
  
  CurrentUser(): Observable<UserData> {
    return this.currentUser$.asObservable();
  }
  
  SignUp(email: string,
    password: string,
    firstName: string,
    lastName: string,
    avatar = MiscdataService.avatars[Math.floor(Math.random() * MiscdataService.avatars.length)],
    mutualFriends = Math.floor(Math.random() * MiscdataService.maxMutualFriends + 1),
    school = MiscdataService.schools[Math.floor(Math.random() * MiscdataService.schools.length)]
    ): void {
      
      this.afa.createUserWithEmailAndPassword(email, password)
      .then(res => {
        if (res) {
          this.afs.collection<UserData>('users')
          .doc<UserData>(res.user.uid)
          .set({
            firstName,
            lastName,
            email,
            avatar,
            mutualFriends,
            school

          }).then(() => {
            this.afs.collection<UserData>('users')
            .doc(res.user.uid)
            .valueChanges()
            .subscribe(user => {
              if (user) {
                this.currentUser = user;
                this.currentUser.id = res.user.uid;
                this.currentUser$.next(this.currentUser);
              }
            });
          }).catch(err => console.log(err));
        }
      }).catch(err => console.log(err));
      
    }

    get UserData(): Observable<User> {
      return this.userData;
    }

    SignIn(email: string, password: string): any {
      return this.afa.signInWithEmailAndPassword(email, password)
      .then(res => {
        this.userData = this.afa.authState;
        
        this.afs.collection<UserData>('users')
            .doc(res.user.uid)
            .valueChanges()
            .subscribe(user => {
              if (user) {
                this.currentUser = user;
                this.currentUser$.next(this.currentUser);
              }
            });
          })
          // .catch(err => {
          //   // console.log("in service " + err);
          //   // throwError(err);
          //   alert(err.message);
          //   throw new Error(err);
          // });
    }

    LogOut(): void {

      // this.userDataSub.unsubscribe();

      this.afa.signOut()
      .then(res => {
        this.currentUser = null;
        this.currentUser$.next(this.currentUser);
        this.router.navigateByUrl('/login').then();
      });
    }

    SearchUserInDatabase(user_id: string): Observable<UserData> {
      return this.afs.collection<UserData>('users').doc<UserData>(user_id).valueChanges();
    }

    testError() {
      throwError('this is an error');
    }


    getAllUsers(): Observable<UserData[]> {
      // console.log(this.afs.collection<any>('users').get());
      
      return this.afs.collection<any>('users')
      .snapshotChanges()
      .pipe(
        map(
          snaps => {
            return snaps
            // .filter(snap => {
            //   user_id !== snap.payload.doc.id
            // })
            .map(snap => {

              // console.log(snap.payload.doc.id);
              // console.log(snap.payload.doc.data());
              let user = {
                id: snap.payload.doc.id,
                ...snap.payload.doc.data()
              };

              // console.log(user);
              
              return user;
            })
          }
        )
      )

     }
  }
  
  // export interface UserData {
  //   firstName: string;
  //   lastName: string;
  //   email: string;
  //   avatar: string;
  //   mutualFriends: number;
  //   school: string;
  //   id?: string;
  // }
