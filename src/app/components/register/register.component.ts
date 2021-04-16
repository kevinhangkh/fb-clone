import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  signUpForm = new FormGroup({
    firstName: new FormControl(null, Validators.required),
    lastName: new FormControl(null, Validators.required),
    email: new FormControl(null, Validators.required),
    password: new FormControl(null, [Validators.required, Validators.minLength(6)]),
  });

  hidePassword: boolean = true;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
    this.hidePassword = true;
  }

  get firstName() {
    return this.signUpForm.get('firstName');
  }
  get lastName() {
    return this.signUpForm.get('lastName');
  }
  get email() {
    return this.signUpForm.get('email');
  }
  get password() {
    return this.signUpForm.get('password');
  }

  hide(): void {
    this.hidePassword = !this.hidePassword;
  }


  closeModal(sendData) {
    if (sendData == null) {
      this.activeModal.close();
      return;
    }
    console.log("closed " + sendData.value);
    this.activeModal.close(sendData.value);
  }

}
