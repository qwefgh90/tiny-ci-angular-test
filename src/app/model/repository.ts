export interface Repository{
    name: string;
    description: string;
    visibility: string;
    htmlUrl: string;
    id: number;
    ownerId: number;
    enabled: boolean;
    activeWorkList: [];
}