import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { _ } from 'ajv';
import QRCode from 'qrcode'
import { Location } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { environment } from '../../../environments/environment';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-qr-display',
  templateUrl: './qr-display.component.html',
  styleUrls: ['./qr-display.component.scss']
})
export class QrDisplayComponent implements OnInit {
  loading: boolean = false;

  public myAngularxQrCode: string = '';
  eventId: any;
  sharedUrl: string;
  authToken: string;
  eventObject: any;
  eventName: any;
  currentUrl: string;
  baseUrl: string;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private location: Location,
    private route: ActivatedRoute,
    private dialogRef: MatDialogRef<QrDisplayComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
        data: any 
}) {
      console.log(data);
    }

  getEventData(eventId: any, authToken: any) {
    this.apiService.getEventsFields(eventId, authToken).subscribe((data) => {
      console.log(data.body.event)
      this.eventObject = data.body.event;
    });
  }

  cancelScanner() {
    this.dialogRef.close();  
 }

 onScanSuccess(decodedText: string, decodedResult: any): void {
  console.log('QR Code scanned', decodedText);
  if (decodedText) {
    // Close the dialog and pass the scanned data
    this.dialogRef.close(decodedText);

    // Stop the camera after successful scan
    // setTimeout(()=>{
    //   this.stopCamera();
    // },1500)
  }
}

  extractBaseUrl() {
    const currentUrl = this.router.url;
    const fullUrl = window.location.href; 
    const url = new URL(fullUrl);
    this.baseUrl = `${url.protocol}//${url.host}`;
  }

  ngOnInit() {
    this.authToken = localStorage.getItem('token');
    this.extractBaseUrl();
    console.log(environment.qrUrl);
    console.log(this.baseUrl);


    this.loading = true;
    setTimeout(() => {
      this.loading = false;
    }, 2000)

    if(this.data){
      this.eventId=this.data.data.eventId
      this.eventName=this.data.data.eventName
    }
    if (this.eventId) {
      this.myAngularxQrCode = `${environment.qrUrl}/event-action?eventId=${this.eventId}`;
      console.log(this.myAngularxQrCode);
      this.sharedUrl = `${this.baseUrl}/#/eventJoinQR?eventId=${this.eventId}&eventname=${this.eventName}`
    }

    // this.route.queryParams.subscribe(params => {
    //   this.eventId = params['eventId'];
    //   this.eventName = params['eventname'];


    // });
  }



  generateQr() {
    QRCode.toCanvas(document.getElementById('canvas'), 'sample text', function (error: any) {
      if (error) console.error(error)
      console.log('success!');
    })
  }

  goBack(): void {
    this.location.back();
  }

  async share() {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Event QR',
          text: 'Join the event using this QR code!',
          url: this.sharedUrl,
        });
        console.log('Successfully shared');
      } catch (error) {
        console.error('Error sharing', error);
      }
    } else {
      console.error('Web Share API is not supported in your browser.');
    }
  }

}
