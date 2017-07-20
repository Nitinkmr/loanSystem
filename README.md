# BlockChain in a loan lending system.

Installation instructions for hyperledger composer and for deploying a .BNA file

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. 

### Prerequisites

Things you need to install and how to install them

```
Operating System: Ubuntu Linux 14.04 / 16.04 LTS (both 64-bit) (or a VM with same configuration)
Docker Engine: Version 17.03 or higher
Docker-Compose: Version 1.8 or higher
Node: 6.x (note version 7 is not supported)
npm: 3.10.x
git: 2.9.x
```

### Installing hyperledger composer

A step by step series of commands that tell you how to get a development env running

Download all the prerequisites using the following command
```
curl -O https://raw.githubusercontent.com/hyperledger/composer-sample-applications/master/packages/getting-started/scripts/prereqs-ubuntu.sh

chmod u+x prereqs-ubuntu.sh
```
once downloaded, just run the below script
```
./prereqs-ubuntu.sh
```
# Now download the development tools:

```
npm install -g composer-cli
npm install -g generator-hyperledger-composer
npm install -g composer-rest-server
npm install -g yo
```
# Starting Hyperledger Fabric:

```
docker kill $(docker ps -q)
docker rm $(docker ps -aq)
docker rmi $(docker images dev-* -q)
```
In a directory of your choice (will assume ~/fabric-tools) get the zip file that contains the tools

```
mkdir ~/fabric-tools && cd ~/fabric-tools

curl -O https://raw.githubusercontent.com/hyperledger/composer-tools/master/packages/fabric-dev-servers/fabric-dev-servers.zip
unzip fabric-dev-servers.zip

```
export the fabric version (we are using V1)

```
export FABRIC_VERSION=hlfv1
```

Now our fabric resides in ~/fabric-tools
To start Fabric issue following commands:
(if this is the first time, you'll need to download the fabric first else you can skip the below command)
```
./downloadFabric.sh
```
Once download has completed, issue the followind commands (again, ensure that you change directory to the one where you have installed fabric)

```
cd ~/fabric-tools
./startFabric.sh
./createComposerProfile.sh
```

And to stop Fabric issue following commans:
```
cd ~/fabric-tools
./stopFabric.sh
./teardownFabric.sh
```
Now we have succesfully installed hyperledger composer.



## Deploying a business network archive file (.BNA) to the running hyperledger fabric instance

You can code any business logic on the [Hyperledger composer playground](https://composer-playground.mybluemix.net) and simply export the .bna file by clicking on the export button on the bottom left side of the screen.
extract the obtained .bna file to any directory of your choice (assuming ~/my-network).
Once you have a .bna file follow these steps:


ensure that your fabric instance is running, if not then run the following command:
(again make sure that you change directory to where you have installed the fabric earlier)
```
 cd ~/fabric-tools/
./startFabric.sh

```
once your fabric has started succesfully

```
cd ~/my-network/
```
now install the npm dependencies from the package.json file by running:
(this needs to be done only when you have obtained a new .bna file or if there is a change in package.json file)

```
npm install
```

create an archive file in /dist folder:

```
composer archive create -a dist/basic-sample-network.bna --sourceType dir --sourceName .
```
check that you have a  basic-sample-network.bna file inside the dist folder in your working directory.

time to deploy the .bna file to the hyperledger fabric

```
cd dist/

composer network deploy -a basic-sample-network.bna -p hlfv1 -i PeerAdmin -s randomString
```
your .bna file has been deployed to the fabric instance and now we just need to expose it as a REST API, for that execute the following command:

```
cd ..

composer-rest-server -p hlfv1 -n basic-sample-network -i admin -s adminpw -N never
```
 

## Authors

* **Nitin Kumar** - *Initial work* - [Nitinkmr](https://github.com/Nitinkmr)

