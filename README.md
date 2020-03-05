React + nodejs + typescript version of IYFD

### Deployment
EC2 Instance - Ubuntu
Install nginx
Install node/npm
Install yarn
Install git
Install mongodb

Use `nginx` file as configuration
Build react locally and scp
`scp -i .pem -r build {ec2-directory}`
Make sure permission work ^ `chmod`
Run the servers via pm2 + npm
