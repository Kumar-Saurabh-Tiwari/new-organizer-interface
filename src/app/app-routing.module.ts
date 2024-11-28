import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { EventDashboardComponent } from './component/event-dashboard/event-dashboard.component';
import { UserProfileComponent } from './component/user-profile/user-profile.component';
import { TeamComponent } from './component/team/team.component';
import { ViewEventComponent } from './component/view-event/view-event.component';
import { LoginComponent } from './auth/login/login.component';
import { LoginGuard } from './guards/login.guard';
import { CreateEventComponent } from './component/create-event/create-event.component';
import { AddTeamsComponent } from './component/add-teams/add-teams.component';
import { TeamsDetailsComponent } from './component/teams-details/teams-details.component';

const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: DashboardComponent ,canActivate: [LoginGuard]},
  { path: 'events', component: EventDashboardComponent ,canActivate: [LoginGuard]},
  { path: 'events/create-events', component: CreateEventComponent ,canActivate: [LoginGuard]},
  { path: 'events/:_id', component: ViewEventComponent ,canActivate: [LoginGuard]},
  { path: 'profile', component: UserProfileComponent,canActivate: [LoginGuard] },
  { path: 'team', component: TeamComponent ,canActivate: [LoginGuard]},
  { path: 'team/details', component: TeamsDetailsComponent ,canActivate: [LoginGuard]},
  { path: 'team/add-teams', component: AddTeamsComponent ,canActivate: [LoginGuard]}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
