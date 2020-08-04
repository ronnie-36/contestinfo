const request= require('request');
const cheerio= require('cheerio');
const fs = require('fs');
const writeStream = fs.createWriteStream('codeforcesupcoming.csv');

// Write Headers
writeStream.write(`Name,Start,Duration,Link`);
request('https://codeforces.com/contests', (error, response, html) => {
    if (!error && response.statusCode == 200) {
        const $ = cheerio.load(html);
        $('.datatable').find("tbody").find("tr").each((i, el) => {
            if (i === 0) return true;
            const tds = $(el).attr('data-contestid');
            if(tds===undefined) return false;
            const id=tds;
            const tds1 = $(el).find("td");
            const title=$(tds1[0]).text().replace(/\s\s+/g, '');
            const start=$(tds1[2]).text().replace(/\s\s+/g, '');
            const duration=$(tds1[3]).text().replace(/\s\s+/g, '');
            const link='https://codeforces.com/contest/'+id;
            writeStream.write(`${title}, ${start}, ${duration}, ${link}`);
        });
        console.log('Scraping Done...');
    }    
}); 