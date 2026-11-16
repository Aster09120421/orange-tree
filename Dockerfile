FROM python:3.12-slim

WORKDIR /app
COPY . /app

ENV PORT=8080
ENV ORANGE_DATA_PATH=/data/orange-data.json

VOLUME ["/data"]
EXPOSE 8080

CMD ["sh", "-c", "python3 orange_server.py --host 0.0.0.0 --port ${PORT:-8080} --data ${ORANGE_DATA_PATH:-/app/orange-data.json}"]
