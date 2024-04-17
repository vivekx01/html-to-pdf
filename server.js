const express = require('express');
const bodyParser = require('body-parser'); // Import body-parser middleware
const puppeteer = require('puppeteer');
const cors = require('cors');
const path = require('path'); // Added path module for file paths

const app = express();
const port = process.env.PORT || 3000;

// Increase the payload size limit using body-parser middleware
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use(cors());
app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    // Send the client.html file when a GET request is made to the root endpoint
    res.sendFile(path.join(__dirname, 'client.html'));
});

app.post('/generate-pdf', async (req, res) => {
    const { htmlContent, width: userWidth, height: userHeight } = req.body;

    if (!htmlContent) {
        return res.status(400).send("HTML content is required");
    }

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    try {
        let contentSize;
        if (userWidth && userHeight) {
            // If user provides width and height, use them directly
            contentSize = { width: parseInt(userWidth), height: parseInt(userHeight) };
        } else {
            // Calculate content size if user doesn't provide width and height
            contentSize = await page.evaluate(htmlContent => {
                const body = document.createElement('body');
                body.innerHTML = htmlContent;
                document.documentElement.appendChild(body);
                const { width, height } = body.getBoundingClientRect();
                body.remove();
                return { width, height };
            }, htmlContent);
        }

        // Round up the height value to the nearest integer
        const roundedHeight = Math.ceil(contentSize.height);

        await page.setViewport({
            width: contentSize.width || 1200,
            height: roundedHeight || 800,
            deviceScaleFactor: 1,
        });

        await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

        // Set the PDF page size based on the content size
        const pdfBuffer = await page.pdf({
            width: `${contentSize.width || 1200}px`,
            height: `${roundedHeight || 800}px`,
            printBackground: true
        });

        res.contentType("application/pdf");
        res.send(pdfBuffer);
    } catch (error) {
        console.error("Error generating PDF:", error);
        res.status(500).send("Error generating PDF");
    } finally {
        await browser.close();
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
