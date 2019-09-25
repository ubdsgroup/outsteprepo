# Setting up docker containers for the OUTSTEP web application

## Setting up mysql docker container with persistent storage
First change to the `mysql` directory:
```shell
cd mysql/
```

To allow for the databases to persist in the image, we use the following [Dockerfile](mysql/Dockerfile):
```
FROM mysql:latest
RUN cp -r /var/lib/mysql /var/lib/mysql-no-volume
CMD ["--datadir", "/var/lib/mysql-no-volume"]
```
Next, build and run,
```shell
docker build . -t o-mysql
docker run -p 3306:3306 \
       --name <db-container-name> \
       -e MYSQL_ROOT_PASSWORD=<root_password> \
       -e MYSQL_USER=<username> \
       -e MYSQL_PASSWORD=<password> \
       -ti o-mysql
```
> Note that in some systems you might have to use `sudo docker` instead of `docker`.

You can given any tag to the image instead of `o-mysql`.
### Setting up database
Use the [create](mysql/createdb.sql) and [populate](mysql/populatedb.sql) scripts.

```shell
docker exec -it <db-container-name> mysql -uroot -p -e "$(cat createdb.sql)"
```

### Populating data

```shell
docker exec -it <db-container-name> mysql -u<username> -p -e "$(cat popualtedb.sql)"
```

## Running the node.js server
From the repository root, change to the `nodejs` directory:
```shell
cd nodejs/
```
Build and run the docker image,
```shell
docker build -t o-nodejs .
docker run -p 3000:3000 -d o-nodejs
```
Again, you can give any name to the image that is built here.
