package main

import (
	"encoding/json"
	"log"
	"time"

	"fiidi/config"
	"fiidi/feedmonitor"
	"fiidi/publisher"
)

func main() {
	appConfig, err := config.ReadConfig("./config/config.yml")
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
		item, ok := <-fm.Channel
		if !ok {
			break
		}
		json, err := json.Marshal(item)
		if err != nil {
			log.Printf("Failed to marshal item: %v\n", err)
			continue
		}
		err = pub.Publish(json)
		if err != nil {
			log.Printf("Failed to publish item: %v\n", err)
		} else {
			log.Printf("Published item: %s\n", item.Link)
		}
	}

	close(fm.Channel)
}
