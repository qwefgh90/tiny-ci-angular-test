import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Repository } from "../model/repository";
import { User } from "../model/user";
import { Work } from "../model/work";
import { WorkDetail } from "../model/work-detail";

export class APIProxy {
    constructor(private user: User & { jwt: string }, private httpClient: HttpClient) {

    }

    getRepositories() {
        return this.httpClient.get<Repository[]>(`http://localhost:8082/user/${this.user.login}/repositories`,
            { withCredentials: true, headers: { authorization: `Bearer ${this.user.jwt}` } });
    }

    getWorks(repositoryId: number) {
        return this.httpClient.get<Work[]>(`http://localhost:8082/works`,
            { withCredentials: true, headers: { authorization: `Bearer ${this.user.jwt}` },params:{ repository_id: repositoryId} });
    }

    getLogs(workId: number) {
        return this.httpClient.get<WorkDetail>(`http://localhost:8082/works/${workId}/logs`,
            { withCredentials: true, headers: { authorization: `Bearer ${this.user.jwt}` }});
    }
}