import {
  GraphQlPostBody,
  ListUserModelsResponse,
  SearchUsersResponse,
  StlsDetails,
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

  static async fetchModelDetails(printId: string): Promise<StlsDetails> {
    const body = {
      operationName: "ModelFiles",
      query:
        "query ModelFiles($id: ID!) {\n  model: print(id: $id) {\n    id\n    stls {\n      ...StlDetail\n      __typename\n    }\n  }\n}\nfragment StlDetail on STLType {\n  id\n  created\n  name\n  folder\n  note\n  fileSize\n  filePreviewPath\n  order\n  __typename\n}",
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
