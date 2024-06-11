# trpc-next-project-template

## Build Local DB Image

1. Install Docker Desktop
2. Run command below to build the image (from the root of the repo)
3. Run the image, expand optional settings and set Host port to `5432`

```sh
# Build db image (expose port 5432 when starting a container from this image via docker desktop)
docker.exe build -f database/Dockerfile -t template_local_db database
```

## Backend dev .env

```shell
PGHOST=localhost
PGPORT=5432
PGDATABASE=template_local
PGUSER=admin
PGPASSWORD=admin
JWT_SECRET=localsecret
NODE_ENV=development
```

## Local SMTP server

Using [smtp4dev](https://github.com/rnwood/smtp4dev)

```sh
# Run localhost smtp server
# UI port   - 3001
# SMTP port - 587
docker.exe run --rm -it -p 3001:80 -p 587:25 rnwood/smtp4dev
```
