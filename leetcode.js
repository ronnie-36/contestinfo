const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const fs = require('fs');
const { exit } = require('process');
const writeStream = fs.createWriteStream('leetcodeupcoming.csv');
writeStream.write(`Name,Start,End,Link\n`);
    const url = 'https://leetcode.com/contest/';

    puppeteer
      .launch()
      .then(browser => browser.newPage())
      .then(page => {
        return page.goto(url).then(function() {
          return page.content();
        });
      })
      .then(html => {
        const $ = cheerio.load(html);
        // const base=$('.contest-base');
        // console.log(base.html());
        $('.contest-upcoming').find('a').each((i, el) => {
           const link=$(el).attr('href');
           if(link===undefined) return true;
           const finallink='https://leetcode.com'+link;
           const title=$(el).find('.card-title.false').text();
           const date=$(el).find('.time').text().replace(',','').substr(0,11);
           const stime=$(el).find('.time').text().replace(',','').substr(14,7);
           const etime=$(el).find('.time').text().replace(',','').substr(24,7);
           const sdate=new Date(date.concat(" ",stime,'+0000'));
           const edate=new Date(date.concat(" ",etime,'+0000'));
           const startdate=sdate.toUTCString().slice(0, -4);
           const enddate=edate.toUTCString().slice(0, -4);
           writeStream.write(`${title}, ${startdate},${enddate}, ${finallink} \n`);
        });
        console.log('Scraping Done...');
      })
      .catch(console.error);

