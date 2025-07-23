# Resource Booking System - Server

## Overview
This server-side application provides RESTful APIs to manage resource bookings with conflict detection and buffer time logic. It uses **Next.js Route Handlers** with **TypeScript** and **Prisma ORM** backed by **SQLite** for persistent storage.

---

## Features

- **Booking Creation API (`POST /api/bookings`)**  
  Accepts booking requests with resource, start time, end time, and requester info.  
  Validates booking duration (minimum 15 minutes) and prevents conflicts by checking overlapping bookings including a 10-minute buffer before and after existing bookings.

- **Booking Retrieval API (`GET /api/bookings`)**  
  Returns all bookings with optional filters by resource and date.  
  Bookings are grouped by resource and sorted by upcoming time.

- **Conflict Detection with Buffer Logic**  
  Prevents overlapping bookings considering a 10-minute buffer on both sides to avoid back-to-back scheduling issues.

- **Booking Cancellation (`DELETE /api/bookings/:id`)**  
  Allows removal of existing bookings.

- **Available Slots API (`GET /api/available-slots`)**  
  Returns available time slots for a given resource and date, factoring in existing bookings and buffer time.

- **Persistent Storage**  
  Uses **SQLite** via Prisma for data persistence.

---

## Setup

### Prerequisites

- Node.js v18 or above  
- npm or yarn  
- SQLite (bundled with Prisma, no separate install needed)  
- Optional: [Postman](https://www.postman.com/) or curl for API testing

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/resource-booking-system.git
   cd resource-booking-system
  ``
   
Install dependencies:
  ```bash
npm install
  ```
Configure environment variables:
Create a .env file in the root directory and add:

   ```bash
DATABASE_URL="file:./resource-booking.db"
   ```
  
Generate Prisma client and run database migration:
 ```bash
npx prisma migrate dev --name init
npx prisma generate
 ```
Start the development server:

 ```bash
npm run dev
 ```
The backend API will be available at http://localhost:3000/api.
API Endpoints
POST /api/bookings
Create a booking. Request body example:

 ```bash
{
  "resourceId": "string",
  "startTime": "ISO8601 datetime string",
  "endTime": "ISO8601 datetime string",
  "requestedBy": "string"
}
 ```
GET /api/bookings
Get all bookings. Optional query parameters:

resource (string): filter by resource ID

date (YYYY-MM-DD): filter bookings on this date

DELETE /api/bookings/:id
Cancel a booking by ID.

GET /api/available-slots?resourceId=...&date=YYYY-MM-DD&duration=minutes
Get available time slots for the resource on the given date for the requested duration.

# Notes
Buffer time is fixed at 10 minutes before and after each booking to avoid scheduling conflicts.

Minimum booking duration is 15 minutes.

SQLite file is stored locally as dev.db by default.
