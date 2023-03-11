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

```
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt update
sudo apt install nginx nodejs git mongodb-org npm
npm install -g yarn
```

#### Install PM2
`npm i -g pm2`
`git clone https://github.com/dtlydon/re-iyfd.git`

Build react locally and scp
IT TAKES WAY TOO LONG ON THE SERVER
`scp -i .pem -r build {ec2-directory}`
Make sure permission work ^ `chmod`

pm2 serve build 4000 --spa
cd ../server
yarn install
pm2 start

sudo nginx -c ~/{code}/nginx

## Post deploy
Create target + LB - Origin is http - 80
Create cloudfront distro
- Cache policy = Disable cache
- Origin request policy = AllViewer
Create route53 A record
