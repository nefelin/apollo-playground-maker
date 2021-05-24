export interface PartialPlaygroundTab {
  query: string;
  name?: string;
  variables?: string;
  responses?: [string];
}

export interface ApolloPlaygroundTab {
  endpoint: string;
  query: string;
  name?: string;
  variables?: string;
  responses?: Array<string>;
  headers?: Record<string, string>;
}
