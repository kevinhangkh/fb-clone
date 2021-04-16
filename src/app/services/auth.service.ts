import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { User } from '@firebase/auth-types';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  private userData: Observable<User>
  private currentUser: UserData;
  private currentUser$: BehaviorSubject<UserData> = new BehaviorSubject<UserData>(null);

  defaultAvatar = "../../assets/default_avatar.jpg";

  avatars = [
    "../../assets/avatars/clint_eastwood.jpg",
    "../../assets/avatars/pulp_fiction.jpg",
    "../../assets/avatars/marty_mcfly.jpg",
    "../../assets/avatars/jack_sparrow.jpg",
    "../../assets/avatars/leonardo.jpg",
    "../../assets/avatars/walter_white.jpg",
    "../../assets/avatars/fight_club.png",
    "../../assets/avatars/scream.jpg",
    "../../assets/avatars/freddy_krueger.jpg",
    "../../assets/avatars/baywatch.jpg",
    "../../assets/avatars/superman.jpg",
    "../../assets/avatars/beast.jpg",
    "../../assets/avatars/lara_croft.jpg",
    "../../assets/avatars/bruce_lee.jpg",
  ];

  
  constructor(private afs: AngularFirestore, private afa: AngularFireAuth, private router: Router) { 
    
    this.userData = afa.authState;
    this.userData.subscribe(user => {
      if (user) {
        this.afs.collection<UserData>('users')
        .doc<UserData>(user.uid)
        .valueChanges()
        .subscribe(currentUser => {
          if (currentUser != undefined) {
            this.currentUser = currentUser;
            this.currentUser$.next(this.currentUser);
          }
          else {
            this.currentUser = null;
            this.currentUser$.next(this.currentUser);
          }
        })
      }
    })
  }
  
  CurrentUser(): Observable<UserData> {
    return this.currentUser$.asObservable();
  }
  
  SignUp(email: string,
    password: string,
    firstName: string,
    lastName: string,
    avatar = this.avatars[Math.floor(Math.random() * this.avatars.length)]
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
            avatar
          }).then(() => {
            this.afs.collection<UserData>('users')
            .doc(res.user.uid)
            .valueChanges()
            .subscribe(user => {
              if (user) {
                this.currentUser = user;
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
      

      // .doc<UserData>(user_id)
        // .snapshotChanges()
        // .pipe(
        //   map(actions => {
        //     return actions.map(item => {
        //       return {
        //         id: item.payload.doc.id,
        //         ...item.payload.doc.data()
        //       }
        //     })
        //   })
        // );
     }
  }
  
  export interface UserData {
    firstName: string;
    lastName: string;
    email: string;
    avatar: string;
    id?: string;
  }
