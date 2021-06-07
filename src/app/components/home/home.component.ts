import { Component, OnDestroy, OnInit, AfterViewInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { Title } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { PostService } from 'src/app/services/post.service';
import { EditPostComponent } from '../edit-post/edit-post.component';
import { ContactListComponent } from '../contact-list/contact-list.component';
import FastAverageColor from 'fast-average-color/dist/index.es6';
import * as $ from "jquery";
import { PostData } from 'src/app/shared/postdata.model';
import { UserData } from 'src/app/shared/userdata.model';
import { MiscdataService, Story } from 'src/app/services/miscdata.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {

  active: {} = {
    home: true,
    video: false,
    store: false,
    users: false,
    flag: false
  };

  stories = new Array<Story>(6);

  posts: PostData[] = [];
  user: UserData;
  // userdata: UserData;
  users: UserData[] = [];
  subscriptions: Subscription[] = [];

  constructor(private miscdataService: MiscdataService,
    private postService: PostService,
    private authService: AuthService,
    private titleService: Title,
    private editPostModal: NgbModal) { }

  ngOnInit(): void {

    this.titleService.setTitle("Fakebook");

    this.subscriptions.push(this.miscdataService.getRandomStories(this.stories.length).subscribe(stories => {this.stories = stories}));

    this.subscriptions.push(this.postService.getAllPosts().subscribe(posts => this.posts = posts));
    
    this.subscriptions.push(this.authService.CurrentUser().subscribe(user => {this.user = user;}));

    this.subscriptions.push(this.authService.getAllUsers().subscribe(users => this.users = users));
    
  }

  ngAfterViewInit(): void {

    //Get dominant color for background
    // $(document).ready(function() {

    //   // var img = $(this).find('.test');
    //   //   if (img.length == 0)
    //   //     return;

    //   //     console.log(img[0]);
    //   //   console.log(img[0].src);

    //   //   const fac = new FastAverageColor();
    //   //   var dominantColor = fac.getColorAsync(img[0]);
    //   //   console.log(dominantColor);

    //   $('.posts').on('DOMNodeInserted','.post', function() {
    //     console.log($(this).prop('class'));
        

    //     var img = $(this).find('.post-image');
    //     if (img.length == 0)
    //       return;

    //       console.log(img[0]);
    //     console.log($(img[0]).prop('src'));

    //     const fac = new FastAverageColor();

    //     // console.log(img[0].currentSrc);
        
    //     // var dominantColor = fac.getColorAsync('../../../assets/f_logo.png');
    //     // console.log(dominantColor);
        
    //     // $('.post-image-wrapper').css('background-color','rgb('+rgb.r+','+rgb.g+','+rgb.b+')');
    //   })
    // });
  }

  ngOnDestroy(): void {
    console.log("ngOnDestroy home");
    
    this.subscriptions.map(s => s.unsubscribe());
  }

  isActiveTab(tab: string): boolean {
    // console.log(this.active[tab]);
    return this.active[tab];
  }

  changeActiveTab(tab: string):void {
    // console.log(tab);
    Object.keys(this.active).forEach(
      key => {
        this.active[key] = false;
      }
    );
    
    this.active[tab] = true;
    // console.log(this.active);
  }

  postHasImage(p: PostData): boolean {

    return p?.imageUrl !== '';
  }

  postSomething(form: NgForm): void {

    let msg = form.value.message;

    if (!msg || /^\s*$/.test(msg)) {
      console.log("empty string");
      form.resetForm();
      return;
    }

    console.log(form.value);
    console.log("user.id " + this.user.id);
    

    let post: PostData = {
      avatar: this.user.avatar,
      firstName: this.user.firstName,
      lastName: this.user.lastName,
      likes: [],
      message: msg,
      title: this.user.firstName + this.user.lastName,
      user_id: this.user.id
    }


    // this.postService.postMessage(msg, this.user.firstName + this.user.lastName,
    //   {
    //     avatar: this.user.avatar,
    //     lastName: this.user.lastName,
    //     firstName: this.user.firstName
    //   });

    this.postService.postMessage(post, null);

    form.resetForm();
  }

  likePost(post: PostData): void {

    if (post.likes.indexOf(this.user.id) == -1) {
      // Increment likes
      this.postService.likePost(post.id, this.user.id);
    }
    else {
      // Decrement likes
      this.postService.dislikePost(post.id, this.user.id);
    }
    
  }

  isPostLikedByUser(post: PostData, user: UserData): boolean {
    return post.likes.indexOf(user.id) != -1;
  }

  isPostFromUser(post: PostData, user: UserData): boolean {
    return post.user_id == user.id;
  }

  deletePost(post: PostData): void {
    console.log("delete " + post.id);
    this.postService.removePost(post);
  }

  createPost(): void {
    console.log("create post");
    
    let post: PostData = {
      avatar: this.user.avatar,
      firstName: this.user.firstName,
      lastName: this.user.lastName,
      likes: [],
      message: "",
      title: this.user.firstName + this.user.lastName,
      user_id: this.user.id
    }
    
    const modal = this.editPostModal.open(EditPostComponent,
      {
        scrollable: true,
        windowClass: 'myCustomModalClass',
        centered: true,
        keyboard: false,
        backdrop: 'static'
      });

      // Pass data to modal
      modal.componentInstance.type = EditPostComponent.POST_CREATE;
      modal.componentInstance.post = post;
      modal.componentInstance.user = this.user;

      modal.result.then((result) => {
        if (result == null)
          return;
        
        console.log("from modal " + JSON.stringify(result));

        const postText = result.msg;
        const postImage = result.image;
        console.log(postText);
        console.log(postImage);
        
        if (postText != null) {
          console.log(postText);
          
          post.message = postText;
          // post.image = postImage;
          this.postService.postMessage(post, postImage);
        }
      }, (reason) => {
        // console.log('reason ' + reason);
      });
  }

  editPost(post: PostData): void {
    console.log("edit " + post.id);

    const modal = this.editPostModal.open(EditPostComponent,
      {
        scrollable: true,
        windowClass: 'myCustomModalClass',
        centered: true,
        keyboard: false,
        backdrop: 'static'
      });

      // Pass type EDIT
      modal.componentInstance.type = EditPostComponent.POST_EDIT;
      // Pass post data to modal
      modal.componentInstance.post = post;
      modal.componentInstance.user = this.user;

      modal.result.then((result) => {
        if (result == null)
          return;
        
        console.log("from modal " + JSON.stringify(result));

        const postText = result.msg;
        
        if (postText != null) {
          console.log(postText);
          
          // this.postService.updatePost(post.id, postText);
        }
      }, (reason) => {
        // console.log('reason ' + reason);
      });
    
  }

  logOut() {
    console.log("logOut");
    this.subscriptions.map(s => {
      console.log("unsubscribe from " + s);
      s.unsubscribe()
    });
    
    this.authService.LogOut();
  }

}
