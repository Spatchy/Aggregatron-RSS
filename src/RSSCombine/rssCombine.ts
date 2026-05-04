import { X2jOptions, XMLParser } from "fast-xml-parser";
import { FeedObject, ItemObject } from "../RSSBuilder/_types.ts";
import { RSSBuilder } from "../RSSBuilder/rssBuilder.ts";

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
      feedObject.rss.channel.item.forEach((i) => {
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

export { RSSCombine };
