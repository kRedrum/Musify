FROM python:3.10.4-alpine

# dissables pip update on each start up
ENV PIP_DISABLE_PIP_VERSION_CHECK 1
# no .pyc write
ENV PYTHONDONTWRITEBYTECODE 1
# docker wont buffer console output
ENV PYTHONUNBUFFERED 1

RUN \
 apk add --no-cache python3 postgresql-libs && \
 apk add --no-cache --virtual .build-deps gcc python3-dev musl-dev postgresql-dev && \
 python3 -m pip install -r requirements.txt --no-cache-dir && \
 apk --purge del .build-deps

RUN mkdir -p /app/fintrack/backend
WORKDIR /app/fintrack/backend

COPY ./requirements.txt .
RUN pip install -r requirements.txt

COPY . .