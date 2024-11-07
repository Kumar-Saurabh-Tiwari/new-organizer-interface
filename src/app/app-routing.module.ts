import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { EventDashboardComponent } from './component/event-dashboard/event-dashboard.component';
import { UserProfileComponent } from './component/user-profile/user-profile.component';
import { TeamComponent } from './component/team/team.component';

const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'home', component: DashboardComponent },
  { path: 'events', component: EventDashboardComponent },
  { path: 'profile', component: UserProfileComponent },
  { path: 'team', component: TeamComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
