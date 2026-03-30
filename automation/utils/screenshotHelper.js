const path = require('path');

async function captureScreenshot(page, name) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const fileName = `${name}_${timestamp}.png`;
  const dir = path.join(process.cwd(), 'screenshots');
  const filePath = path.join(dir, fileName);
  await page.screenshot({ path: filePath, fullPage: true });
  return filePath;
}

module.exports = { captureScreenshot };
