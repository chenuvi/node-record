import * as http from 'http';
import { IncomingMessage, ServerResponse } from 'http';

const hostname = '127.0.0.1'
const port = 3000

const server = http.createServer((req: IncomingMessage, res:ServerResponse) => {
  console.log("-> req.url", req.url);
  console.log("-> req.method", req.method);
  res.statusCode = 200
  res.setHeader('Content-Type', 'text/plain')
  res.end('hello world! \n')
})
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
})