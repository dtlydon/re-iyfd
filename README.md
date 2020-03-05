React + nodejs + typescript version of IYFD

### Deployment
EC2 Instance - Ubuntu
Install nginx
Install node/npm
Install yarn
Install git
Install mongodb

Setup nginx with two apps
- `/` pointed to client
- `/server` pointed to server

Build react locally and scp
`scp -i .pem /* /build`
chmod the build file

Run the servers via pm2 + npm
