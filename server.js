#!/usr/bin/env node

const FtpSrv = require('ftp-srv');

const username = process.env.FTP_SRV_USERNAME;
const password = process.env.FTP_SRV_PASSWORD;
const rootPath = process.env.FTP_SRV_ROOT_PATH || '/';

const port = 21;
const url = 'ftp://0.0.0.0:' + port;
const anonymous = !((!!username) || (!!password))
const opts = {
  url,
  anonymous,
  username,
  password,
}

const ftpServer = new FtpSrv(opts);

ftpServer.on('login', ({ _connection, un, pw }, resolve, reject) => {
  if ((anonymous && un === 'anonymous' && pw === 'anonymous') ||
    (username === un && password === pw)) {
    return resolve({ root: rootPath });
  }
  return reject(
    new Error('Invalid username or password', 401)
  );
});

ftpServer.listen().then(() => {
  console.log(`Ftp server is listening on port ${port}...`)
});
