package main

import (
	"log"
	"time"

	"fiidi/config"
	"fiidi/feedmonitor"
	"fiidi/publisher"
)

func main() {
	appConfig, err := config.ReadConfig("config.yml")
	if err != nil {
		log.Fatalf("Failed to read config file: %v", err)
	}

	pub, err := publisher.NewPublisher("amqp://guest:guest@localhost:5672/", appConfig.QueueName)
	if err != nil {
		log.Fatalf("Failed to create publisher: %v", err)
	}

	defer pub.Conn.Close()
	defer pub.Channel.Close()

	fm := feedmonitor.NewMonitor(appConfig.Feeds, 60*time.Second)
	go fm.Start()

	for {
		select {
		case item := <-fm.Channel:
			log.Printf("New item: %s\n", item.Title)
		}
	}

}
