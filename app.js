const express = require('express')
const fs = require('fs')
const puppeteer = require('puppeteer-core')
const { createHash } = require('crypto')
const URL = require('url')
const app = express()
const port = process.env.PORT || 5000
const version = process.env.VERSION || '114.0.5735.198'

app.get('*', async (req, res) => {
  let url = 'https://' + (req.path.substring(1) || 'ddg.gg')
  let query = URL.parse(req.url).query
  if (query) {
    url += '?' + query
  }
  let img = `${process.cwd()}/${createHash('sha256').update(url).digest('hex')}.png`;
  console.log(`url is ${url}`);
  if (fs.existsSync(img)) {
    return res.sendFile(img);
  }

  //const browser = await puppeteer.launch({args:['--no-sandbox']});
  const browser = await puppeteer.launch({executablePath: '/usr/bin/chromium', headless:true, args:['--no-sandbox']});
  const page = await browser.newPage();
  await page.setUserAgent(`Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${version} Safari/537.36`)
  await page.setViewport({
    width: parseInt(req.query.w) || 1280,
    height: parseInt(req.query.h) || 1024,
    deviceScaleFactor: 1,
  });
  await page.goto(url, {timeout:10000, waitUntil:'networkidle0'});
  await page.screenshot({path: img});
  await browser.close();

  return res.sendFile(img);
  //fs.unlinkSync(img);
})

app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`)
})
