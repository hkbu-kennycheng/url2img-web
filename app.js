const express = require('express')
const fs = require('fs');
const puppeteer = require('puppeteer')
const app = express()
const port = process.env.PORT || 5000

app.get('/:u', async (req, res) => {
  if (!req.params.u) {
    res.sendStatus(404);
    return;
  }

  let url = Buffer.from(req.params.u, 'base64').toString();
  let img = `${req.params.u.replace('/',':')}.png`;
  if (fs.existsSync(img)) {
    res.sendFile(img);
    return;
  }

  console.log(`${req.params.u} url is ${url}`);

  const browser = await puppeteer.launch();
  //const browser = await puppeteer.launch({executablePath: '/usr/bin/chromium'});
  const page = await browser.newPage();
  await page.goto(url);
  await page.screenshot({path: img});
  await browser.close();

  res.sendFile(img);
  //fs.unlinkSync(img);
})

app.listen(port, () => {
  console.log(` listening at http://localhost:${port}`)
})
