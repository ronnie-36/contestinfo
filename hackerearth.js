const request= require('request');
const cheerio= require('cheerio');
const fs = require('fs');
const writeStream = fs.createWriteStream('hackerearthupcoming.csv');

// Write Headers
writeStream.write(`Name,Start,End,Link\n`);
request('https://www.hackerearth.com/challenges/?filters=competitive%2Chackathon%2Chiring', (error, response, html) => {
    if (!error && response.statusCode == 200) {
        const $ = cheerio.load(html);
        $('.upcoming.challenge-list').find('a').each((i, el) => {
            var link=$(el).attr('href');
            if(link===undefined) return true;
            if(link[0]==='/'){
                link='https://www.hackerearth.com'+link;
            }
            const title = $(el).find('.challenge-name.ellipsis.dark').text().replace(/\s\s+/g, '');
            // const start = $(el).find('.date.less-margin.dark').text().replace(', ', '  ');//Formatting needed for start date
            const key=link.substr(39,4);
            var enddate='';
            var startdate='';
        request(link, (error, response, html1) => {
                if (!error && response.statusCode == 200) {  
                    const $1 = cheerio.load(html1);
                    var d = new Date();
                    var year=d.getFullYear();
                    if(key==="comp" || key==="hiri" ){
                        const a=$1('.timing-text.dark.regular.weight-700');
                        const finaldate= $1(a[1]).text().substr(0,7).concat(year,$1(a[1]).text().substr(7));
                        const initialdate= $1(a[0]).text().substr(0,7).concat(year,$1(a[0]).text().substr(7));
                        const end=new Date(finaldate+'-1030');
                        const start=new Date(initialdate+'-1030');
                        enddate=end.toUTCString().slice(0, -4).substr(5).replace(/\s\s+/g, '');
                        startdate=start.toUTCString().slice(0, -4).substr(5).replace(/\s\s+/g, '');
                        //const duration=$1(a[2]).text();
                    }
                    else if(key==="hack"){
                        const a=$1('.regular.bold.desc.dark');
                       const finaldate= $1(a[2]).text();
                       const initialdate= $1(a[1]).text();
                       const end=new Date(finaldate+'-1030');
                       const start=new Date(initialdate+'-1030');
                       enddate=end.toUTCString().slice(0, -4).substr(5).replace(/\s\s+/g, ''); 
                       startdate=start.toUTCString().slice(0, -4).substr(5).replace(/\s\s+/g, ''); 
                    }
                    writeStream.write(`${title},${startdate},${enddate}, ${link}\n`);
                } 
        });
    });
        console.log('Scraping Done...');    
    }
}); 
