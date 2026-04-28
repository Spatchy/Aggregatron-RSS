import { Octokit } from "octokit";
import { DOMParser } from "@b-fuze/deno-dom";
import { github as envs } from "./.envs.ts";
import { RSSBuilder } from "../../RSSBuilder/rssBuilder.ts";
import { ItemObject } from "../../RSSBuilder/_types.ts";
import { fetchOptions } from "./fetchOptions.ts";

class Repos {
  octokit = new Octokit({ auth: envs.AUTH_KEY });

  rssBuilder = new RSSBuilder(
    "Github Repos",
    `A list of ${envs.USER}'s github repos`,
    `https://github.com/${envs.USER}?tab=repositories`,
  );

  // TODO: Probably a good idea to cache the uris to avoid downloading the dom every time
  async parseDomForOpengraph(repoName:string) {
    const res = await fetch(`https://github.com/${envs.USER}/${repoName}/`, fetchOptions);

    const dom = await res.text();

    const domParser = new DOMParser()
    const doc = domParser.parseFromString(dom, "text/html");

    const tag = doc.querySelector('meta[property="og:image"]');

    if (tag) {
      const imageUri = tag.getAttribute("content");
      return imageUri!;
    } else {
      throw new Error("The preview image was not found");
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
    return await this.octokit.request("GET /users/{username}/repos", {
      username: envs.USER,
      headers: {
        "X-GitHub-Api-Version": "2026-03-10",
      },
    });
  }

  async RSS() {
    const reposData = await this.fetchRepos();

    // TODO: probably should make this async
    await Promise.all(reposData.data.map(async (repo) => {
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
