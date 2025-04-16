# Cloak Service

## Pre-requirements

Following tools should be installed:

- MongoDB
- NodeJS

## Installation

Go to root folder of the app.

1. Install all required packages

```
npm install
```

2. Build app:

```
npm run build
```

3. Run database migrations:

```
npm run migration:run
```

4. Start nodejs app in dev mode:

```
npm run start:dev
```

## Usage

1. To test functionality you can use Swagger API located here:

```
http://localhost:8000/api
```

## Create migration

```
npm run migration:create -- 005-your-migration-name
```

## Technical Specification

Project Overview

Cloak Service is a traffic filtering system designed to determine whether a request originates from a bot or a real user. This system is relevant in the traffic arbitrage industry, where it is necessary to serve different content to regular users and moderators/reviewers (e.g., from advertising platforms). The goal of this MVP is to build a RESTful API service capable of performing such classification based on request metadata.

Main Functionalities

- Accept data via REST API: The service should expose an endpoint (e.g., POST /api/v1/cloak/check) that receives request metadata such as IP address, User-Agent, Referrer, etc., in JSON format.

- Request classification: The backend analyzes the provided data using multiple filters to classify the request as either a bot or not a bot.

- Response format: Returns a JSON response indicating the classification result, e.g., { "result": "bot" } or { "result": "not bot" }.

Classification Logic

The classification is based on a set of filters. If any filter determines the request is suspicious, the request is classified as a bot. Filters include:

- IP reputation (VPN/Proxy/Tor):

Use services like vpnapi.io to determine if the IP belongs to a VPN, proxy, or Tor network.

Results from such lookups can be cached in MongoDB to reduce redundant external API calls.

- User-Agent analysis:

  Detect known bot patterns such as Googlebot, bingbot, crawler, curl, python-requests, etc.

  Empty or malformed User-Agents are also considered suspicious.

- Referrer inspection:

  Certain referrers (e.g., facebook.com/ads) may indicate moderation tools.

- Request frequency:

  Track request volume per IP. If a single IP sends too many requests in a short time window, classify it as a bot.

- Geolocation (optional):

  Cross-check IP location against expected regions (e.g., avoid unlikely locations or data center ranges).
