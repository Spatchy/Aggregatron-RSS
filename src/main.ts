import { X2jOptions, XMLParser } from "fast-xml-parser";
import { RSSBuilder } from "./RSSBuilder/rssBuilder.ts";
import { FeedObject, ItemObject } from "./RSSBuilder/_types.ts";
import { Repos } from "./modules/github/github.ts";
import { YoutubeFeed } from "./modules/youtube/youtube.ts";

class RSSCombine {
  options: X2jOptions = {
    ignoreAttributes: false,
    attributeNamePrefix: "$",
    parseAttributeValue: true,
  };

  parser = new XMLParser(this.options);

  // Todo: figure out where to pull these from?
  builder = new RSSBuilder(
    "Aggregatron RSS meta feed",
    "Aggregatron RSS meta feed",
    "example.com",
  );

  combine(feeds: string[], max?:number, newerThan?:Date) {
    const feedObjects = feeds.map((feed) => {
      return this.parser.parse(feed) as FeedObject;
    });

    const itemsArr: ItemObject[] = [];
    feedObjects.forEach((feedObject) => {
      feedObject.rss.item.forEach((i) => {
        // Dates are actually still strings depite what types say, so we convert
        i.pubDate = new Date(i.pubDate);
        itemsArr.push(i);
      });
    });

    itemsArr.sort((a, b) => {
      return b.pubDate.getTime() - a.pubDate.getTime();
    });

    let arrayToUse = itemsArr;

    if (newerThan) {
      const excludeIndex = itemsArr.findIndex((i) => {
        return i.pubDate.getTime() <= newerThan.getTime();
      });

      if (excludeIndex > -1) {
        arrayToUse = arrayToUse.slice(0, excludeIndex);
      }
    }

    if (max && arrayToUse.length > max) {
      arrayToUse = arrayToUse.slice(0, max);
    }

    arrayToUse.forEach((i) => {
      this.builder.addItem(i);
    });

    return this.builder.build();
  }
}

if (import.meta.main) {
  const repos = new Repos();
  const youtubeFeed = new YoutubeFeed();
  const rssGithub = await repos.RSS();
  const rssYoutube = await youtubeFeed.RSS();
  
  const combiner = new RSSCombine();
  const rss = combiner.combine([rssGithub, rssYoutube], undefined, new Date("2026-01-01"));

  console.log(rss);
}
