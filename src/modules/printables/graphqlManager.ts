import {
  GraphQlPostBody,
  ListUserModelsResponse,
  SearchUsersResponse,
  ModelDetail,
} from "./_types.ts";

class GraphQLManager {
  static async post(body: GraphQlPostBody) {
    const res = await fetch("https://api.printables.com/graphql/", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "graphql-client-version": "v1.0.96",
        "origin": "https://www.printables.com",
      },
      body: JSON.stringify(body),
    });

    return res;
  }

  static async searchUser(userHandle: string): Promise<SearchUsersResponse> {
    const body = {
      operationName: "SearchUsers",
      query:
        "query SearchUsers($query: String!) { searchUsers2(query: $query, limit: 5) { items { id publicUsername handle } } }",
      variables: {
        query: userHandle,
      },
    };

    const res = await this.post(body);
    const json = await res.json();

    return json;
  }

  static async listModelsForUser(
    userId: string,
    cursor: string | null,
  ): Promise<ListUserModelsResponse> {
    const body = {
      operationName: "ModelList",
      query:
        "query ModelList($limit: Int!, $cursor: String, $userId: ID, $ordering: String) { models: morePrints(limit: $limit, cursor: $cursor, userId: $userId, ordering: $ordering) { cursor items { id name slug firstPublish downloadCount likesCount } } }",
      variables: {
        limit: 36,
        cursor: cursor,
        userId: userId,
        ordering: "-first_publish",
      },
    };

    const res = await this.post(body);
    const json = await res.json();

    return json;
  }

  static async fetchModelDetails(printId: string): Promise<ModelDetail> {
    const body = {
      operationName: "ModelDetail",
      query:
        "query ModelDetail($id: ID!) {\n  model: print(id: $id) {\n    ...ModelDetailEditable\n    __typename\n  }\n}\nfragment ModelDetailEditable on PrintType {\n  id\n  slug\n  name\n  authorship\n  ratingAvg\n  ratingCount\n  description\n  modified\n  firstPublish\n  datePublished\n  nsfw\n  aiGenerated\n  politicalContent\n  summary\n  image {\n    ...SimpleImage\n    __typename\n  }\n  images {\n    ...SimpleImage\n    __typename\n  }\n  previewFile {\n    ...PreviewFile\n    __typename\n  }\n  __typename\n}\nfragment PreviewFile on PreviewFileUnionType {\n  ... on STLType {\n    id\n    filePreviewPath\n    __typename\n  }\n  ... on SLAType {\n    id\n    filePreviewPath\n    __typename\n  }\n  ... on GCodeType {\n    id\n    filePreviewPath\n    __typename\n  }\n  __typename\n}\nfragment SimpleImage on PrintImageType {\n  id\n  filePath\n  __typename\n}",
      variables: {
        id: printId,
      },
    };

    const res = await this.post(body);
    const json = await res.json();

    return json;
  }
}

export { GraphQLManager };
