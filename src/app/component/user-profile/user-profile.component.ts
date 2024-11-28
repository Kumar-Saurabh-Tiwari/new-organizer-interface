import { Component, ElementRef, ViewChild } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { SharedService } from '../../services/shared.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent {

  activeTab: string = 'User Profile';

  uploadImg: boolean=false;
  constructor(private apiServices: ApiService,private router:Router,private sharedService:SharedService,private spinner: NgxSpinnerService) {}
  @ViewChild('fileInput') fileInput!: ElementRef;

  onEditIconClick() {
    // Open file input when the edit icon is clicked
    this.fileInput.nativeElement.click();
  }


  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  profileData = {
    imageUrl: '../../../assets/profile.svg',
    name: '',
    username: '',
    email: '',
    password: '',
    dob: '',
    presentAddress: '',
    permanentAddress: '',
    city: '',
    postalCode: '',
    country: ''
  };

  saveProfile() {
    console.log(this.profileData);
    this.updatePersonalDetails();
    this.submitData();
  }


  authToken: any;
  decodeData: any;
  userEmail!: any;
  logoFile: File | null = null;
  allPersonalDetails: any={};
  allBusinessDetails: any={};
  allDomainDetails: any={};


  showValue: any = "personal";
  steps: any = [
    {
      element: "#elementId1",
      intro: "Here You get Personal Details.",
    },
    {
      element: "#elementId2",
      intro: "Here You get Business Details.",
    },
    {
      element: "#elementId3",
      intro: "Here You get Domain Details.",
    },
    // Add more steps as needed
  ];
  changeValue(newValue: any) {
    this.showValue = newValue;
  }
  // startTour(): void {
  //   introJs()
  //     .setOptions({
  //       steps: this.steps,
  //     })
  //     .start();
  // }

  selectFiles(event: any) {
    if (event.target.files) {
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event: any) => {
        this.allBusinessDetails.sLogo = event.target.result;
        this.uploadImg=true;
        console.log("true")
      };
    }
  }

  personalDetails: any = {
    _id: "123",
    userName: "Saurav",
    email: "Sk@gmail.com",
    phoneNo: "7858968574",
    linkdinUrl: "https://www.linkedin.com/in/saurabh-tiwari11/",
  };

  businessDetails: any = {
    _id: "123",
    companyName: "CTO Ninja",
    role: "Developer",
    companyUrl: "https://www.CTO Ninja.com.in/",
  };

  domainDetails: any = { data: "" };

  usersList: any[] = [
    {
      _id: "1234",
      title: "Dashboard",
      icon: "dashboard",
      class: "",
      id: "elementId4",
    },
    {
      _id: "5687",
      title: "Events",
      icon: "filter_list",
      class: "",
      id: "elementId5",
    },
    {
      _id: "78965",
      title: "Team",
      icon: "person",
      class: "",
      id: "elementId6",
    },
    { _id: "8989", title: "Members", icon: "content_paste", class: "" },
    {
      _id: "78789",
      title: "Profile",
      icon: "library_books",
      class: "",
      id: "elementId6",
    },
  ];

  ngOnInit() {
    if (localStorage.getItem("profile") == "0") {
      // setTimeout(() => {
      //   this.startTour();
      // }, 3000);

      console.log(localStorage.getItem("profile"));

      // setTimeout(()=>{
      // localStorage.setItem("userStat","1");
      // console.log("updated stat!");
      // },500)
    } else {
      console.log("visited user!");
    }

    this.authToken = localStorage.getItem("token");
    this.decodeData = jwtDecode(this.authToken as string);
    console.log(this.decodeData);

    this.userEmail = localStorage.getItem("userEmail");

    this.getDomainDetails();
    this.getPersonalDetails();
    this.getOrganizationDetails();
  }

  getPersonalDetails() {
    this.spinner.show()
    this.apiServices
      .getPersonalDetailsInOnbording(this.decodeData.iAdminId, this.authToken)
      .subscribe((res) => {
        console.log("Personal_Details ", res.body.data);
        this.allPersonalDetails = res.body.data;
        this.spinner.hide();
      },(err)=>{
        this.spinner.hide();
      });
  }

  getOrganizationDetails() {
    this.spinner.show()
    this.apiServices
      .getBusinessDetailsOfOnbordingOrganization(
        this.decodeData.iOrganizationId,
        this.authToken
      )
      .subscribe((res) => {
        console.log("Business_Details ", res.body.data);
        this.allBusinessDetails = res.body.data;
        console.log(this.allBusinessDetails.sLogo)
        this.sharedService.setBusinessLogo(this.allBusinessDetails.sLogo);
        this.spinner.hide()
      },(err)=>{
        this.spinner.hide()
      });
  }

  getDomainDetails() {
    this.apiServices
      .getSubDomainOfOnbordingScreen(
        this.decodeData.iOrganizationId,
        this.authToken
      )
      .subscribe((res) => {
        console.log("Domain_Details ", res.body);
        this.allDomainDetails = res.body;
      });
  }

  domainData: any = { sSubDomain: "" };
  checkAndUpdateSubDomains() {
    this.spinner.show();
    this.domainData.sSubDomain = this.allDomainDetails.data;
    this.apiServices
      .checkNewSubDomain(this.domainData, this.authToken)
      .subscribe(
        (res) => {
          console.log(res);
          this.createNewDomain();
          // Swal.fire("Sub Domain is available success");
          this.spinner.hide()
        },
        (error) => {
          this.spinner.hide()
          console.error("Error:", error);
        }
      );
  }
  createNewDomain() {
    this.domainData.sSubDomain = this.allDomainDetails.data;
    this.apiServices
      .addNewSubDomain(
        this.decodeData.iOrganizationId,
        this.domainData,
        this.authToken
      )
      .subscribe((res) => {
        console.log(res);
        // Swal.fire("Sub Domain Added");
      });
  }
  updatePersonalDetails() {
    this.apiServices
      .addPersonalDetailsOnboardingScreen(
        this.decodeData.iAdminId,
        this.allPersonalDetails,
        this.authToken
      )
      .subscribe((res) => {
        console.log(res);
        // Swal.fire("Personal Details are Updated success");
      });
  }

  DataURIToBlob(dataURI: string) {
    const splitDataURI = dataURI.split(",");
    const byteString =
      splitDataURI[0].indexOf("base64") >= 0
        ? atob(splitDataURI[1])
        : decodeURI(splitDataURI[1]);
    const mimeString = splitDataURI[0].split(":")[1].split(";")[0];

    const ia = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++)
      ia[i] = byteString.charCodeAt(i);

    return new Blob([ia], { type: mimeString });
  }

  updateBusinesslDetails() {
    this.apiServices
      .addBusinessDetailsOnboardingScreen(
        this.decodeData.iOrganizationId,
        this.allBusinessDetails,
        this.authToken
      )
      .subscribe((res) => {
        console.log(res);
        // this.router.navigateByUrl('dashboard')
        // Swal.fire("Business Details are Updated success");
      });
  }
  submitData() {
    const file = this.DataURIToBlob(this.allBusinessDetails.sLogo);
    const formData = new FormData();

    if(this.uploadImg){
      formData.append("sLogo", file, "image.jpg");
    }else{
      formData.append("sLogo",this.allBusinessDetails.sLogo);
    }
    formData.append("sName", this.allBusinessDetails.sName);
    formData.append("sEmail", this.allBusinessDetails.sEmail);
    formData.append("sAddress", this.allBusinessDetails.sAddress);
    formData.append("sWebsite", this.allBusinessDetails.sWebsite);
    formData.append("sSubDomain", this.allBusinessDetails.sSubDomain);
    formData.append("sTwitterUrl", this.allBusinessDetails.sTwitterUrl);
    formData.append("sFacebookUrl", this.allBusinessDetails.sFacebookUrl);
    formData.append("sLinkedinUrl", this.allBusinessDetails.sLinkedinUrl);
    console.log("Sending data to the backend:", formData);
    this.apiServices
      .addBusinessDetailsOnboardingScreen(
        this.decodeData.iOrganizationId,
        formData,
        this.authToken
      )
      .subscribe((res) => {
        // console.log(res);
        // Swal.fire("Business Details are Updated success");
        this.getOrganizationDetails();

        setTimeout(()=>{
          this.router.navigateByUrl('')
          setTimeout(()=>{
          window.location.reload();  
          },1000);
        },2000);
      });
  }

  ngOnDestroy(): void {
    if (localStorage.getItem("profile") == "0") {
      localStorage.setItem("profile", "1");
    }
  }

}
