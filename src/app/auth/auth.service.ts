import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AuthCredential, OAuthCredential, UserCredential } from 'firebase/auth';
import firebase from 'firebase/compat/app';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { User } from '../model/user';
import { AuthStatus } from './auth-status';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private __authObserver = new BehaviorSubject(AuthStatus.NOT_SIGNED_IN_YET);
  private __userObserver = new BehaviorSubject<(User & {jwt: string}) | undefined>(undefined);
  
  get authObserver(): Observable<AuthStatus> {
    return this.__authObserver.asObservable();
  }
  get userObserver(): Observable<(User & {jwt: string}) | undefined> {
    return this.__userObserver.asObservable();
  }
  constructor(public fireAuth: AngularFireAuth, public auth: AngularFireAuth, public httpClient: HttpClient) {
    auth.authState.subscribe({
      next: (user) => {
        console.debug(`user: `, user?.toJSON());
      }, error: (error) => {
        console.debug(`error: ${error}`);
      }
    });
    this.__authObserver.subscribe({next: (status) => {
      if(status == AuthStatus.SIGNED_IN){
        let jwt = localStorage.getItem("jwt") as string;
        httpClient.get<User>("http://localhost:8082/user", {headers: {'Authorization' : `Bearer ${jwt}`}, withCredentials: true}).subscribe({
          next: (user) => {
            this.__userObserver.next({...user, jwt});
          }
        });
      }
    }});
    if(localStorage.getItem("jwt")){
      this.__authObserver.next(AuthStatus.SIGNED_IN);
    }
  }

  jwt?: string;

  private loginWithCredential(_credential: firebase.auth.UserCredential) {
    const credential = _credential as firebase.auth.UserCredential & { operationType: string, credential: OAuthCredential, additionalUserInfo: GithubAdditionalUserInfo, user: User };
    if (credential?.operationType == "signIn") {
      const token = credential.credential.accessToken as string;
      const fireId = credential.user.uid;
      console.debug('important cred: ', token, fireId);
      //login in server
      this.httpClient.post("http://localhost:8082/auth/login", { token, fireId }, {observe: 'response'}).subscribe({
        next: (res) => {
          let auth = res.headers.get("Authorization");
          let jwt = auth?.replace("Bearer ", "");
          console.debug(`jwt: ${jwt}`);
          if(jwt){
            localStorage.setItem("jwt", jwt);
            this.__authObserver.next(AuthStatus.SIGNED_IN);
          }else{
            console.warn("It failed to sign in with Github.");
          }

        }
      });

    }
  }

  loginWithGithub() {
    const provider = new firebase.auth.GithubAuthProvider();
    provider.addScope("public_repo");
    this.fireAuth.signInWithPopup(provider).then((cred) => {
      this.loginWithCredential(cred);
    });
  }

  logout() {
    //logout on server
    localStorage.removeItem("jwt");
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