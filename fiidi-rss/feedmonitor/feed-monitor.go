package feedmonitor

import (
	"log"
	"time"

	"github.com/mmcdole/gofeed"
)

const MaxHistoryLength = 150

type Item struct {
	Title      string   `json:"title"`
	Link       string   `json:"link"`
	Categories []string `json:"categories"`
}

type FeedMonitor struct {
	History  map[string][]*gofeed.Item // History of feed items
	FeedUrls []string                  // List of feed URLs
	Refresh  time.Duration             // Refresh interval
	Channel  chan *Item                // Channel for new items
	Parser   *gofeed.Parser            // Feed parser
}

func NewMonitor(feedUrls []string, refresh time.Duration) *FeedMonitor {
	return &FeedMonitor{
		History:  make(map[string][]*gofeed.Item),
		FeedUrls: feedUrls,
		Refresh:  refresh,
		Channel:  make(chan *Item, 100),
		Parser:   gofeed.NewParser(),
	}
}

// Start monitoring the feeds
func (fm *FeedMonitor) Start() {
	ticker := time.NewTicker(time.Duration(fm.Refresh))
	defer ticker.Stop()
	for range ticker.C {
		for _, feedURL := range fm.FeedUrls {
			fm.processFeed(feedURL)
		}
	}
}

// Process a single feed
func (fm *FeedMonitor) processFeed(feedURL string) {
	feed, err := fm.Parser.ParseURL(feedURL)
	if err != nil {
		log.Printf("Failed to parse feed %q: %v\n", feedURL, err)
		return
	}

	for _, item := range feed.Items {
		if !fm.isNewArticle(item, feedURL) {
			log.Printf("Skipping old item \n")
			continue
		}

		// Keep history length at MaxHistoryLength
		fm.History[feedURL] = append(fm.History[feedURL], item)
		historyLen := len(fm.History[feedURL])
		if historyLen > MaxHistoryLength {
			fm.History[feedURL] = fm.History[feedURL][historyLen-MaxHistoryLength:]
		}

		// Send new item to the channel
		fm.Channel <- &Item{
			Title:      item.Title,
			Link:       item.Link,
			Categories: item.Categories,
		}
	}
}

func (fm *FeedMonitor) isNewArticle(item *gofeed.Item, feedURL string) bool {
	history, ok := fm.History[feedURL]
	if !ok {
		return true
	}
	for _, i := range history {
		if i.GUID == item.GUID || i.Link == item.Link {
			return false
		}
	}
	return true
}
