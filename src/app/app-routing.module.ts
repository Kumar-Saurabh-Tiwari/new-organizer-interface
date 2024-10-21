import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { EventDashboardComponent } from './component/event-dashboard/event-dashboard.component';

const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'events', component: EventDashboardComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
