const request= require('request');
const cheerio= require('cheerio');
const fs = require('fs');
const writeStream = fs.createWriteStream('atcoderupcoming.csv');

// Write Headers
writeStream.write(`Name,Start,Duration,Link \n`);
request('https://atcoder.jp/contests/', (error, response, html) => {
    if (!error && response.statusCode == 200) {
        const $ = cheerio.load(html);
        $('#contest-table-upcoming').find("tbody").find("tr").each((i, el) => {
            const tds = $(el).find("td");
            const title=$(tds[1]).find('a').text();
            // const start=$(tds[0]).text();
            const  start = new Date($(tds[0]).text().slice(0, -4) + '0330');
            const startdate = start.toUTCString().slice(0, -4).substr(5);
            const duration=$(tds[2]).text();
            const link=$(tds[1]).find('a').attr('href');
            const finallink='https://atcoder.jp'+link;
            writeStream.write(`${title}, ${startdate}, ${duration}, ${finallink} \n`);
        });
        console.log('Scraping Done...');
    }    
}); 