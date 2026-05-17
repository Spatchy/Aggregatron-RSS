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

interface ModelImage {
  id: string;
  filePath: string;
  __typename: "PrintImageType";
}

interface ModelPreviewFile {
  id: string;
  filePreviewPath: string;
  __typename: "STLType" | "SLAType" | "GCodeType";
}

interface ModelDetail {
  data: {
    model: {
      id: string;
      slug: string;
      name: string;
      authorship: "author" | "reupload"; // can this be anything else?
      ratingAvg: string; // A 0.0-5.0 float returned as a string for some reason
      ratingCount: number;
      description: string; // HTML elements included in this string
      modified: string; // ISO 8601 date string
      firstPublish: string; // ISO 8601 date string
      datePublished: string; // ISO 8601 date string
      nsfw: boolean;
      aiGenerated: boolean;
      politicalContent: boolean;
      summary: string;
      images: ModelImage[];
      previewFile: ModelPreviewFile;
      __typename: "PrintType";
    };
  };
}

export type {
  GraphQlPostBody,
  ListUserModelsResponse,
  ListUserModelsResponseItems,
  SearchUsersResponse,
  ModelDetail,
};
