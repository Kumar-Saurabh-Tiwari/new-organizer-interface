import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-verify-user',
  templateUrl: './verify-user.component.html',
  styleUrls: ['./verify-user.component.scss']
})
export class VerifyUserComponent {
  authToken!: string | null;
  decodeData: any;
  currentId:any='';

  loginUser: any = { sEmail: '' };

  data: any;
  userEmail: any;

  itemId: any;

  constructor(
    private apiService: ApiService,
    private fb: FormBuilder,
    private router: Router,
    private authService:AuthService,
    private activateRoute: ActivatedRoute
  ) {}

  loginForm!: FormGroup;

  ngOnInit(): void {
    this.createLoginForm();

    // this.authToken = localStorage.getItem('token');
    // this.decodeData=jwtDecode(this.authToken as string);
  
    this.activateRoute.paramMap.subscribe(params => {
     this.itemId = params.get('id') ??'';
     this.currentId = params.get('id') ??'';
      console.log("Current Id " + this.itemId);
      // this.apiService.getEventsFields(this.itemId,this.authToken).subscribe((data) => {
      //   console.log(data.body.event)
      //   this.eventObject = data.body.event;  
      //   console.log(this.eventObject)  
      // });
    });
  }

  createLoginForm(): void {
    this.loginForm = this.fb.group({
      // sEmail: ['']
    });
  }


  onSubmit() {
    console.log(this.itemId);
    this.apiService.inviteVerification(this.itemId,this.loginForm.value).subscribe(
      (res: any) => {
        //  console.log(res);
        this.data = res;
    
        // this.authService.setSecureToken(this.accessToken);

        Swal.fire({
          title: 'Your organization can now log in to mi-Recall. Thank you for registering your details.',
          confirmButtonText: 'Login Now',
          showClass: {
            popup: 'animate__animated animate__fadeInDown',
          },
          hideClass: {
            popup: 'animate__animated animate__fadeOutUp',
          },
        });
        
        // this.sendTokenToOtpVerify();
        this.router.navigateByUrl('/login');
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Failed...',
          text: 'Failed to Verify!',
        });
      }
    );
  }

}
