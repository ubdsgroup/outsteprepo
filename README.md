# Setting up docker containers for the OUTSTEP web application

## Setting up mysql docker container with persistent storage
To allow for the databases to persist in the image, first create the following `Dockerfile`:
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
You can given any name to the image instead of `o-mysql`.
### Setting up database
```shell
docker exec -it <db-container-name> mysql -uroot -p -e "$(cat createdb.sql)"
```

### Populating data

```shell
docker exec -it <db-container-name> mysql -u<username> -p -e "$(cat popualtedb.sql)"
```
