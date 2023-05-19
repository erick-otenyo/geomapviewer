import * as Comlink from "comlink";
import { parse as parseSvg } from "svg-parser";
import { toHtml } from "hast-util-to-html";

async function parseSvgSymbols(defsHTML) {
  return new Promise((resolve) => {
    const defsObj = parseSvg(defsHTML);
    const svgSymbols = defsObj.children[0].children;
    const svgById = svgSymbols.reduce((all, item) => {
      item.tagName = "svg";
      item.properties.xmlns = "http://www.w3.org/2000/svg";
      let iconId = item.properties.id;
      const parts = iconId.split("-");
      if (parts[0] === "icon") {
        iconId = parts.slice(1).join("-");
      }
      all[iconId] = toHtml(item);
      return all;
    }, {});

    resolve(svgById);
  });
}

const api = {
  parseSvgSymbols: parseSvgSymbols,
};

Comlink.expose(api);
