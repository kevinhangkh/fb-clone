import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import * as $ from "jquery";
import { finalize } from 'rxjs/operators';
import { PostData, PostService } from 'src/app/services/post.service';

@Component({
  selector: 'app-edit-post',
  templateUrl: './edit-post.component.html',
  styleUrls: ['./edit-post.component.css']
})
export class EditPostComponent implements OnInit {

  editPostForm = new FormGroup({
    postText: new FormControl(null, Validators.required),
    imageSrc: new FormControl(null)
  });

  static readonly POST_CREATE: number = 1;
  static readonly POST_EDIT: number = 2;
  static readonly TITLE_CREATE: string = "Create post";
  static readonly TITLE_EDIT: string = "Edit post";
  static readonly BTN_CREATE: string = "Post";
  static readonly BTN_EDIT: string = "Save";
  static readonly ACTION_CREATE: string = "Posting";
  static readonly ACTION_EDIT: string = "Saving";

  @Input() type; //Post or Edit
  @Input() post: PostData; //If Edit, get the post message
  @Input() user; //Current user

  title: string = '';
  btnLabel: string = '';
  action: string = '';
  private messageOriginal: string;
  private imageOriginal: string;
  private imgSrc: string = '';
  selectedImage: any = null;

  postData: {msg: string, image?: File} = {msg: null};
  isPosting: boolean = false;

  constructor(public activeModal: NgbActiveModal, private postService: PostService) {}

  ngOnInit(): void {

    // console.log(this.post);
    this.messageOriginal = this.post.message;
    this.editPostForm.get("postText").setValue(this.post.message);

    this.title = this.type == EditPostComponent.POST_CREATE ? EditPostComponent.TITLE_CREATE : EditPostComponent.TITLE_EDIT;
    this.btnLabel = this.type == EditPostComponent.POST_CREATE ? EditPostComponent.BTN_CREATE : EditPostComponent.BTN_EDIT;
    this.action = this.type == EditPostComponent.POST_CREATE ? EditPostComponent.ACTION_CREATE : EditPostComponent.ACTION_EDIT;

    if (this.type == EditPostComponent.POST_CREATE) {
      $(".edit-post-form-textarea").attr("placeholder", "What's on your mind?");
    }

    if (this.type == EditPostComponent.POST_EDIT) {
      this.imgSrc = this.post.imageUrl;
      this.imageOriginal = this.post.imageUrl;
      this.whenAddedImage();
    }
  }


  isModified(): boolean {
    return (this.editPostForm.get("postText").value !== this.messageOriginal) || (this.imgSrc !== this.imageOriginal);
  }

  isImage(): boolean {
    return this.imgSrc !== '';
  }

  showPreview(event: any): void {
    //Check if contains a file
    if (event.target.files && event.target.files[0]) {

      const reader = new FileReader();
      reader.onload = (e: any) => this.imgSrc = e.target.result;
      //////----------------------------------------------------------------------------TODO: CHECK FILE MIME TYPE----------------------------------------------------------------------------

      // reader.onloadend = (e: any) => {

        // var arr = (new Uint8Array(e.target.result)).subarray(0, 4);
        // console.log(arr);
        
        // var header = "";
        // for(var i = 0; i < arr.length; i++) {
        //   header += arr[i].toString(16);
        // }
        // console.log(header);

        // //Actual MIME type check
        // var type;
        // switch (header) {
        //   case "89504e47":
        //       type = "image/png";
        //       break;
        //   case "47494638":
        //       type = "image/gif";
        //       break;
        //   case "ffd8ffe0":
        //   case "ffd8ffe1":
        //   case "ffd8ffe2":
        //   case "ffd8ffe3":
        //   case "ffd8ffe8":
        //       type = "image/jpeg";
        //       break;
        //   default:
        //       type = "unknown"; // Or you can use the blob.type as fallback
        //       break;
        // }

        // console.log(type);
        
      // };


      reader.readAsDataURL(event.target.files[0]);
      this.selectedImage = event.target.files[0];

      console.log(this.selectedImage);
      this.postData.image = event.target.files[0];

      this.whenAddedImage();


      // $(document).ready(function() {

          
      //     $(".edit-post-scrollable").on('DOMNodeInserted', '.edit-post-image-preview', function() {
      //       // var height = this.css("height");
      //       console.log(this);
      //       var height = $(this).outerHeight(true);
      //       var width = $(this).width();
      //       console.log(height);
      //       console.log(width);
            
      //       if (height > 400) {
      //         $(".edit-post-scrollable").css("height","300px");
      //       }
      //     });
      // });
      
    }
    else {
      this.imgSrc = '';
      this.selectedImage = null;
    }
  }

  private whenAddedImage() : void {
    //Hide Aa button
    $(".edit-post-toolbar-aa").css("display","none");
    //Increase height of scrollable
    $(".edit-post-scrollable").css("height","270px");
  }

  clearImage(): void {
    this.imgSrc = '';
    this.selectedImage = null;
    // this.postData.image = null;

    //Hide Aa button
    $(".edit-post-toolbar-aa").css("display","block");
    //Increase height of scrollable
    $(".edit-post-scrollable").css("height","195px");
  }

  changePosting(): void {
    this.isPosting = ! this.isPosting;
  }

  currentlyPosting(): boolean { 
    return this.isPosting;
  }


  //Closing modal: Create post or Edit post
  close(sendData): void {
    if (sendData == null) {
      console.log("close no edit");
      this.activeModal.close();
      return;
    }

    let selectedImage = this.selectedImage != null ? this.selectedImage : null;

    this.isPosting = true;
    console.log(this.isPosting);

    //If CREATE POST
    if (EditPostComponent.POST_CREATE == this.type) {

      let post: PostData = {
        avatar: this.user.avatar,
        firstName: this.user.firstName,
        lastName: this.user.lastName,
        likes: [],
        message: sendData.value.postText,
        title: this.user.firstName + this.user.lastName,
        user_id: this.user.id
      }

      this.postService.postMessage(post, selectedImage)
      .pipe(
        finalize(() => {
          this.isPosting = false; 
          console.log(this.isPosting);
        })
      )
      .subscribe(
        (value) => {
          console.log(value);
        },
        (error) => {
          console.error(error);
        },
        () => {
          console.log("Post creation complete!");
          this.isPosting = false;
          console.log(this.isPosting);
          this.activeModal.close(null);
        }
      );
    }
    //If EDIT POST
    else {
      var postText = this.editPostForm.get("postText").value;

      //Only text has changed
      if (this.editPostForm.get("postText").value !== this.messageOriginal && this.imgSrc === this.imageOriginal) {
        // alert('Only text has changed');
        this.postService.updatePostText(this.post.id, postText)
        .subscribe(
          (value) => {
            console.log(value);
          },
          (error) => {
            console.error(error);
          },
          () => {
            this.isPosting = false; 
            console.log('Edited post text successfully');
            this.activeModal.close(null);
          }
        );
      }
      //Only image has changed
      else if (this.editPostForm.get("postText").value === this.messageOriginal && this.imgSrc !== this.imageOriginal) {
        // alert('Only image has changed');
        this.postService.updatePostImage(this.post.id, this.post.imageName, selectedImage)
        .subscribe(
          (value) => {
            console.log(value);
          },
          (err) => {console.error(err);
          },
          () => {
            this.isPosting = false; 
            console.log('Edited post image successfully');
            this.activeModal.close(null);
          }
        );
      }
      //Both text and message have changed
      else if (this.editPostForm.get("postText").value !== this.messageOriginal && this.imgSrc !== this.imageOriginal) {
        // alert('Both text and message have changed');
        this.postService.updatePostTextAndImage(this.post.id, postText, this.post.imageName, selectedImage)
        .subscribe(
          () => {},
          (err) => {console.error(err);
          },
          () => {
            this.isPosting = false; 
            console.log('Edited post text and image successfully');
            this.activeModal.close(null);
          }
        );
      }
    }
  }

}
