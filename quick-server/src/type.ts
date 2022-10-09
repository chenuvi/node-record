export interface Opts {
  host: String;
  port: String;
  open: Boolean;
  mount?: [];
  proxy?: [];
  middleware?: [];
  logLevel?: Number;
  ignorePattern?: RegExp;
}

export interface Server {
  server: Object;
  watcher: Object;
  logLevel: Number;
  start?: (args) => void;
  shutdown?: () => void;
}
