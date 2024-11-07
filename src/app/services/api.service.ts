import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, map } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { environment } from '../../environments/environment';


const accessToken = localStorage.getItem('secureToken');

const baseURL = environment.apiUrl + environment.version;

// const baseURL = 'https://probable-couscous-p7w476qjqgx29995-5002.preview.app.github.dev/api/v1';


const headers = new HttpHeaders({
  'Content-Type': 'application/json'
});

@Injectable({
  providedIn: 'root'
})

export class ApiService {

  constructor(private http: HttpClient) {}

  data: any;
  // baseurl = 'https://mirecall-admin-enterprise-api.ctoninja.tech/api/v1';
  // originurl ='https://mirecall-admin-enterprise-api.ctoninja.tech/api/v1';

  // originurl:'https://probable-couscous-p7w476qjqgx29995-5003.app.github.dev'
  // originurl ='http://16.171.64.141:5002/api/v1';

  // loginAdmin(data: any): Observable<any> {
  //   return this.http.post<any>(`${baseURL}/adminLogin`, data);
  // }

  // sendEmail(data: any): Observable<any>{
  //   return this.http.post<any>(`${baseURL}/auth/login`, data);
  // }

  // http://16.171.64.141:5001/api/v1/auth/login
// {sEmail}

  // sendOTP(data: any): Observable<any>{
  //   return this.http.post<any>(`${baseURL}/auth/verify-otp`, data);
  // }

  verifyOTP(formData:any , accessToken:any): Observable<any> {
    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      Verification: accessToken
    });
    return this.http.post(
     baseURL + '/auth/verify-otp', formData, { headers: httpHeaders, observe: 'response' }
    );
  }

  login(loginData:any): Observable<any> {
    return this.http.post(
      baseURL + '/auth/login', loginData, { headers, observe: 'response' }
    );
  }

  
  resendOTP(formData:any): Observable<any> {
    return this.http.post(
     baseURL + '/auth/resend-otp', formData, { headers , observe: 'response' }
    );
  }
  sendEvent(eventData: any): Observable<any> {
    const url = `${baseURL}/event/create/event`;
    return this.http.post<any>(url, eventData);
  }

  addEvents(eventData:any , accessToken:any): Observable<any> {
    const httpHeaders = new HttpHeaders({
   
      Authorization: accessToken
    });
    return this.http.post(
     baseURL + '/event/create/event', eventData, { headers: httpHeaders, observe: 'response' }
    );
  }

  inviteUser(data:any , accessToken:any): Observable<any> {
    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: accessToken
    });
    return this.http.post(
     baseURL + '/user/invite-user', data, { headers: httpHeaders, observe: 'response' }
    );
  }
  eventAccessToUser(data:any , accessToken:any): Observable<any> {
    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: accessToken
    });
    return this.http.post(
     baseURL + '/user/edit-event-access', data, { headers: httpHeaders, observe: 'response' }
    );
  }

  updateUser(iUserId:any, data:any , accessToken:any): Observable<any> {
    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: accessToken
    });
    return this.http.put(
     baseURL + `/user/update/${iUserId}`, data, { headers: httpHeaders, observe: 'response' }
    );
  }

  getSelectedUserData(_id:any , accessToken:any): Observable<any> {
    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: accessToken
    });
    return this.http.get<any>(`${baseURL}/user/get-user/${_id}`,{ headers: httpHeaders, observe: 'response' });
  }

  getSelectedUserAccessData(_id:any , accessToken:any): Observable<any> {
    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: accessToken
    });
    return this.http.get<any>(`${baseURL}/user/get-user-events/${_id}`,{ headers: httpHeaders, observe: 'response' });
  }
  
  getInvitedList(iOrganizationId:any, accessToken:any): Observable<any> {
    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: accessToken
    });
    return this.http.get<any>(`${baseURL}/user/get-users/?organizationId=${iOrganizationId}`,{ headers: httpHeaders, observe: 'response' });
  }

  RemoveUserAccess(userId:any,accessToken:any):Observable<any>{
    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: accessToken
    });
    return this.http.delete<any>(`${baseURL}/user/delete-user/${userId}`,{ headers: httpHeaders, observe: 'response' });
  }


  getEvents(organizerId:any , accessToken:any): Observable<any> {
    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: accessToken
    });
    return this.http.get<any>(`${baseURL}/event/organizer/${organizerId}`,{ headers: httpHeaders, observe: 'response' });
  }

  getPastEvents(organizerId:any , accessToken:any): Observable<any> {
    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: accessToken
    });
    return this.http.get<any>(`${baseURL}/event/past/${organizerId}`,{ headers: httpHeaders, observe: 'response' });
  }

  getUpcomingEvents(organizerId:any , accessToken:any): Observable<any> {
    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: accessToken
    });
    return this.http.get<any>(`${baseURL}/event/upcoming/${organizerId}`,{ headers: httpHeaders, observe: 'response' });
  }

  getEventsFields(eventId:any , accessToken:any): Observable<any> {
    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: accessToken
    });
    return this.http.get<any>(`${baseURL}/event/${eventId}`,{ headers: httpHeaders, observe: 'response' });
  }

  DeleteEvent(eventId:any,accessToken:any):Observable<any>{
    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: accessToken
    });
    return this.http.delete<any>(`${baseURL}/event/${eventId}`,{ headers: httpHeaders, observe: 'response' });
  }


  UpdateEvent(eventId:any, eventData:any , accessToken:any): Observable<any> {
    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: accessToken
    });
    return this.http.put(`${baseURL}/event/${eventId}`, eventData, { headers: httpHeaders, observe: 'response' }
    );
  }

  inviteVerification(userid:any, eventData:any): Observable<any> {
    // const httpHeaders = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   Authorization: accessToken
    // });
    return this.http.put(`${baseURL}/auth/verify/${userid}`, eventData
    );
  }

  getUnapproveJoinedUserdata(eventId:any , accessToken:any): Observable<any> {
    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: accessToken
    });
    return this.http.get<any>(`${baseURL}/event/participants/${eventId}/unapproved`,{ headers: httpHeaders, observe: 'response' });
  }

  getApproveJoinedUserdata(eventId:any , accessToken:any): Observable<any> {
    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: accessToken
    });
    return this.http.get<any>(`${baseURL}/event/participants/${eventId}/approved`,{ headers: httpHeaders, observe: 'response' });
  }

  DeleteJoinedUser(eventId:any, userId:any, accessToken:any):Observable<any>{
    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: accessToken
    });
    return this.http.delete<any>(`${baseURL}/event/remove/${eventId}/${userId}`,{ headers: httpHeaders, observe: 'response' });
  }

  ApproveJoinedUser(data:any ,eventId:any, userId:any, accessToken:any): Observable<any> {
    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: accessToken
    });
    return this.http.post(
    baseURL + `/event/approve/${eventId}/${userId}`, data, { headers: httpHeaders, observe: 'response' }
    );
  }

  ToggleOrganizationPut(iOrganizationId:any, eventData:any): Observable<any> {
    return this.http.put(`${baseURL}/organization/toggle-status/${iOrganizationId}`, eventData,
    );
  }
  
  
  getOrganizationStatus(userId:any ,accessToken:any): Observable<any> {
    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: accessToken
    });
    return this.http.get<any>(`${baseURL}/user/get-user-status/${userId}`,{ headers: httpHeaders, observe: 'response' });
  }

  ToggleStatusPost(data:any ,iOrganizationId:any, accessToken:any): Observable<any> {
    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: accessToken
    });
    return this.http.post(
     baseURL + `/user/toggle-status/${iOrganizationId}`, data, { headers: httpHeaders, observe: 'response' }
    );
  }

  // sSubDomain
  checkNewSubDomain(data:any , accessToken:any): Observable<any> {
    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: accessToken
    });
    return this.http.post(
     baseURL + `/organization/check-sub-domain`, data, { headers: httpHeaders, observe: 'response' }
    );
  }

  // sSubDomain
  addNewSubDomain(userId:any, data:any , accessToken:any): Observable<any> {
    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: accessToken
    });
    return this.http.post(
     baseURL + `/organization/create-sub-domain/${userId}`, data, { headers: httpHeaders, observe: 'response' }
    );
  }

  // sName, sEmail, sAddress, sLogo, sWebsite, sSubDomain, sTwitterUrl, sFacebookUrl, sLinkedinUrl
  addBusinessDetailsOnboardingScreen(iUserId:any, data:any , accessToken:any): Observable<any> {
    const httpHeaders = new HttpHeaders({
      // 'Content-Type': 'multipart/form-data',
      Authorization: accessToken
    });
    return this.http.put(
     baseURL + `/organization/update/${iUserId} `, data, { headers: httpHeaders, observe: 'response' }
    );
  }

  // 'sName', 'sEmail', 'sProfilePicture', 'nPhone
  addPersonalDetailsOnboardingScreen(iUserId:any, data:any , accessToken:any): Observable<any> {
    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: accessToken
    });
    return this.http.put(
     baseURL + `/user/update/${iUserId} `, data, { headers: httpHeaders, observe: 'response' }
    );
  }

  checkIsNewUserForOnbordingOrNot(userId:any ,accessToken:any): Observable<any> {
    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: accessToken
    });
    return this.http.get<any>(`${baseURL}/user/is-user-onboarded/${userId}`,{ headers: httpHeaders, observe: 'response' });
  }

  getPersonalDetailsInOnbording(userId:any ,accessToken:any): Observable<any> {
    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: accessToken
    });
    return this.http.get<any>(`${baseURL}/user/get-user/${userId}`,{ headers: httpHeaders, observe: 'response' });
  }

  getSubDomainOfOnbordingScreen(userId:any ,accessToken:any): Observable<any> {
    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: accessToken
    });
    return this.http.get<any>(`${baseURL}/organization/get-sub-domain/${userId}`,{ headers: httpHeaders, observe: 'response' });
  }

  getBusinessDetailsOfOnbordingOrganization(userId:any ,accessToken:any): Observable<any> {
    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: accessToken
    });
    return this.http.get<any>(`${baseURL}/organization/get/${userId}`,{ headers: httpHeaders, observe: 'response' });
  }

  checkUserIsOnbordedUser(userId:any ,accessToken:any): Observable<any> {
    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: accessToken
    });
    return this.http.get<any>(`${baseURL}/user/is-user-onboarded/${userId}`,{ headers: httpHeaders, observe: 'response' });
  }

  private searchTerms = new Subject<string>();

  searchEvents(searchterm:string): Observable<any> {
    // const httpHeaders = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   Authorization: accessToken
    // });
    return this.http.get<any>(`${baseURL}/event/search/?txt=${searchterm}`);
  }

  startSearch(term: string): void {
    this.searchTerms.next(term);
  }

  getSearchResults(): Observable<any> {
    return this.searchTerms.pipe(
      debounceTime(300),           // wait for 300ms pause in events
      distinctUntilChanged(),      // ignore if the next search term is same as previous
      switchMap((term: string) => this.searchEvents(term)) // switch to new observable each time the term changes
    );
  }

  
  saveQuestion(data:any ): Observable<any> {
    const accessToken = localStorage.getItem('token')|| '';
    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: accessToken
    });
    return this.http.post(
     baseURL + `/organization/create/question`, data, { headers: httpHeaders, observe: 'response' }
    );
  }

  updateQuestion(id:any,data:any ): Observable<any> {
    const accessToken = localStorage.getItem('token')|| '';
    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: accessToken
    });
    return this.http.put(
     baseURL + `/organization/update/question/${id}`, data, { headers: httpHeaders, observe: 'response' }
    );
  }

  deleteQuestion(id:any): Observable<any> {
    const accessToken = localStorage.getItem('token')|| '';
    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: accessToken
    });
    return this.http.delete(
     baseURL + `/organization/delete/question/${id}`, { headers: httpHeaders, observe: 'response' }
    );
  }

  getQuestionById(id:any): Observable<any> {
    const accessToken = localStorage.getItem('token')|| '';
    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: accessToken
    });
    return this.http.get<any>(`${baseURL}/organization/get/question/${id}`,{ headers: httpHeaders, observe: 'response' });
  }

  getQuestions(id:any): Observable<any> {
    const accessToken = localStorage.getItem('token')|| '';
    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: accessToken
    });
    return this.http.get<any>(`${baseURL}/organization/get/questions/${id}`,{ headers: httpHeaders, observe: 'response' });
  }



}
