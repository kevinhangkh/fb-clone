import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-edit-post',
  templateUrl: './edit-post.component.html',
  styleUrls: ['./edit-post.component.css']
})
export class EditPostComponent implements OnInit {

  editPostForm = new FormGroup({
    postText: new FormControl(null, Validators.required)
  });

  @Input() post;

  private messageOriginal;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
    console.log(this.post);
    this.messageOriginal = this.post.message;
    this.editPostForm.get("postText").setValue(this.post.message);
  }

  isModified(): boolean {
    return this.editPostForm.get("postText").value !== this.messageOriginal;
  }

  close(sendData) {
    if (sendData == null) {
      console.log("close no edit");
      this.activeModal.close();
      return;
    }
    console.log("closed " + sendData.value);
    this.activeModal.close(sendData.value);
  }

}
