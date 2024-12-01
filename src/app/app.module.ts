import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { EventDashboardComponent } from './component/event-dashboard/event-dashboard.component';
import { UserProfileComponent } from './component/user-profile/user-profile.component';
import { TeamComponent } from './component/team/team.component';
import { DatePipe } from '@angular/common'; // Import DatePipe
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ViewEventComponent } from './component/view-event/view-event.component';
import { LoginComponent } from './auth/login/login.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { NgxSpinnerModule } from 'ngx-spinner';
import { SpinnerInterceptor } from '../spinner.interceptor';
import { CreateEventComponent } from './component/create-event/create-event.component';
import { TeamsDetailsComponent } from './component/teams-details/teams-details.component';
import { AddTeamsComponent } from './component/add-teams/add-teams.component';
import { GoogleMapsModule } from '@angular/google-maps';
import { GoogleMapComponent } from './component/google-map/google-map.component';
import { QuestionEngineComponent } from './component/question-engine/question-engine.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    EventDashboardComponent,
    UserProfileComponent,
    TeamComponent,
    ViewEventComponent,
    LoginComponent,
    CreateEventComponent,
    TeamsDetailsComponent,
    AddTeamsComponent,
    GoogleMapComponent,
    QuestionEngineComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    }),
    NgxSpinnerModule.forRoot(),
    GoogleMapsModule
  ],
  providers: [
    provideHttpClient(
      withInterceptorsFromDi()  // Allows you to add interceptors from dependency injection if needed
    ),
    DatePipe,
    provideAnimationsAsync(),

    { provide: HTTP_INTERCEPTORS, useClass: SpinnerInterceptor, multi: true }
  
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
