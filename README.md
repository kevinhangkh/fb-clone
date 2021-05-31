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
- [ ] Mid body: post pictures
    - [x] Create post w/ pic
        - [x] Upload to firebase storage
    - [ ] Edit post w/ pic
        - [ ] Add pic
        - [ ] Change pic
            - [ ] Upload new pic and delete old
        - [ ] Remove pic but not post
    - [x] Delete post w/ pic
        - [x] Remove pic from firebase storage
    - [ ] Show pics in post list
        - [x] Show pics
        - [ ] Resize image if height too high
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



# FbClone

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 10.1.0.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.