const puppeteer = require('puppeteer-core');

async function testSahibinden() {
  console.log('Launching browser...');

  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/chromium',
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--single-process'
    ]
  });

  try {
    const page = await browser.newPage();

    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

    console.log('Navigating to sahibinden...');
    await page.goto('https://www.sahibinden.com/oto360/arac-degerleme/alirken', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    // Sayfa title'ini al
    const title = await page.title();
    console.log('Page title:', title);

    // Form alanlarini bul
    const formFields = await page.evaluate(() => {
      const selects = Array.from(document.querySelectorAll('select')).map(s => ({
        id: s.id,
        name: s.name,
        options: Array.from(s.options).slice(0, 5).map(o => o.text)
      }));

      const inputs = Array.from(document.querySelectorAll('input')).map(i => ({
        id: i.id,
        name: i.name,
        type: i.type,
        placeholder: i.placeholder
      }));

      return { selects, inputs };
    });

    console.log('\nForm fields:');
    console.log('Selects:', JSON.stringify(formFields.selects, null, 2));
    console.log('Inputs:', JSON.stringify(formFields.inputs.slice(0, 10), null, 2));

    // Screenshot al
    await page.screenshot({ path: '/tmp/sahibinden-screen.png' });
    console.log('\nScreenshot saved to /tmp/sahibinden-screen.png');

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await browser.close();
  }
}

testSahibinden();
