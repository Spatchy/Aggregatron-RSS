import { Octokit } from "octokit";
import { DOMParser } from "@b-fuze/deno-dom";
import { GithubEnvsData } from "./_types.ts";
import { RSSBuilder } from "../../RSSBuilder/rssBuilder.ts";
import { ItemObject } from "../../RSSBuilder/_types.ts";
import { fetchOptions } from "./fetchOptions.ts";
import { EnvVarManager } from "../../EnvVarManager/envVarManager.ts";

class Repos {
  envs = {} as GithubEnvsData;
  octokit: Octokit;
  rssBuilder: RSSBuilder;

  constructor() {
    [
      this.envs.user,
      this.envs.auth,
      this.envs.filterForks,
      this.envs.filterPrivate,
      this.envs.filterArchived
    ] = EnvVarManager.validate([
      "GITHUB_USER",
      "GITHUB_AUTH_KEY",
      "GITHUB_FILTER_OUT_FORKS",
      "GITHUB_FILTER_OUT_PRIVATE",
      "GITHUB_FILTER_OUT_ARCHIVED"
    ]);

    this.octokit = new Octokit({ auth: this.envs.auth });

    this.rssBuilder = new RSSBuilder(
      "Github Repos",
      `A list of ${this.envs.user}'s github repos`,
      `https://github.com/${this.envs.user}?tab=repositories`,
    );
  }

  // TODO: Probably a good idea to cache the uris to avoid downloading the dom every time
  async parseDomForOpengraph(repoName:string) {
    const res = await fetch(`https://github.com/${this.envs.user}/${repoName}/`, fetchOptions);

    const dom = await res.text();

    const domParser = new DOMParser()
    const doc = domParser.parseFromString(dom, "text/html");

    const tag = doc.querySelector('meta[property="og:image"]');

    if (tag) {
      const imageUri = tag.getAttribute("content");
      return imageUri!;
    } else {
      throw new Error(`The preview image was not found for ${repoName}`);
    }
  }

  async generateThumbnailEnclosure(
    repoName: string,
  ): Promise<ItemObject["enclosure"]> {
    const uri = await this.parseDomForOpengraph(repoName);

    const res = await fetch(uri, {
      method: "HEAD",
    });

    return {
      $url: uri,
      $length: Number(res.headers.get("Content-Length")),
      $type: res.headers.get("Content-Type")!
    }
  }

  async fetchRepos() {
    const res = await this.octokit.request("GET /users/{username}/repos", {
      username: this.envs.user,
      headers: {
        "X-GitHub-Api-Version": "2026-03-10",
      },
    });

    return res;
  }

  filterRepos(octokitResponse:Awaited<ReturnType<typeof this.fetchRepos>>) {
    let result = octokitResponse.data;

    // TODO: find a way to validate this in the envVarManager
    if (this.envs.filterForks.toLowerCase() === "true") {
      result = result.filter((repo) => !repo.fork);
    }

    // TODO: find a way to compile multiple filters into one to prevent several iterations
    if (this.envs.filterPrivate.toLowerCase() === "true") {
      result = result.filter((repo) => !repo.private);
    }

    if (this.envs.filterArchived.toLowerCase() === "true") {
      result = result.filter((repo) => !repo.archived);
    }

    return result;
  }

  async RSS() {
    const reposData = this.filterRepos(await this.fetchRepos());

    await Promise.all(reposData.map(async (repo) => {
      this.rssBuilder.addItem({
        title: repo.name,
        pubDate: new Date(repo.created_at ?? ""),
        description: repo.description ?? "",
        link: repo.html_url,
        category: "github/repos",
        enclosure: await this.generateThumbnailEnclosure(repo.name)
      });
    }));

    return this.rssBuilder.build();
  }
}

export { Repos };
