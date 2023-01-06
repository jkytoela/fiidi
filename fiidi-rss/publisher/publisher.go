package publisher

import (
	"time"

	"github.com/rabbitmq/amqp091-go"
)

const MaxAttempts = 5

type Publisher struct {
	Conn    *amqp091.Connection
	Channel *amqp091.Channel
	Queue   amqp091.Queue
}

func NewPublisher(amqpURI, name string) (*Publisher, error) {
	var conn *amqp091.Connection
	var err error

	for i := 0; i < MaxAttempts; i++ {
		conn, err = amqp091.Dial(amqpURI)
		if err == nil {
			break
		}
		time.Sleep(time.Minute)
	}

	channel, err := conn.Channel()
	if err != nil {
		return nil, err
	}

	queue, err := channel.QueueDeclare(name, true, false, false, false, nil)
	if err != nil {
		return nil, err
	}

	return &Publisher{conn, channel, queue}, nil
}

func (p *Publisher) Publish(json []byte) error {
	return p.Channel.Publish("", p.Queue.Name, false, false, amqp091.Publishing{
		ContentType: "application/json",
		Body:        json,
	})
}
