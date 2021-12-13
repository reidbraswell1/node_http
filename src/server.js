console.log("Hello World! server.js \n==========\n");

// Exercise 1 Section
console.log("Server Section \n==========\n");

//const http = require("http");
import http from "http";
import fs from "fs";
//import path from 'path';
import ejs from "ejs";
//import { SSL_OP_DONT_INSERT_EMPTY_FRAGMENTS } from 'constants';
const serverPort = 3000;

// Create a local server to receive data from
export const server = http.createServer((req, res) => {
  let urlToRoute = "";
  let chunks = [];
  // Get the base url without parameters to route the request
  if (req.url.indexOf("?") == -1) {
    urlToRoute = req.url;
  } else {
    urlToRoute = req.url.substring(0, req.url.indexOf("?"));
  }
  let postObject;
  let data = "";
  // Handle Request Error's
  req.on("error", (err) => {
    console.log(`Request Error - ${err}`);
    res.writeHead(400, { "Content-Type": "text/html" });
    renderErrorPage(req, res, error);
  });
  // Handle Response Error's
  res.on("error", (err) => {
    console.log(`Response Error - ${err}`);
    res.writeHead(500, { "Content-Type": "text/html" });
    renderErrorPage(req, res, err);
  });
  // Assemble data from body of request
  req.on("data", (chunk) => {
    chunks.push(chunk);
  });
  req.on("end", () => {
    console.log(`Chunks`);
    console.log(chunks.toString());
    switch (urlToRoute) {
      case "/":
        console.log(`--- Begin Case ${urlToRoute} Route ---`);
        renderHomepage(req, res);
        console.log(`--- End Case ${urlToRoute} Route ---`);
        break;
      case "/echo":
        console.log(`--- Begin Case ${urlToRoute} Route ---`);
        let params;
        const responseObject = { url:req.url, method:req.method };
        switch (req.method) {
          case "GET":
            params = new URLSearchParams(req.url.substring(req.url.indexOf("?")));
            responseObject.urlParameters = params.toString();
            break;
          case "POST":
            console.log(chunks.toString());
            params = new URLSearchParams(`?${chunks.toString()}`);
            responseObject.body = Buffer.concat(chunks).toString();
            break;
        }
        res.writeHead(200, { "Content-Type": "application/json" });
        res.write(JSON.stringify(responseObject));
        console.log(`--- End Case ${urlToRoute} Route ---`);
        break;
      case "/about":
        console.log(`--- Begin Case ${urlToRoute} Route ---`);
        switch(req.method) {
          case "GET":
            processGetRequest(req, res);
            break;
          case "POST":
            processPostRequest(req, res, chunks.toString());
            break;
        }
        console.log(`--- End Case ${urlToRoute} Route ---`);
        break;
      case "/styles/indexStyle.css":
        console.log(`--- Begin Case ${urlToRoute} Route ---`);
        indexStyle(req, res);
        console.log(`--- End Case ${urlToRoute} Route ---`);
        break;
      case "/styles/oopsStyle.css":
        console.log(`--- Begin Case ${urlToRoute} ---`);
        oopsStyle(req, res);
        console.log(`--- End Case ${urlToRoute} ---`);
        break;
      default:
        console.log(`--- Begin Case default ${urlToRoute} Route ---`);
        renderOopsPage(req, res);
        console.log(`--- End Case ${urlToRoute} ---`);
        break;
    }
    res.end();
  });
});
server.listen(serverPort, function (err) {
  console.log(
    "Server running at url http://" +
      require("os").hostname() +
      ":" +
      serverPort
  );
});
console.log(`Server running on port ${server.address().port}`);

// Render homepage
function renderHomepage(req, res, data) {
  console.log(`--- Begin Function homepage() ---`);
  const htmlPage = "index.ejs";

  const template = fs.readFileSync(`./views/${htmlPage}`, "utf-8");
  const renderedTemplate = ejs.render(template, { heading: "Homepage" });
  res.write(renderedTemplate);
  console.log(`--- End Function homepage() ---`);
}

// Serve stylesheet information for homepage
function indexStyle(req, res) {
  console.log(`--- Begin Function indexStyle() ---`);
  const styleSheet = "indexStyle.css";

  let fileStream = fs.createReadStream(`./styles/${styleSheet}`, "utf-8");
  let css = fs.readFileSync(`./styles/${styleSheet}`, "utf-8");
  res.writeHead(200, { "Content-Type": "text/css" });
  res.write(css);
  console.log(`--- End Function indexStyle() ---`);
}

// Serve stylesheet information for oops invalid url page
function oopsStyle(req, res) {
  console.log(`--- Begin Function oopsStyle() ---`);
  const styleSheetDirectory = "./styles/";
  const styleSheet = "oopsStyle.css";

  let fileStream = fs.createReadStream(
    `${styleSheetDirectory}${styleSheet}`,
    "utf-8"
  );
  let css = fs.readFileSync(`${styleSheetDirectory}${styleSheet}`, "utf-8");
  res.writeHead(200, { "Content-Type": "text/css" });
  res.write(css);
  console.log(`--- End Function oopsStyle() ---`);
}

// Process a GET request
function processGetRequest(req, res) {
  console.log(`--- Begin Function processGetRequest()`);
  // Get all parameters after ?
  let params = new URLSearchParams(req.url.substring(req.url.indexOf("?")));
  // Redirect to index page if no parameters
  if(!params.has("name") ||
     !params.has("favorite-programming-languages") || 
     !params.has("favorite-hobbies") ||
     !params.has("interesting-fact")) {
      // Redirect to home page
      res.writeHead(302, {
        location: "/",
      });
      return;
  }
  console.log(params);
  res.writeHead(200, { "Content-Type": "application/json " });
  let responseObject = {
    name: params.get("name"),
    languages: params.get("favorite-programming-languages").split(",").map((str) => str.trim()),
    hobbies: params.get("favorite-hobbies").split(",").map((str) => str.trim()),
    "interesting-fact":params.get("interesting-fact").trim()
  };
  res.write(JSON.stringify(responseObject));
  console.log(`--- End Function processGetRequest()`);
}

// Process a POST request
function processPostRequest(req, res, body) {
  console.log(`--- Begin function processPostRequest() ---`);
  console.log(`body = ${body}`);
  const params = new URLSearchParams(`?${body}`);
  console.log(params);
  // Redirect to index page if no parameters
  if(!params.has("name") ||
     !params.has("favorite-programming-languages") || 
     !params.has("favorite-hobbies") ||
     !params.has("interesting-fact")) {
      // Redirect to home page
      res.writeHead(302, {
        location: "/",
      });
      return;
  }
  res.writeHead(200, { "Content-Type": "application/json " });
  let responseObject = {
    name: params.get("name"),
    languages: params.get("favorite-programming-languages").split(",").map((str) => str.trim()),
    hobbies: params.get("favorite-hobbies").split(",").map((str) => str.trim()),
    "interesting-fact":params.get("interesting-fact").trim()
  };
  res.write(JSON.stringify(responseObject));
  console.log(`--- End function processPostRequest() ---`);

}

// Render an invalid url page
function renderOopsPage(req, res, webPageData) {
  console.log(`--- Begin Function responsePage() ---`);
  const htmlPage = "oops.ejs";

  const template = fs.readFileSync(`./views/${htmlPage}`, "utf-8");
  const renderedTemplate = ejs.render(template, {
    heading: "Ivalid URL Page",
    url: req.url,
  });
  res.writeHead(404, { "Content-Type": "text/html" });
  res.write(renderedTemplate);
  console.log(`--- End Function responsePage() ---`);
}

// Render an error page
function renderErrorPage(req, res, err) {
  console.log(`--- Begin Function renderErrorPage() ---`);
  const htmlPage = "error.ejs";

  const template = fs.readFileSync(`./views/${htmlPage}`, "utf-8");
  const renderedTemplate = ejs.render(template, { "heading":"Error Page", "error":err });

  res.writeHead(505, { "Content-Type":"text/html" });
  res.write(renderedTemplate);
  console.log(`--- End Function renderErrorPage() ---`);
}
