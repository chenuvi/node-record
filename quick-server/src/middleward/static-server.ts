import * as fs from "fs";
import * as path from "path";
import * as url from "url";
import es from "event-stream";
import * as send from "send";
// types file
import { Server, Opts } from "./type";


const QuickServer: Server = {
  server: null,
  watcher: null,
  logLevel: 2,
};
const INJECTED_CODE = fs.readFileSync(
  path.join(__dirname, "injected.html"),
  "utf-8"
);
// 静态文件托管服务
export const staticServer = (root) => {
  var isFile = false;
  try {
    // For supporting mounting files instead of just directories
    // 判断指定的路径是否是文件
    isFile = fs.statSync(root).isFile();
  } catch (e) {
    if (e.code !== "ENOENT") throw e;
  }
  // 返回一个中间件
  return function (req, res, next) {
    // 仅处理GET和HEAD请求
    if (req.method !== "GET" && req.method !== "HEAD") return next();
    // 获取域名后面的路径部分，例如x.com/abc/def获取的是/abc/def
    // 如果isFile为true，直接为空
    var reqpath = isFile ? "" : url.parse(req.url).pathname;
    var hasNoOrigin = !req.headers.origin;
    var injectCandidates = [
      new RegExp("</body>", "i"),
      new RegExp("</svg>"),
      new RegExp("</head>", "i"),
    ];
    var injectTag = null;
    function error(err) {
      if (err.status === 404) return next();
      next(err);
    }
    function inject(stream) {
      // 处理逻辑主要通过重写pipe方法，然后对读取的流的内容进行替换，把</body>字符替换成要注入的ws代码+</body>,然后把res返回的响应头中的Content-Length值更新为替换后的内容长度。
      if (injectTag) {
        // We need to modify the length given to browser
        var len = INJECTED_CODE.length + res.getHeader("Content-Length");
        res.setHeader("Content-Length", len);
        // 保存原pipe的引用
        var originalPipe = stream.pipe;
        // 重写原pipe方法
        stream.pipe = function (resp) {
          // 重新调用pipe方法，并且利用event-stream模块，对流的内容进行注入内容
          // 注入的内容为websocket通信的部分
          originalPipe
            .call(
              stream,
              es.replace(new RegExp(injectTag, "i"), INJECTED_CODE + injectTag)
            )
            .pipe(resp);
        };
      }
    }
    function directory() {
      var pathname = url.parse(req.originalUrl).pathname;
      res.statusCode = 301;
      res.setHeader("Location", pathname + "/");
      res.end("Redirecting to " + escape(pathname) + "/");
    }
    function file(filepath /*, stat*/) {
      var x = path.extname(filepath).toLocaleLowerCase(),
        match,
        possibleExtensions = ["", ".html", ".htm", ".xhtml", ".php", ".svg"];
      if (hasNoOrigin && possibleExtensions.indexOf(x) > -1) {
        // TODO: Sync file read here is not nice, but we need to determine if the html should be injected or not
        var contents = fs.readFileSync(filepath, "utf8");
        for (var i = 0; i < injectCandidates.length; ++i) {
          match = injectCandidates[i].exec(contents);
          if (match) {
            injectTag = match[0];
            break;
          }
        }
        if (injectTag === null && QuickServer.logLevel >= 3) {
          console.warn(
            "Failed to inject refresh script!",
            "Couldn't find any of the tags ",
            injectCandidates,
            "from",
            filepath
          );
        }
      }
    }

    // 利用send库把静态资源作为http的请求结果返回
    send(req, reqpath, { root: root })
      .on("error", error)
      .on("directory", directory)
      .on("file", file)
      .on("stream", inject)
      .pipe(res);
  };
};
