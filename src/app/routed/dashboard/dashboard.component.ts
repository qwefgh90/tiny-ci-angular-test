import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FunctionsUsingCSI, KindOfEraseInDisplay, NgTerminal, NgTerminalComponent } from 'ng-terminal';
import { AuthService } from 'src/app/auth/auth.service';
import { Repository } from 'src/app/model/repository';
import { User } from 'src/app/model/user';
import { APIProxy } from 'src/app/service/api-proxy';

@Component({
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  repositories: RepositoryDisplay[] = [
  ];
  workList: WorkDisplay[] = [
  ];

  selectedRepository?: RepositoryDisplay;
  owner?: string;
  repositoryName?: string;

  @ViewChild("ngTerminal")
  ngTerminal?: NgTerminalComponent;

  constructor(private auth: AuthService, private route: ActivatedRoute, private httpClient: HttpClient) {
    // this.route.paramMap.subscribe({
    //   next: (map) =>{
    //     const owner = map.get('owner') ?? undefined;
    //     const repositoryName = map.get('repositoyName') ?? undefined;
    //   }
    // })
  }

  user: (User & { jwt: string }) | undefined;
  ngOnInit(): void {
    this.auth.userObserver.subscribe({
      next: (user) => {
        if (user) {
          this.user = user;
          let apiService = new APIProxy(this.user, this.httpClient);
          apiService.getRepositories().subscribe({
            next: (repoList) => {
              this.repositories = repoList.filter(r => r.enabled).map(r => ({ id: r.id, name: r.name, owner: user.login, htmlUrl: r.htmlUrl, automationEnabled: r.enabled }));
              if (this.repositories.length > 0) {
                this.selectedRepository = this.repositories[0];
                this.invalidateWorkList(this.selectedRepository);
              }
            }
          });
        }
      }
    })
  }

  invalidateWorkList(repository: RepositoryDisplay) {
    const user = this.user;
    if (repository && user) {
      let apiService = new APIProxy(user, this.httpClient);
      apiService.getWorks(repository.id).subscribe({
        next: (workList) => {
          this.workList = workList.map(w => ({
            id: w.work_id,
            commitId: w.commit_id,
            repositoryId: w.repository_id,
            repositoryName: w.repository_name,
            owner: user.login,
            startedDate: new Date(w.started_time),
            failedDate: w.failed_time ? new Date(w.failed_time) : undefined,
            completedDate: w.completed_time ? new Date(w.completed_time) : undefined,
            status: w.status
          })).sort((a, b) => a.id < b.id ? 1 : -1);
        }
      })
    }
  }

  invalidateWorkHistory() {
    const user = this.user;
    if (this.selectedWork && user && this.selectedRepository) {
      let apiService = new APIProxy(user, this.httpClient);
      apiService.getLogs(this.selectedWork.id).subscribe({
        next: (work) => {
          this.ngTerminal?.write(FunctionsUsingCSI.eraseInDisplay(KindOfEraseInDisplay.All));
          this.ngTerminal?.write(FunctionsUsingCSI.cursorPosition(1, 1));
          if (work.logs.length > 0) {
            work.logs.forEach(log => {
              this.ngTerminal?.write(`${log}\r\n`);
            })
          } else {
            this.ngTerminal?.write("There is nothing to print here.");
          }
        }
      });
    }
  }

  logs: string[] = [];

  onRepositorySelected(repository?: RepositoryDisplay) {
    if (repository)
      this.invalidateWorkList(repository);
  }

  openWorkHistory(work: WorkDisplay) {
    this.selectedWork = work;
    this.invalidateWorkHistory();
  }

  selectedWork?: WorkDisplay;
  loadRepository() {

  }

}

interface RepositoryDisplay {
  id: number;
  name: string;
  owner: string;
  htmlUrl: string;
  automationEnabled: boolean;
}

interface WorkDisplay {
  id: number,
  commitId: string,
  repositoryId: number,
  repositoryName: string,
  owner: string,
  startedDate: Date,
  completedDate?: Date,
  failedDate?: Date,
  status: string
}