import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent {

  activeTab: string = 'Edit Profile';

  @ViewChild('fileInput') fileInput!: ElementRef;
  uploadImg: boolean=false;

  onEditIconClick() {
    // Open file input when the edit icon is clicked
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = (e: any) => {
        this.profileData.imageUrl = e.target.result; // Update the profile picture URL
      };
      this.uploadImg = true;

      reader.readAsDataURL(file);
    }
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
    this.submitData()
  }

  submitData() {
    const file = this.DataURIToBlob(this.profileData.imageUrl);
    const formData = new FormData();

    if (this.uploadImg) {
      formData.append("sLogo", file, "image.jpg");
    } else {
      // formData.append("sLogo",this.allBusinessDetails.sLogo);
    }
    // formData.append("sName", this.profileData.name);
    // formData.append("sEmail", this.profileData.email);
    // formData.append("sAddress", this.profileData.presentAddress);
    // formData.append("sWebsite", this.profileData.sWebsite);
    // formData.append("sSubDomain", this.profileData.sSubDomain);
    // formData.append("sTwitterUrl", this.profileData.sTwitterUrl);
    // formData.append("sFacebookUrl", this.profileData.sFacebookUrl);
    // formData.append("sLinkedinUrl", this.profileData.sLinkedinUrl);
    console.log("Sending data to the backend:", formData);
    // this.apiServices
    //   .addBusinessDetailsOnboardingScreen(
    //     this.decodeData.iOrganizationId,
    //     formData,
    //     this.authToken
    //   )
    //   .subscribe((res) => {
    //     Swal.fire("Business Details are Updated success");

    //     setTimeout(() => {
    //       this.router.navigateByUrl('dashboard')
    //       setTimeout(() => {
    //         window.location.reload();
    //       }, 1000);
    //     }, 2000);
    //   });
  }
}
