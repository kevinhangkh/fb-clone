# FbClone

This app is a clone of Facebook's home page. 
It allows the user to sign up, sign in, post something (text and/or pictures) and like posts.
The authentication is using a email/password authentication with Firebase.
The database is supported by Firebase Cloud Firestore.
Pictures are uploaded to Firebase Storage.
This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 10.1.0.

# Demo

Check the demo here: [https://fb-clone-phi.vercel.app/](https://fb-clone-phi.vercel.app/)

# TODO
- [x] 1st commit
- [x] Add mutual friends, work/study place in Firebase when creating user
- [ ] Get connected users
- [ ] Add tooltips to Sign Up modal form
- [ ] Homogenize tooltips
    - [ ] Login page
    - [ ] Home page
- [x] Add border to avatars
- [x] Manage long strings in list of posts
- [x] Header: Prevent collapsing
- [ ] Left body: add more mock buttons
- [x] Mid body: add random stories
- [ ] Mid body: stories: fix width of div when name takes 2 lines
- [x] Mid body: add border to avatar in posts
- [x] Mid body: background borders stop at unscrolled area
- [x] Mid body: remove gap between buttons in Post something div
- [x] Mid body: prevent Contacts from collapsing
- [ ] Mid body: add Create room div
- [x] Mid body: Like post feature
    - [x] Add 'likes' field in database as a string array which will contain user ids
    - [x] Update this field (add/remove user ids)
    - [x] Style the view
        - [x] Like counter
        - [x] Like button animation
- [ ] Mid body: Comment post feature
    - [ ] Think about database architecture
    - [ ] This ain't gonna be easy
- [x] Mid body: Delete post feature
- [x] Mid body: Edit post feature
    - [x] Modal
    - [x] Backend
- [x] Mid body: Create post modal
    - [x] Re-use edit post modal
- [x] Mid body: post pictures
    - [x] Create post w/ pic
        - [x] Upload to firebase storage
    - [x] Edit post w/ pic
        - [x] Add pic
        - [x] Change pic
            - [x] Upload new pic and delete old
        - [x] Remove pic but not post
    - [x] Delete post w/ pic
        - [x] Remove pic from firebase storage
    - [x] Show pics in post list
        - [x] Show pics
        - [x] Resize image if height too high
- [ ] Mid body: Embed youtube links
- [x] Mid body: Display line breaks in posts
- [ ] Right body: add mock sections (birthdays, events...)
- [x] Right body: contact overflow y
    - [x] Overflow
    - [x] Move contact list to a new component
    - [x] Display contact tooltip correctly out of scrollable using javascript
    - [x] Show scrollbar when hovered
- [x] Right body: add New message bottom right button
- [ ] Left & Right body: get rid of that small scrolling when browsing posts
