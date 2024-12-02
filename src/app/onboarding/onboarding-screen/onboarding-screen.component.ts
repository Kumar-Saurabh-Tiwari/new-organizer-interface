import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-onboarding-screen',
  templateUrl: './onboarding-screen.component.html',
  styleUrls: ['./onboarding-screen.component.scss']
})
export class OnboardingScreenComponent {

  step: number = 1;
  formStep1: FormGroup;
  formStep2: FormGroup;
  formStep3: FormGroup;
  authToken: string;
  decodeData: any;
  userEmail: string;

  // logoFile: File | null = null;


  constructor(private fb: FormBuilder, private apiService: ApiService, private router: Router) { }
  BusinessDetailForm: any = { sName: '', sEmail: '', sAddress: '', sLogo: '', sWebsite: '', sSubDomain: '', sTwitterUrl: '', sFacebookUrl: '', sLinkedinUrl: '' }
  personalDetailForm: any = { sName: '', sEmail: '', sProfilePicture: '', nPhone: '' }

  urllink: string = "https://gobranddirect.com/cdn/shop/products/Asset2_grande.jpg?v=1619802039";
  selectFiles(event: any) {
    if (event.target.files) {
      const reader = new FileReader()
      reader.readAsDataURL(event.target.files[0])
      reader.onload = (event: any) => {
        this.urllink = event.target.result
      }
    }
  }

  ngOnInit() {

    this.authToken = localStorage.getItem('token');
    this.decodeData = jwtDecode(this.authToken as string);
    console.log(this.decodeData)

    this.userEmail = localStorage.getItem('userEmail');
    console.log(this.userEmail);
    this.formStep1 = this.fb.group({
      sSubDomain: ['', Validators.required], // Default value and required
    });


    // 'sName', 'sEmail', 'sProfilePicture', 'nPhone
    this.formStep3 = this.fb.group({
      sName: [''],
      sEmail: [''],
      sAddress: [''],
      sLogo: [''],
      sWebsite: [''],
      sSubDomain: [''],
      sTwitterUrl: [''],
      sFacebookUrl: [''],
      sLinkedinUrl: ['']

    });

    this.personalDetailForm.sEmail = this.userEmail;

    this.formStep2 = this.fb.group({
      sName: [''],
      sEmail: [''],
      sProfilePicture: [''],
      nPhone: ['']
    });

    this.checkUserIsOnborded();
    this.getOrganizationDetails();
  }

  getOrganizationDetails(){
    this.apiService.getBusinessDetailsOfOnbordingOrganization( this.decodeData.iOrganizationId,this.authToken).subscribe(res=>{
      console.log(res)
      this.personalDetailForm.sName=res.body.data.sName;
      this.BusinessDetailForm.sName=res.body.data.sName;
    })
  }

  DataURIToBlob(dataURI: string) {
    const splitDataURI = dataURI.split(',')
    const byteString = splitDataURI[0].indexOf('base64') >= 0 ? atob(splitDataURI[1]) : decodeURI(splitDataURI[1])
    const mimeString = splitDataURI[0].split(':')[1].split(';')[0]

    const ia = new Uint8Array(byteString.length)
    for (let i = 0; i < byteString.length; i++)
      ia[i] = byteString.charCodeAt(i)

    return new Blob([ia], { type: mimeString })
  }

  check() {
    console.log(this.DataURIToBlob(this.urllink));
  }

  submitData() {
    if (this.BusinessDetailForm.sName == '') {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please Fill Required Fields !',
      });
    } else {
      // console.log(this.screenshotData);
      const file = this.DataURIToBlob(this.urllink);
      // Call an API to send the screenshot data and user comment to the backend
      const formData = new FormData();
      // formData.append('iUserId',this.decodeData.iUserId)
      formData.append('sLogo', file, 'image.jpg')
      formData.append('sName', this.BusinessDetailForm.sName);
      formData.append('sEmail', this.BusinessDetailForm.sEmail);
      formData.append('sAddress', this.BusinessDetailForm.sAddress);
      formData.append('sWebsite', this.BusinessDetailForm.sWebsite);
      formData.append('sSubDomain', this.BusinessDetailForm.sSubDomain);
      formData.append('sTwitterUrl', this.BusinessDetailForm.sTwitterUrl);
      formData.append('sFacebookUrl', this.BusinessDetailForm.sFacebookUrl);
      formData.append('sLinkedinUrl', this.BusinessDetailForm.sLinkedinUrl);
      console.log('Sending data to the backend:', formData);
      this.apiService.addBusinessDetailsOnboardingScreen(this.decodeData.iOrganizationId, formData, this.authToken).subscribe(res => {

        console.log(res);
        if (this.formStep1.valid) {
          this.createNewDomain();
        }
        this.router.navigateByUrl('/home')
      })
    }
  }

  // Function to handle the next button click
  onNext() {
    this.step++;
  }

  onBack() {
    if (this.step > 1) {
      this.step--;
    }
  }

  checkUserIsOnborded() {
    this.apiService.checkUserIsOnbordedUser(this.decodeData.iAdminId, this.authToken).subscribe(res => {

      console.log(res.body);
    })
  }

  checkSubDomains() {
    if (this.formStep1.valid) {
      this.apiService.checkNewSubDomain(this.formStep1.value, this.authToken).subscribe(
        (res) => {
          console.log(res)
          Swal.fire("Sub Domain is available success");
          this.onNext();
        },
        (error) => {
          console.error('Error:', error);
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Sub Domain Already Exists !',
          });
        }
      );
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please Fill Sub Domain Field !',
      });
    }
  }

  createNewDomain() {
    this.apiService.addNewSubDomain(this.decodeData.iOrganizationId, this.formStep1.value, this.authToken).subscribe(res => {
      console.log(res);
      // Swal.fire("Sub Domain Added");
    })
  }
  addPersonalDetails() {
    if (this.personalDetailForm.sName == '') {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please Fill Required Fields !',
      });
    } else {
      this.apiService.addPersonalDetailsOnboardingScreen(this.decodeData.iAdminId, this.personalDetailForm, this.authToken).subscribe(res => {
        console.log(res);
        this.onNext();
      })
    }
  }

  addBusinesslDetails() {
    this.BusinessDetailForm.sLogo = this.urllink;
    this.apiService.addBusinessDetailsOnboardingScreen(this.decodeData.iOrganizationId, this.BusinessDetailForm, this.authToken).subscribe(res => {
      console.log(res);
      this.createNewDomain();
      this.router.navigateByUrl('/home')
    })
  }
  onCreate() {
    // Optional: Add logic here to handle the creation process
    // This could include making an API request, showing a confirmation, etc.
    console.log('Create button clicked!');
  }
}
