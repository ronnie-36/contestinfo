const request= require('request');
const cheerio= require('cheerio');
const fs = require('fs');
const writeStream = fs.createWriteStream('codechefupcoming.csv');

// Write Headers
writeStream.write(`Name,Start,End,Link \n`);
request('https://www.codechef.com/contests/?itm_medium=navmenu&itm_campaign=allcontests#future-contests', (error, response, html) => {
    if (!error && response.statusCode == 200) {
        const $ = cheerio.load(html);
        $('h3[id="future-contests"]').next().find("tbody").find("tr").each((i, el) => {
            const tds = $(el).find("td");
            const title=$(tds[1]).text().replace(/\s\s+/g, '');;
            const start=$(tds[2]).text();
            const end=$(tds[3]).text();
            const link=$(tds).find('a').attr('href');
            const finallink='https://www.codechef.com'+link;
            writeStream.write(`${title}, ${start}, ${end}, ${finallink} \n`);
        });
        console.log('Scraping Done...');
    }    
}); 