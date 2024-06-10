FROM postgres:15.2

COPY tables/*.sql /docker-entrypoint-initdb.d/
COPY test_data/*.sql /docker-entrypoint-initdb.d/

ENV POSTGRES_DB template_local
ENV POSTGRES_USER admin
ENV POSTGRES_PASSWORD admin

EXPOSE 5432
