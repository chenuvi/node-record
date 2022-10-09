
import * as url from "url";

// types file
import { Server, Opts } from "./type";


const QuickServer: Server = {
  server: null,
  watcher: null,
  logLevel: 2,
};
function escape(html) {
  return String(html)
    .replace(/&(?!\w+;)/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function staticServer (root) {

}


QuickServer.start = (options) => {
  options = options || {};
  var host = options.host || "0.0.0.0";
  var port = options.port !== undefined ? options.port : 8080; // 0 means random
  var root = options.root || process.cwd();
  var mount = options.mount || [];
  var watchPaths = options.watch || [root];
  QuickServer.logLevel = options.logLevel === undefined ? 2 : options.logLevel;
  var openPath =
    options.open === undefined || options.open === true
      ? ""
      : options.open === null || options.open === false
      ? null
      : options.open;
  if (options.noBrowser) openPath = null; // Backwards compatibility with 0.7.0
  var file = options.file;
  var staticServerHandler = staticServer(root);
  var wait = options.wait === undefined ? 100 : options.wait;
  var browser = options.browser || null;
  var htpasswd = options.htpasswd || null;
  var cors = options.cors || false;
  var https = options.https || null;
  var proxy = options.proxy || [];
  var middleware = options.middleware || [];
  var noCssInject = options.noCssInject;
  var httpsModule = options.httpsModule;

  if (httpsModule) {
    try {
      require.resolve(httpsModule);
    } catch (e) {
      console.error(
        'HTTPS module "' + httpsModule + "\" you've provided was not found."
      );
      console.error("Did you do", '"npm install ' + httpsModule + '"?');
      return;
    }
  } else {
    httpsModule = "https";
  }
};
QuickServer.shutdown = () => {};
module.exports = QuickServer;
console.log("index run");
