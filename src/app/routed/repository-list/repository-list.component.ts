import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { AuthStatus } from 'src/app/auth/auth-status';
import { AuthService } from 'src/app/auth/auth.service';
import { Repository } from 'src/app/model/repository';
import { User } from 'src/app/model/user';
import { APIProxy } from 'src/app/service/api-proxy';

@Component({
  templateUrl: './repository-list.component.html',
  styleUrls: ['./repository-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RepositoryListComponent implements OnInit {

  repositories: RepositoryDisplay[] = [];
  constructor(private auth: AuthService, private httpClient: HttpClient, private ref: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.auth.userObserver.subscribe({
      next: (user) => {
        if (user) {
          this.user = user;
          let apiService = new APIProxy(this.user, this.httpClient);
          apiService.getRepositories().subscribe({
              next: (repoList) => {
                this.repositories = repoList.map(r => ({ name: r.name, owner: user.login, htmlUrl: r.htmlUrl, automationEnabled: r.enabled, id: r.id }));
                this.ref.markForCheck();
              }
            })
        }
      }
    })
  }

  changeToggle(repo: RepositoryDisplay, checked: boolean) {
    if (this.user)
      this.httpClient.post<Repository>(
        `http://localhost:8082/user/${this.user.login}/repositories/${repo.name}`
        , { enabled: checked }
        , { withCredentials: true, headers: { authorization: `Bearer ${this.user.jwt}` } }).subscribe(
          {
            next: (repository) => {
              repo.automationEnabled = repository.enabled;
              this.ref.markForCheck();
            },
            error: () => {
              repo.automationEnabled = !checked;
              this.ref.markForCheck();
            }
          });

  }

  user: (User & { jwt: string }) | undefined;
  getList() {
    this.httpClient.get("http://localhost:8082/")
  }
}

interface RepositoryDisplay {
  id: number,
  name: string;
  owner: string;
  htmlUrl: string;
  automationEnabled: boolean;
}