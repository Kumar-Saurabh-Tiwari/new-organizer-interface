import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DeviceService } from '../../services/device.service';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrl: './team.component.scss'
})
export class TeamComponent {
  bIsMovileView: boolean=false;

  constructor(private deviceService: DeviceService , private router: Router ,private route: ActivatedRoute) {
    this.deviceService.isMobile$.subscribe(isMobile => {
      this.bIsMovileView=isMobile;
    });
  }

  services = [
    {
      title: 'Business loans',
      description: 'It is a long established',
      publisher: 'Lorem Ipsum',
      info: 'Many publishing',
      color: '#F8D7DA',
      icon: 'fas fa-briefcase'
    },
    {
      title: 'Checking accounts',
      description: 'It is a long established',
      publisher: 'Lorem Ipsum',
      info: 'Many publishing',
      color: '#FFF3CD',
      icon: 'fas fa-wallet'
    },
    {
      title: 'Savings accounts',
      description: 'It is a long established',
      publisher: 'Lorem Ipsum',
      info: 'Many publishing',
      color: '#D1ECF1',
      icon: 'fas fa-piggy-bank'
    },
    {
      title: 'Debit and credit cards',
      description: 'It is a long established',
      publisher: 'Lorem Ipsum',
      info: 'Many publishing',
      color: '#D4EDDA',
      icon: 'fas fa-credit-card'
    },
    {
      title: 'Life Insurance',
      description: 'It is a long established',
      publisher: 'Lorem Ipsum',
      info: 'Many publishing',
      color: '#C3E6CB',
      icon: 'fas fa-shield-alt'
    }
  ];
}
