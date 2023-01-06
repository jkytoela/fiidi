FROM golang:1.19

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

ADD . .
RUN go mod download

RUN go build -o ./fiidi-rss

CMD ["./fiidi-rss"]
