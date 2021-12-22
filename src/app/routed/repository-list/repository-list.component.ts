import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

@Component({
  templateUrl: './repository-list.component.html',
  styleUrls: ['./repository-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RepositoryListComponent implements OnInit {
  
  repositories: Repository[] = [{name: 'apache', owner: 'qwefgh90', htmlUrl: 'https://google.com', automationEnabled: false}];
  constructor() { }

  ngOnInit(): void {
  }

  changeToggle(repo: Repository, checked: boolean){
    
  }
}

interface Repository{
  name: string;
  owner: string;
  htmlUrl: string;
  automationEnabled: boolean;
}