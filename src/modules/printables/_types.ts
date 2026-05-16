interface GraphQlPostBody {
  operationName: string;
  query: string;
  variables: Record<string, string | number | null>;
}

interface SearchUsersResponseItems {
  id: string;
  publicUsername: string;
  handle: string;
}

interface SearchUsersResponse {
  data: {
    searchUsers2: {
      items: SearchUsersResponseItems[];
    };
  };
}

interface ListUserModelsResponseItems {
  "id": string;
  "name": string;
  "slug": string;
  "firstPublish": string; // ISO 8601 date string
  "downloadCount": number;
  "likesCount": number;
}

interface ListUserModelsResponse {
  data: {
    models: {
      cursor: string;
      items: ListUserModelsResponseItems[];
    };
  };
}

export type { GraphQlPostBody, SearchUsersResponse, ListUserModelsResponse, ListUserModelsResponseItems };
