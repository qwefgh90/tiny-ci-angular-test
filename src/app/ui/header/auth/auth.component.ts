import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  AuthStatus = AuthStatus;
  items: [{ label: 'Sign In', icon: 'pi pi-refresh', command: () => void }] | [{ label: 'Sign Out', icon: 'pi pi-refresh', command: () => void }];
  private __status = AuthStatus.NOT_SIGNED_IN_YET;
  get status(): AuthStatus {
    return this.__status;
  }
  set status(status: AuthStatus) {
    this.__status = status;
    // if(this.__status == AuthStatus.NOT_SIGNED_IN_YET){
    //   this.statusMessage = "Sign in"
    // }else{
    //   this.statusMessage = "Sign out"
    // }
  }
  displayMessage: string = ''
  constructor(private auth: AuthService) {
    this.status = AuthStatus.NOT_SIGNED_IN_YET;
    this.items = [{ label: 'Sign In', icon: 'pi pi-refresh', command: () => { this.login() } }];
    this.auth.authObserver.subscribe(status =>{
      if(status == AuthStatus.SIGNED_IN){
        this.status = AuthStatus.SIGNED_IN;
        this.displayMessage = 'qwefgh90';
        this.items = [{ label: 'Sign Out', icon: 'pi pi-refresh', command: () => { this.logout() } }];
      }else{
        this.status = AuthStatus.NOT_SIGNED_IN_YET;
        this.displayMessage = '';
        this.items = [{ label: 'Sign In', icon: 'pi pi-refresh', command: () => { this.login() } }];
      }
    })
  }

  ngOnInit(): void {
  }

  login() {
    this.auth.loginWithGithub();
  }

  logout() {
    this.auth.logout();
  }
}
enum AuthStatus {
  SIGNED_IN,
  NOT_SIGNED_IN_YET
}