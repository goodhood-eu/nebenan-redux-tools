declare module 'local-storage-adapter' {
  export const get = (key: string) => Record<string, unknown>;
  export const set = (key: string, payload: Record<string, unknown>) => boolean;
}

declare module 'escape-string-regexp-browser' {
  export default (domain: string) => string;
}
