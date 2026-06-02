# IoT Monitoring Platform

실시간 IoT 장비 상태 및 운영 데이터를 모니터링하기 위한 통합 관제 플랫폼입니다.

React 기반 Dashboard와 Spring Boot 기반 Backend 서버를 중심으로 구성되어 있으며,
Docker 환경 기반으로 운영 가능한 구조를 목표로 개발하고 있습니다.

---

# 📌 Overview

IoT 장비에서 수집되는 데이터를 실시간으로 시각화하고,
사업별 운영 현황 및 상태를 빠르게 확인할 수 있도록 구성된 Monitoring Platform 입니다.

현재 Redis, Docker Compose 기반 구조로 지속적인 고도화를 진행하고 있습니다.

---

# 🛠 Tech Stack

## Frontend

* React
* JavaScript
* HTML/CSS
* Axios

## Backend

* Spring Boot
* Maven
* MyBatis

## Database

* MariaDB
* Redis

## Infra / Deploy

* Docker
* Docker Compose
* Nginx

## Monitoring / Future Stack

* Redis Cache

---

# 📊 Main Features

* 실시간 IoT 상태 모니터링
* 사업별 관제 Dashboard
* 장비 상태 시각화
* 실시간 데이터 갱신
* Docker 기반 배포 환경 구성
* Nginx 기반 정적 서비스 구성

---

# 📂 Project Structure

```text
iot-monitoring-platform/
│
├ frontend/
│   ├ src/
│   ├ public/
│   └ package.json
│
├ backend/
│   ├ src/
│   ├ pom.xml
│   └ Dockerfile
│
└ docker-compose.yml
```

---

# 🚀 Run Project

## Frontend

```bash
cd frontend
npm install
npm start
```

## Backend

```bash
cd backend
./mvnw spring-boot:run
```

## Docker

```bash
docker-compose up -d
```

---

# 📌 Architecture

```text
React Dashboard
        ↓
Spring Boot API Server
        ↓
Redis Cache
        ↓
MariaDB
```

---

# 📌 Future Plans

* Redis 기반 캐싱 구조 적용
* Docker Compose 기반 통합 환경 구성
* Monitoring 시스템 고도화

---

# 👨‍💻 Developer

KiHyuck Kang

* IoT Platform Engineer
* Backend / Android / Infra / Monitoring
* Spring Boot / React / Docker / Redis 
