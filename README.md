# 🔧 Hotfix

Hotfix is a full-stack web application that connects customers with skilled tradespeople. Customers can post jobs, receive quotes, and book services, while tradesmen can manage jobs, submit quotes, and showcase their profiles.

The goal of Hotfix is to streamline the entire job-to-booking flow in one simple platform.

---

## Tech Stack

### Frontend

* React
* TypeScript
* Component-based UI (custom Cards, forms, dashboards)
* REST API integration

### Backend

* Spring Boot (Java)
* RESTful API design
* JPA / Hibernate
* Transactional service layer

### Database

* Relational database (via JPA)
* Separate entities for users, jobs, quotes, reviews, and bookings

---

## Core Functionality

### Users

* Two roles: **Customer** and **Tradesman**
* Authentication and role-based access

### Tradesman Flow

* View open jobs
* Submit **one quote per job**
* Track quoted jobs
* See accepted quotes and upcoming bookings
* Manage personal profile (bio, details, ratings)

### Customer Flow

* Post jobs with descriptions
* Receive multiple quotes from tradesmen
* Accept a quote to create a booking
* Leave reviews and ratings after job completion

### Reviews & Ratings

* Customers can review tradesmen
* Ratings are aggregated and displayed on tradesman profiles

---

## Project Status

This project implements the **core end-to-end functionality** of a trades marketplace:
job posting → quoting → acceptance → booking → review.

It is designed as a clean, modular foundation in the hope that it can be extended with features like messaging, payments, or notifications.

---

## Getting Started

1. Run the Spring Boot backend
2. Start the React frontend
3. Access the app in your browser and create a customer or tradesman account

---

Happy fixing with **Hotfix** 🔧
