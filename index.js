const request = require("request-promise");
const cheerio = require("cheerio");
const fs = require("fs");
const json2csv = require("json2csv").Parser;

const movies = [
  "https://www.imdb.com/title/tt0242519/?ref_=fn_al_tt_0",
  "https://www.imdb.com/title/tt0112641/?ref_=nv_sr_srsg_0",
  "https://www.imdb.com/title/tt0081398/?ref_=nv_sr_srsg_5",
];
(async () => {
  let imdbData = [];

  for (let movie of movies) {
    const response = await request({
      uri: movie,
      headers: {
        accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        "accept-encoding": "gzip, deflate, br",
        "accept-language": "es-US,es-419;q=0.9,es;q=0.8,en;q=0.7",
      },
      gzip: true,
    });

    let $ = cheerio.load(response);
    let title = $('div[class="sc-80d4314-1 fbQftq"] > h1').text().trim();
    let rating = $('div[class="sc-7ab21ed2-2 kYEdvH"] > span')
      .text()
      .split("/")[0];
    let summary = $('span[class="sc-16ede01-1 kgphFu"]').text().trim();
    let releaseData = $(
      'a[class="ipc-link ipc-link--baseAlt ipc-link--inherit-color sc-8c396aa2-1 WIUyh"]'
    )
      .text()
      .trim();

    imdbData.push({
      title,
      rating,
      summary,
      releaseData,
    });
  }

  const json2cp = new json2csv();
  const csv = json2cp.parse(imdbData);

  fs.writeFileSync("./imdb.csv", csv, "utf-8");
})();
