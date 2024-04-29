import { createCanvas } from "canvas";
import fs from "fs";
import express from "express";
import path from "path";
import chance from "chance";
import { Core } from "sc-game-base";

const generateRandomImage = (name, randomMethod, count = 400) => {
    // Instantiate the canvas object
    const pixel = 5;
    const width = count * pixel;
    const height = width;
    const canvas = createCanvas(width, height);
    const context = canvas.getContext("2d");

    // Fill the rectangle with purple
    context.fillStyle = "#fff";
    context.fillRect(0, 0, width, height);

    context.fillStyle = "#000";
    for (let x = 0; x < width; x += pixel) {
        for (let y = 0; y < height; y += pixel) {
            if (randomMethod()) {
                context.fillRect(x, y, pixel, pixel);
            }
        }
    }

    // Write the image to file
    const buffer = canvas.toBuffer("image/png");
    const imageName = name ?? "default";
    const reportFolder = "generated-images";
    if (!fs.existsSync(reportFolder)) {
        fs.mkdirSync(reportFolder);
    }
    fs.writeFileSync(`./${reportFolder}/${imageName}.png`, buffer);
    console.log(`Generated ${imageName}`);

    return buffer;
};

const addReportPage = (app, rootDirectory, randomMethods) => {
    registerFrontendResources(app, rootDirectory);

    const router = express.Router();
    registerRandomFairnessPage(router, rootDirectory, randomMethods);
    registerRandomImageApi(router, randomMethods, rootDirectory);

    app.use("/", router);
};

function registerFrontendResources(app, rootDirectory) {
    app.use(express.static(path.join(rootDirectory, "public")));
    app.use("/styles/bootstrap/css", express.static(path.join(rootDirectory, "node_modules/bootstrap/dist/css/bootstrap.css")));
    app.use("/styles/bootstrap/js", express.static(path.join(rootDirectory, "node_modules/bootstrap/dist/js/bootstrap.js")));
}

function registerRandomImageApi(router, randomMethods, rootDirectory) {
    router.get("/api/random", function (req, res) {
        const randomMethod = req.query?.randommethod;

        for (const random of randomMethods) {
            if (random.name == randomMethod) {
                const buffer = generateRandomImage(random.name, random.method, random.count ?? 400);

                res.writeHead(200, {
                    "Content-Type": "image/png",
                    "Content-Length": buffer.length,
                });
                res.end(buffer);

                return;
            }
        }

        res.sendFile(path.join(rootDirectory + `/generated-images/empty.png`));
    });
}

function registerRandomFairnessPage(router, rootDirectory, randomMethods) {
    router.get("/random-fairness", function (req, res) {
        const html = getPageHtml(rootDirectory);
        let randomImagesHtml = "";
        // <div id="${random.name}">Loading result, please wait ...</div>
        //<script type="text/javascript">document.getElementById('${random.name}').addEventListener("onload", () => { document.getElementById('${random.name}').style.display = 'none'; })</script>
        for (const random of randomMethods) {
            randomImagesHtml += `<div class="col">
                <div><b>${random.displayName}</b></div>
                <img src="api/random?randommethod=${random.name}" width="400" height="400" alt="${random.displayName}" loading="lazy" />
            </div>`;
        }

        res.set("Content-Type", "text/html");
        res.send(Buffer.from(html.replace("{template}", randomImagesHtml)));
    });
}

function getPageHtml(rootDirectory) {
    try {
        return fs.readFileSync(path.join(rootDirectory + "/views/random-fairness/index.html"), "utf8");
    } catch (e) {
        console.log(e);
    }

    return `<!doctype html>
                <html lang="en">
                
                <head>
                <meta https-equiv="Content-Security-Policy" content="default-src *;" />
                    <title>Test Random</title>
                    <link href="/styles/bootstrap/css" rel="stylesheet" type="text/css">
                </head>
                
                <body>
                    <div class="container text-center">
                        <div class="row">
                            {template}
                        </div>
                    </div>
                    <script src="/styles/bootstrap/js" type="text/javascript"></script>
                </body>
                
                </html>`;
}

import { generateResult, getSettlementResult } from "../helpers/result-helper";

class FairnessGameBase extends Core.BaseGameApp {
    constructor(serviceName, appConfigs, baseMetrics = null) {
        super(serviceName, appConfigs, baseMetrics);
    }

    async configureServices(app) {
        super.configureServices(app);

        addReportPage(app, "", [
            {
                name: "mode1",
                displayName: "Random Mode 1",
                method: () => getSettlementResult(generateResult(1)).hot,
                count: 150,
            },
            {
                name: "mode2",
                displayName: "Random Mode 2",
                method: () => getSettlementResult(generateResult(2)).hot,
                count: 150,
            },
            {
                name: "mode3",
                displayName: "Random Mode 3",
                method: () => getSettlementResult(generateResult(3)).hot,
                count: 150,
            },
        ]);
    }
}

export { generateRandomImage, addReportPage, FairnessGameBase };
