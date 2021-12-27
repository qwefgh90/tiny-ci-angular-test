export interface Work {
    repository_id: number;
    repository_name: string;
    commit_id: string;
    commit_message: string;
    started_time: string;
    completed_time: string;
    stopped_time: string;
    failed_time: string;
    status: string;
    work_id: number;
    work_progress_uri: string;
}