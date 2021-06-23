const express = require('express')
const fs = require('fs');
const puppeteer = require('puppeteer')
const app = express()
const port = process.env.PORT || 5000

app.get('/:u', async (req, res) => {
  if (!req.params.u) {
    return res.sendStatus(404);
  }

  let url = Buffer.from(req.params.u, 'base64').toString();
  let img = `${process.cwd()}/${req.params.u.replace('/',':')}.png`;
  console.log(`${req.params.u} url is ${url}`);
  if (fs.existsSync(img)) {
    return res.sendFile(img);
  })

  const browser = await puppeteer.launch({args:['--no-sandbox']});
  //const browser = await puppeteer.launch({executablePath: '/usr/bin/chromium', args:['--no-sandbox']});
  const page = await browser.newPage();
  await page.setViewport({
    width: parseInt(req.query.w) || 1024,
    height: parseInt(req.query.h) || 600,
    deviceScaleFactor: 1,
  });
  await page.goto(url);
  await page.screenshot({path: img});
  await browser.close();

  return res.sendFile(img);
  //fs.unlinkSync(img);
})

app.listen(port, () => {
  console.log(` listening at http://localhost:${port}`)
})
