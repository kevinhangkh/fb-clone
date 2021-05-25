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

  static readonly POST_CREATE: number = 1;
  static readonly POST_EDIT: number = 2;
  static readonly TITLE_CREATE: string = "Create post";
  static readonly TITLE_EDIT: string = "Edit post";
  static readonly BTN_CREATE: string = "Post";
  static readonly BTN_EDIT: string = "Save";

  @Input() type; //Post or Edit
  @Input() post; //If Edit, get the post message

  title: string = '';
  btnLabel: string = '';
  private messageOriginal;

  constructor(public activeModal: NgbActiveModal) {}

  ngOnInit(): void {
    console.log(this.post);
    this.messageOriginal = this.post.message;
    this.editPostForm.get("postText").setValue(this.post.message);

    this.title = this.type == EditPostComponent.POST_CREATE ? EditPostComponent.TITLE_CREATE : EditPostComponent.TITLE_EDIT;
    this.btnLabel = this.type == EditPostComponent.POST_CREATE ? EditPostComponent.BTN_CREATE : EditPostComponent.BTN_EDIT;
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
