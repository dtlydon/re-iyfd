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
sudo npm install -g yarn
```

#### Install PM2
`npm i -g pm2`

### Clone the code
`git clone https://github.com/dtlydon/re-iyfd.git`

### Update actions to build and copy to the new EC2 server

### Start Mongo
sudo systemctl start mongod
sudo ser
### Start the app and server
sudo pm2 serve build 4000 --spa
cd ../server
sudo yarn install
sudon pm2 start index.js

sudo nginx -c ~/{code}/nginx

## Post deploy
Create target group + LB - Origin is http - 80
Create cloudfront distro
- Cache policy = Disable cache
- Origin request policy = AllViewer
Create route53 A record
