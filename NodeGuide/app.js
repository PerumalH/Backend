const http = require("http");
const fs = require("fs");

// Event Driven Architecture
const server = http.createServer((req, res) => {
  console.log(req);

  if (req.url === "/") {
    res.write("<html>");
    res.write("<head><title>My First Page</title></head>");
    res.write(
      '<body><form action="/message" method="POST"><input type="text" name="message"/><button>Complete</button></form></body>'
    );
    return res.end();
  }

  console.log(req.url === "/message", req.url);
  if (req.url === "/message" && req.method === "POST") {
    const body = [];
    req.on("data", (chunk) => {
      console.log(chunk);
      body.push(chunk);
    });
    req.on("end", () => {
      const parsedData = Buffer.concat(body).toString();
      fs.writeFile("message.txt", parsedData, (err) => {
        if (err) {
          console.error(err);
          res.statusCode = 500;
          return res.end("Error writing file");
        }
        res.statusCode = 302;
        // res.setHeader("Location", "/");
        return res.end();
      });
    });

    // N ote: Avoid returning `res.end` directly; it should be called within the callback or after the async operation
  }

  res.setHeader("Content-Type", "text/html");
  res.write("<html>");
  res.write("<head><title>My First Page</title></head>");
  res.write("<body><h1>Hello from my Node.js Server! </h1></body>");
  res.write("</html>");
  res.end();
});

server.listen(3000);
