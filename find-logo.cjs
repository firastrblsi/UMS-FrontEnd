const https = require('https');
https.get('https://universitesesame.com', (res) => {
  let data = '';
  res.on('data', (c) => data += c);
  res.on('end', () => {
    const matches = data.match(/<img[^>]+src="([^">]+)"/g);
    if (matches) {
       matches.forEach(m => {
          if (m.toLowerCase().includes('logo')) console.log(m);
       });
    }
  });
});
