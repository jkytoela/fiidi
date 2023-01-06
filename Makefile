build:
	docker-compose build
start:
	docker-compose up -d
stop:
	docker-compose down
restart:
	docker-compose down && docker-compose up -d
delete:
	docker-compose down -v
migrate:
	docker exec -it fiidi_api bash -c "npm run migrate\:latest"
