import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { EventDashboardComponent } from './component/event-dashboard/event-dashboard.component';
import { UserProfileComponent } from './component/user-profile/user-profile.component';
import { TeamComponent } from './component/team/team.component';
import { ViewEventComponent } from './component/view-event/view-event.component';
import { LoginComponent } from './auth/login/login.component';

const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: DashboardComponent },
  { path: 'events', component: EventDashboardComponent },
  { path: 'events/:_id', component: ViewEventComponent },
  { path: 'profile', component: UserProfileComponent },
  { path: 'team', component: TeamComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
