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

My next steps include refining and bug fixing before a stable user-ready version is released.

It is designed as a clean, modular foundation in the hope that it can be extended with features like messaging, payments, or notifications.

---

## Getting Started

1. Run the Spring Boot backend
2. Start the React frontend
3. Access the app in your browser and create a customer or tradesman account

---

Happy fixing with **Hotfix** 🔧

---

## Gallery (v0.1):

<img width="1875" height="920" alt="Screenshot 2026-02-01 212154" src="https://github.com/user-attachments/assets/4029b8c2-70a4-4a5d-b185-07f87af11eba" />

---

<img width="1859" height="918" alt="Screenshot 2026-02-01 214402" src="https://github.com/user-attachments/assets/f37129b2-93be-46d7-bbfc-001803fe5e5f" />

---

<img width="1858" height="919" alt="Screenshot 2026-02-01 215201" src="https://github.com/user-attachments/assets/631244d4-0523-425c-96fb-316b5383a23e" />

---

<img width="1857" height="918" alt="Screenshot 2026-02-01 215055" src="https://github.com/user-attachments/assets/8e22b3b3-eebc-4e3c-b72b-ea667dd710ea" />

