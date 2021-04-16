import { Component, OnDestroy, OnInit, AfterViewInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { AuthService, UserData } from 'src/app/services/auth.service';
import { PostService } from 'src/app/services/post.service';


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

  stories: {url: string, name:string}[] = [
    {url: "../../../assets/john_wick_avatar.png", name:"John Wick"},
    {url: "../../../assets/mr_potato_head.jpg", name:"Mr Potato Head"},
    {url: "../../../assets/stormtrooper.png", name:"FN-2187"},
    {url: "../../../assets/hulk.jpg", name:"Hulk"},
    {url: "../../../assets/walter_white.jpg", name:"Heisenberg"}
  ];

  posts: any[] = [];
  user: UserData;
  userdata: UserData;
  users: UserData[] = [];
  subscriptions: Subscription[] = [];

  constructor(private postService: PostService, private authService: AuthService, private titleService: Title) { }

  ngOnInit(): void {

    this.titleService.setTitle("Fakebook");

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

  printIt(): void {
    console.log("damn");
    
    console.log(this.user);
    
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
