FROM postgres:15.2

COPY migrates/*.sql /docker-entrypoint-initdb.d/
COPY test_seed/*.sql /docker-entrypoint-initdb.d/

ENV POSTGRES_DB local_database
ENV POSTGRES_USER admin
ENV POSTGRES_PASSWORD admin

EXPOSE 5432
