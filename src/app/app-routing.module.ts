import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { GuardGuard } from './guards/guard.guard';

const routes: Routes = [
  { 
    path: "", 
    component: HomeComponent,
    canActivate: [GuardGuard]
  },
  { path: "login", component: LoginComponent },
  // { path: "register", component: RegisterComponent },
  // { path: "home", component: HomeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
