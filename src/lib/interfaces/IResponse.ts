export interface IResponse {
    ok: boolean,
    error?: Error | null,
    documentUrl?: string | null,
}