import { Component, OnInit } from '@angular/core';

@Component({
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  repositories: Repository[] = [
    {name: 'apache', owner: 'qwefgh90', htmlUrl: 'https://google.com', automationEnabled: false},
    {name: 'apache', owner: 'qwefgh90', htmlUrl: 'https://google.com', automationEnabled: false},
    {name: 'apache', owner: 'qwefgh90', htmlUrl: 'https://google.com', automationEnabled: false},
    {name: 'apache', owner: 'qwefgh90', htmlUrl: 'https://google.com', automationEnabled: false},
    {name: 'apache', owner: 'qwefgh90', htmlUrl: 'https://google.com', automationEnabled: false},
    {name: 'apache', owner: 'qwefgh90', htmlUrl: 'https://google.com', automationEnabled: false},
    {name: 'apache', owner: 'qwefgh90', htmlUrl: 'https://google.com', automationEnabled: false},
    {name: 'apache', owner: 'qwefgh90', htmlUrl: 'https://google.com', automationEnabled: false},
    {name: 'apache', owner: 'qwefgh90', htmlUrl: 'https://google.com', automationEnabled: false},

];

  constructor() { }

  ngOnInit(): void {
  }

}

interface Repository{
  name: string;
  owner: string;
  htmlUrl: string;
  automationEnabled: boolean;
}