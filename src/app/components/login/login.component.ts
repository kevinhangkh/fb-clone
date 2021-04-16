import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgbAlert, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { RegisterComponent } from '../register/register.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  logInForm = new FormGroup({
    email: new FormControl(null, Validators.required),
    password: new FormControl(null, Validators.required)
  });

  hidePassword = true;

  subscriptions: Subscription[] = [];

  constructor(
              private titleService: Title,
              private registerModal: NgbModal, 
              private authService: AuthService, 
              private afa: AngularFireAuth, 
              private router: Router) {

  }

  errorMsg: {code: string, message: string};
  @ViewChild('staticAlert', {static: false}) staticAlert: NgbAlert;

  ngOnInit(): void {

    this.titleService.setTitle("Fakebook - Log in or Sign up");

    this.hidePassword = true;

    this.subscriptions.push(this.authService.UserData.subscribe(
      user => {
        if (user) {
          console.log("debug " + user);
          
          this.router.navigateByUrl('/').then();
        }          
      }
    ));
  }

  ngOnDestroy(): void {
    this.subscriptions.map(s => s.unsubscribe());
  }

  get email() {
    return this.logInForm.get('email');
  }
  get password() {
    return this.logInForm.get('password');
  }

  hide(): void {
    this.hidePassword = !this.hidePassword;
  }

  logIn(form: FormGroup): void {

    const {email, password} = form.value;

    if (!form.valid) {
      return;
    }

    // try {
      this.authService.SignIn(email, password)
      .catch(err => {
        this.errorMsg = err;
        setTimeout(() => this.staticAlert.close(), 8000);
        // console.log(err.message);
      });
    
    
    form.reset();
  }

  openSignUp():void {
    const modalRef = this.registerModal.open(RegisterComponent,
      {
        scrollable: true,
        windowClass: 'myCustomModalClass',
        centered: true,
        // keyboard: false,
        // backdrop: 'static'
      });

      // console.log(item.title);
      // console.log(item.isChecked);

      // let data = item;
  
      // modalRef.componentInstance.fromParent = data;
      modalRef.result.then((result) => {
        console.log("from modal " + result.value);

        const firstName = result.value.firstName;
        const lastName = result.value.lastName;
        const email = result.value.email;
        const password = result.value.password;

        if (result == null)
          return;
        // this.editTitle(item.$key, result);
        else {
          // console.log(firstName);
          // console.log(lastName);
          // console.log(email);
          // console.log(password);
          
          this.authService.SignUp(email, password, firstName, lastName);
        }
      }, (reason) => {
        // console.log('reason ' + reason);
      });
  }

  resetErrorMsg(): void {
    console.log("resetErrorMsg");
    
    // this.errorMsg = {code: null, message: null};
    delete this.errorMsg;
  }

}
