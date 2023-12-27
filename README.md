# PokémonBattlePlatform

**Authors**:

- Wassel Jemli <wassel.jemli@imt-atlantique.net>
- Mouad Kerara <mouad.kerara@imt-atlantique.net>

This repository is organized into folders for each microservice and the API gateway:

- `/api-gateway`
- `/authentication-service`
- `/game-service`
- `/user-service`

Details about the services and their corresponding ports for performing HTTP requests can be found in the docker-compose.yml file.

## Run project

To build or rebuild services, use the following command:

```bash
docker-compose build
```

To create and start containers, execute the command:

```bash
docker-compose up
```

To stop and remove containers, as well as networks, run the following command:

```bash
docker-compose down
```

## Tests with Postman

For testing purposes, a Postman collection file is provided. Import this collection into Postman, which contains all the necessary requests for testing.
