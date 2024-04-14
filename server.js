const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');
const path = require('path'); // Added path module for file paths

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    // Send the client.html file when a GET request is made to the root endpoint
    res.sendFile(path.join(__dirname, 'client.html'));
});

app.post('/generate-pdf', async (req, res) => {
    const { htmlContent } = req.body;

    if (!htmlContent) {
        return res.status(400).send("HTML content is required");
    }

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Set the viewport size based on the content size
    await page.setViewport({
        width: 1200, // Set a default width
        height: 800, // Set a default height
        deviceScaleFactor: 1,
    });

    // Adjust the viewport size based on the actual content size
    const contentSize = await page.evaluate(htmlContent => {
        const body = document.createElement('body');
        body.innerHTML = htmlContent;
        document.documentElement.appendChild(body);
        const { width, height } = body.getBoundingClientRect();
        body.remove();
        return { width, height };
    }, htmlContent);

    await page.setViewport({
        width: contentSize.width || 1200,
        height: contentSize.height || 800,
        deviceScaleFactor: 1,
    });

    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

    // Set the PDF page size based on the content size
    const pdfBuffer = await page.pdf({
        width: `${contentSize.width || 1200}px`,
        height: `${contentSize.height || 800}px`,
    });

    res.contentType("application/pdf");
    res.send(pdfBuffer);

    await browser.close();
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
