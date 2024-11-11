import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DeviceService } from '../../services/device.service';
import { ApiService } from '../../services/api.service';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrl: './team.component.scss'
})
export class TeamComponent {
  bIsMovileView: boolean = false;

  constructor(private deviceService: DeviceService, private router: Router, private route: ActivatedRoute, private apiService: ApiService) {
    this.deviceService.isMobile$.subscribe(isMobile => {
      this.bIsMovileView = isMobile;
    });
  }

  decodeData: any;
  loading: boolean = false;
  userEmail: any;
  logindecodeData: any;
  userType: any;

  isChecked = true;

  organizationStatus: any;

  invitedUsersList: any = {};
  authToken: any = '';
  dataAvailable: boolean = false;

  steps: any = [
    {
      element: '#elementId9',
      intro: 'Here You add new member to team.',
    },
  ];
  // startTour(): void {
  //   introJs().setOptions({
  //     steps: this.steps,
  //   }).start();
  // }  

  ngOnInit() {
    if (localStorage.getItem("invites") == "0") {
      // setTimeout(()=>{
      //   this.startTour();
      // },3000) ;  

    } else {
      console.log("visited user!");
    }

    this.loading = true;
    setTimeout(() => {
      this.loading = false;
    }, 2000);


    this.authToken = localStorage.getItem('token');
    this.userEmail = localStorage.getItem('userEmail');

    this.decodeData = jwtDecode(this.authToken as string);
    // this.logindecodeData=jwtDecode(this.loginToken as string);
    console.log(this.decodeData.eUserType);
    this.userType = this.decodeData.eUserType;
    this.apiService.getInvitedList(this.decodeData.iOrganizationId, this.authToken).subscribe((res) => {
      // console.log(res.body.data);
      if (res.body.data.totalUsers > 0) {
        this.invitedUsersList = res.body.data.users;
        // this.urllink = res.body.data.data.sLogo;
        console.log(this.invitedUsersList);
        this.dataAvailable = true
      }
      else {
        this.dataAvailable = false
      }
    },
    );

    // this.getOrganizationStatus();

  }
  data: any = {};
  toggleEvent(iOrganizationId: any) {
    this.apiService.ToggleStatusPost(this.data, iOrganizationId, this.authToken).subscribe(res => {
      console.log(res)
    })
  }

  ngOnDestroy(): void {
    if (localStorage.getItem("invites") == "0") {


      localStorage.setItem("invites", "1");
    }
  }

}
