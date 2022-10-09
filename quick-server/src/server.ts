import * as path from "path";
import * as fs from "fs";
import * as assign from "object-assign";
const server = require("./index");

// types file
import { Opts } from "./type";
const opts: Opts = {
  host: process.env.IP,
  port: process.env.PORT,
  open: true,
  mount: [],
  proxy: [],
  middleware: [],
  logLevel: 2,
};

const homeDir =
  process.env[process.platform === "win32" ? "USERPROFILE" : "HOME"];

const configPath = path.join(homeDir, "quick-server.json");
if (fs.existsSync(configPath)) {
  const userConfig = fs.readFileSync(configPath, "utf-8");
  assign(opts, JSON.parse(userConfig));
  if (opts.ignorePattern) {
    opts.ignorePattern = new RegExp(opts.ignorePattern);
  }
}
