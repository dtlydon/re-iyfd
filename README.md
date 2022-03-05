React + nodejs + typescript version of IYFD

### Deployment
EC2 Instance - Ubuntu
Install nginx
Install node/npm
Install yarn
Install git
Install mongodb
sudo apt install python2
sudo apt-get install build-essential
update .env on server

#### Install PM2
npm i -g pm2

Build react locally and scp
IT TAKES WAY TOO LONG ON THE SERVER
`scp -i .pem -r build {ec2-directory}`
Make sure permission work ^ `chmod`

pm2 serve build 4000
cd ../server
yarn install
pm2 start

sudo nginx -c ~./{code}/nginx
