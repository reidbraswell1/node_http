console.log("Hello World! server.js \n==========\n");

// Exercise 1 Section
console.log("Server Section \n==========\n");

//const http = require("http");
import http, { request } from "http";
import fs from "fs";
//import path from 'path';
import ejs from "ejs";
import { url } from "inspector";
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
  req.on("error", (error) => {
    console.log(error);
    req.writeHead(400, { "Content-Type": "text/html" });
    req.write("An Error Occurred on the server");
  });
  // Handle Response Error's
  res.on("error", (err) => {
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
        res.end();
        console.log(`--- End Case ${urlToRoute} Route ---`);
        break;
      case "/about":
        console.log(`--- Begin Case ${urlToRoute} Route ---`);
        switch(req.method) {
          case "GET":
            processGetRequest(req, res);
          case "POST":
            processPostRequest(req, res, chunks.toString());
        }
        //formSubmissionProcess(req, res, Buffer.concat(chunks).toString());
        console.log(`--- End Case ${urlToRoute} Route ---`);
        break;
      case "/styles/indexStyle.css":
        console.log(`--- Begin Case ${urlToRoute} Route ---`);
        indexStyle(req, res);
        console.log(`--- End Case ${urlToRoute} Route ---`);
        break;
      case "/styles/responseStyle.css":
        console.log(`--- Begin Case ${urlToRoute} Route --`);
        responseStyle(req, res);
        console.log(`--- End Case ${urlToRoute} ---`);
        break;
      case "/styles/oopsStyle.css":
        console.log(`--- Begin Case ${urlToRoute} ---`);
        oopsStyle(req, res);
        console.log(`--- End Case ${urlToRoute} ---`);
        break;
      default:
        console.log(`--- Begin Case default ${urlToRoute} Route ---`);
        //console.log(querystring.parse(req.url));
        renderOopsPage(req, res);
        console.log(`--- End Case ${urlToRoute} ---`);
        break;
    }
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
  res.end();

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
  res.end();
  console.log(`--- End Function indexStyle() ---`);
}

// Serve stylesheet information for response page
function responseStyle(req, res) {
  console.log(`--- Begin Function indexStyle() ---`);
  const styleSheetDirectory = "./styles/";
  const styleSheet = "responseStyle.css";

  let fileStream = fs.createReadStream(
    `${styleSheetDirectory}${styleSheet}`,
    "utf-8"
  );
  let css = fs.readFileSync(`${styleSheetDirectory}${styleSheet}`, "utf-8");
  res.writeHead(200, { "Content-Type": "text/css" });
  res.write(css);
  res.end();
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
  res.end();
  console.log(`--- End Function oopsStyle() ---`);
}

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
      return res.end();
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
  res.end();
  console.log(`--- End Function processGetRequest()`);
}

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
      return res.end();
  }
  res.writeHead(200, { "Content-Type": "application/json " });
  let responseObject = {
    name: params.get("name"),
    languages: params.get("favorite-programming-languages").split(",").map((str) => str.trim()),
    hobbies: params.get("favorite-hobbies").split(",").map((str) => str.trim()),
    "interesting-fact":params.get("interesting-fact").trim()
  };
  res.write(JSON.stringify(responseObject));
  res.end();
  console.log(`--- End function processPostRequest() ---`);

}

// Render a response page
function responsePage(req, res, webPageData) {
  console.log(`--- Begin Function responsePage() ---`);
  //const htmlPage = 'response.ejs';

  //const template = fs.readFileSync(`./views/${htmlPage}`,'utf-8');
  //let renderedTemplate = '';
  //renderedTemplate = ejs.render(template,{ title:"Form Response", name:webPageData.get("name"), favoriteProgrammingLanguage:webPageData.get("favorite-programming-language") });
  res.writeHead(200, { "Content-Type": "application/json " });
  console.log(webPageData.get("name"));
  let responseObject = {};
  responseObject.name = webPageData.get("name");
  let languages = webPageData.get("favorite-programming-languages");
  let hobbies = webPageData.get("favorite-hobbies");
  let languagesArray = languages.split(",");
  let hobbiesArray = hobbies.split(",");
  responseObject["programming-languages"] = languagesArray.map((str) =>
    str.trim()
  );
  responseObject["hobbies"] = hobbiesArray.map(function (str) {
    return str.trim();
  });
  responseObject["interesting-fact"] = webPageData
    .get("interesting-fact")
    .trim();
  res.write(JSON.stringify(responseObject));
  res.end();

  console.log(`--- End Function responsePage() ---`);
}

function renderOopsPage(req, res, webPageData) {
  console.log(`--- Begin Function responsePage() ---`);
  const htmlPage = "oops.ejs";

  const template = fs.readFileSync(`./views/${htmlPage}`, "utf-8");
  const renderedTemplate = ejs.render(template, {
    heading: "Ivalid URL Page",
    url: req.url,
  });

  res.write(renderedTemplate);
  res.end();

  console.log(`--- End Function responsePage() ---`);
}

function renderErrorPage(req, res, err) {
  console.log(`--- Begin Function renderErrorPage() ---`);
  const htmlPage = "error.ejs";

  const template = fs.readFileSync(`./views/${htmlPage}`, "utf-8");
  const renderedTemplate = ejs.render(template, {});

  res.write(renderedTemplate);
  res.end;
  console.log(`--- End Function renderErrorPage() ---`);
}
