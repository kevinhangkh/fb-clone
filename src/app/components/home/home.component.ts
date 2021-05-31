import { Component, OnDestroy, OnInit, AfterViewInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { Title } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { AuthService, UserData } from 'src/app/services/auth.service';
import { PostData, PostService } from 'src/app/services/post.service';
import { MiscData } from 'src/app/shared/misc-data';
import { EditPostComponent } from '../edit-post/edit-post.component';
import { ContactListComponent } from '../contact-list/contact-list.component';
import * as $ from "jquery";


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  active: {} = {
    home: true,
    video: false,
    store: false,
    users: false,
    flag: false
  };

  stories = new Array<{url: string, name:string}>(6);

  posts: PostData[] = [];
  user: UserData;
  userdata: UserData;
  users: UserData[] = [];
  subscriptions: Subscription[] = [];

  constructor(private postService: PostService,
    private authService: AuthService,
    private titleService: Title,
    private editPostModal: NgbModal) { }

  ngOnInit(): void {

    this.titleService.setTitle("Fakebook");

    this.stories = this.getRandomStories();

    this.subscriptions.push(this.postService.getAllPosts().subscribe(posts => this.posts = posts));
    
    this.subscriptions.push(this.authService.CurrentUser().subscribe(user => {
      this.user = user;
    }));

    // console.log(this.user);
    

    this.subscriptions.push(this.authService.getAllUsers().subscribe(users => this.users = users));

    // console.log(this.users);


    // $(document).ready(function() {
    //   console.log('functionnnnnnnnn');
      
    //   // whenever we hover over a menu item that has a submenu
    //   $('contact').on('mouseover', function() {
        
    //   console.log('functionnnnnnnnn22222222222');
    //     var $menuItem = $(this),
    //         $submenuWrapper = $('> .contact-card-tooltip-wrapper', $menuItem);
        
    //     // grab the menu item's position relative to its positioned parent
    //     var menuItemPos = $menuItem.position();
        
    //     // place the submenu in the correct position relevant to the menu item
    //     $submenuWrapper.css({
    //       top: menuItemPos.top,
    //       left: menuItemPos.left - Math.round($menuItem.outerWidth() * 0.75)
    //     });
    //   });
    // });

    // $(document).ready(function() {
    //   var img = $('.post-image').live();//jQuery class selector
    //   console.log(img);
      
    
    //   var width = img.width(); //jQuery width method
    //   var height = img.height(); //jQuery height method

    //   console.log(width);
    //   console.log(height);
    
    //   if(width < height){
    //      img.addClass('portrait');
    //   }
    // });
    
  }

  // ngAfterViewInit(): void {
  //   this.printIt();
  //   this.subscriptions.push(this.authService.getAllUsers(this.user.id).subscribe(users => this.users = users));
  // }

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

  getRandomStories(): {url: string, name:string}[] {

    let stories: {url: string, name:string}[] = [];

    while (stories.length < this.stories.length) {
      var story = MiscData.stories[Math.floor(Math.random() * MiscData.stories.length)];
      if (stories.indexOf(story) === -1) {
        stories.push(story);
      }
    }

    // console.log(stories);
    
    return stories;
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

      modal.result.then((result) => {
        if (result == null)
          return;
        
        console.log("from modal " + JSON.stringify(result));

        const postText = result.msg;
        
        if (postText != null) {
          console.log(postText);
          
          this.postService.updatePost(post.id, postText);
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
