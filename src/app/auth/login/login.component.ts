import { Component, ViewChild, TemplateRef, NgZone } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from '../../services/api.service';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  otp: string = '';
  passwordVisible: boolean = false;

  @ViewChild('otpDialog') otpDialog!: TemplateRef<any>;
  accessToken: any;
  decodeData: any;
  bIsRememberMe: any;
  intervalId: any;
  timer: number = 300;
  constructor(private dialog: MatDialog, private apiService: ApiService, private router: Router, private toastr: ToastrService, private ngZone: NgZone,private spinner: NgxSpinnerService) { }

  onLogin() {
    this.spinner.show()
    const loginData = {
      sEmail: this.email,
      sPassword: this.password
    }
    this.apiService.login(loginData).subscribe((res) => {
      if (res) {
        this.toastr.success('An OTP has been sent to your registered email!', 'Success');
        this.accessToken = res.headers.get('Verification');
        this.dialog.open(this.otpDialog, {
          width: '300px',
          disableClose: true,
          panelClass: 'custom-dialog' // Add a custom panel class if needed
        });
        this.startTimer();
      }
      this.spinner.hide()
    }, (err) => {
      this.spinner.hide()
      this.toastr.error('An error occurred. Please try again.', 'Error');
    }
    )

  }

  verifyOtp() {
    this.spinner.show();
    const payload = { nOtp: Number(this.otp), bIsRememberMe: Boolean(this.bIsRememberMe) }
    this.apiService.verifyOTP(payload, this.accessToken).subscribe(res => {
      this.accessToken = res.headers.get('Authorization');
      localStorage.setItem('token', this.accessToken);
      this.toastr.success('Logged in successfully!', 'Success');
      this.router.navigateByUrl('home');
      this.dialog.closeAll();
      this.spinner.hide()
    },(err)=>{
      this.spinner.hide()
      this.toastr.error('An error occurred. Please try again.', 'Error');
    }
  )
  }

  resendOtp(){
    this.spinner.show()
    const data={
      sEmail:this.email
    }
    this.apiService.resendOTP(data).subscribe(res=>{
      console.log(res)
      // this.loginToken = res.headers.get('Verification');
      // localStorage.setItem('loginToken', this.loginToken);
      this.timer = 300;
      this.startTimer();
      this.spinner.hide()
    },(err)=>{
      this.spinner.hide()
    })   
  }

  startTimer(): void {
    this.ngZone.runOutsideAngular(() => {
      this.intervalId = setInterval(() => {
        this.ngZone.run(() => {
          if (this.timer > 0) {
            this.timer--;
          } else {
            this.clearTimer();
          }
        });
      }, 1000);
    });
  }

  clearTimer(): void {
    clearInterval(this.intervalId);
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }
}
