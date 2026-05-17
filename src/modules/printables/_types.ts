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

interface StlsDetailsItems {
  id: string;
  created: string; // ISO 8601 date string
  name: string;
  folder: string;
  note: string;
  fileSize: number;
  filePreviewPath: string;
  order: number;
  __typename: string;
}

interface StlsDetails {
  data: {
    model: {
      id: string;
      stls: StlsDetailsItems[];
    };
  };
}

export type {
  GraphQlPostBody,
  ListUserModelsResponse,
  ListUserModelsResponseItems,
  SearchUsersResponse,
  StlsDetails,
};
