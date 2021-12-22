import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AuthCredential, OAuthCredential, User, UserCredential } from 'firebase/auth';
import firebase from 'firebase/compat/app';
import { Observable, Subject } from 'rxjs';
import { AuthStatus } from './auth-status';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private __authObserver: Subject<AuthStatus> = new Subject();
  get authObserver(): Observable<AuthStatus>{
    return this.__authObserver.asObservable();
  }
  constructor(public fireAuth: AngularFireAuth, public auth: AngularFireAuth) {
    auth.authState.subscribe({
      next: (user) => {
        console.debug(`user: `, user?.toJSON());
      }, error: (error) => {
        console.debug(`error: ${error}`);
      }
    });
  }

  private loginWithCredential(_credential: firebase.auth.UserCredential) {
    const credential = _credential as firebase.auth.UserCredential & { operationType: string, credential: OAuthCredential, additionalUserInfo: GithubAdditionalUserInfo, user: User };
    if(credential?.operationType == "signIn"){
      const token = credential.credential.accessToken as string;
      const fireId = credential.user.uid;
      console.debug('important cred: ', token, fireId);
      //login in server
      
      this.__authObserver.next(AuthStatus.SIGNED_IN);
    }
  }

  loginWithGithub(){
    const provider = new firebase.auth.GithubAuthProvider();
    provider.addScope("public_repo");
    this.fireAuth.signInWithPopup(provider).then((cred) => {
      this.loginWithCredential(cred);
    });
  }

  logout(){
    //logout on server
    this.auth.signOut();
    this.__authObserver.next(AuthStatus.NOT_SIGNED_IN_YET);
  }
}
interface GithubAdditionalUserInfo {
  avatar_url: string,
  bio: string,
  blog: string,
  company: string,
  created_at: string,
  email: string,
  events_url: string,
  followers: number,
  followers_url: string,
  following: number,
  following_url: string,
  gists_url: string,
  gravatar_id: string,
  hireable: boolean,
  html_url: string,
  id: number,
  location: string,
  login: string,
  name: string,
  node_id: string,
  organizations_url: string,
  public_gists: number,
  public_repos: number,
  received_events_url: string,
  repos_url: string,
  site_admin: boolean,
  starred_url: string,
  subscriptions_url: string,
  twitter_username: string,
  type: string,
  updated_at: string,
  url: string
}