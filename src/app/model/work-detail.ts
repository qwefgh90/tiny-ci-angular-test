export interface WorkDetail{
    id: number;
    repository_name: string;
    repository_id: number;
    commit_id: string;
    commit_message: string;
    owner_id: number;
    owner_name: string;
    runner_id: number;
    logs: string[];
    status: string;
    accessToken: string;
}