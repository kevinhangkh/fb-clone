import { Component, OnDestroy, OnInit, AfterViewInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { AuthService, UserData } from 'src/app/services/auth.service';
import { PostService } from 'src/app/services/post.service';
import { MiscData } from 'src/app/shared/misc-data';


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

  posts: any[] = [];
  user: UserData;
  userdata: UserData;
  users: UserData[] = [];
  subscriptions: Subscription[] = [];

  constructor(private postService: PostService, private authService: AuthService, private titleService: Title) { }

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

    
  }

  // ngAfterViewInit(): void {
  //   this.printIt();
  //   this.subscriptions.push(this.authService.getAllUsers(this.user.id).subscribe(users => this.users = users));
  // }

  ngOnDestroy(): void {
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

    console.log(stories);
    
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

    this.postService.postMessage(msg, this.user.firstName + this.user.lastName,
      {
        avatar: this.user.avatar,
        lastName: this.user.lastName,
        firstName: this.user.firstName
      });

    form.resetForm();
    
  }

  logOut() {
    console.log("logOut");
    
    this.authService.LogOut();
  }

}
