# IoT Monitoring Platform

React 기반 실시간 IoT 관제 대시보드 프로젝트입니다.

## 📌 Overview

IoT 장비 상태 및 운영 현황을 실시간으로 모니터링하기 위한 대시보드입니다.

사업별 데이터를 분리하여 시각화하고, 운영 상태를 빠르게 확인할 수 있도록 구성하였습니다.

---

## 🛠 Tech Stack

### Frontend

* React
* JavaScript
* HTML/CSS

### Infra / Deploy

* Docker
* Nginx

### Backend (연동 예정)

* Spring Boot
* Redis
* Kafka

---

## 📊 Main Features

* 실시간 상태 모니터링
* 사업별 관제 대시보드
* 상태 시각화 UI
* Docker 기반 배포 환경
* Nginx 기반 정적 서비스 구성

---

## 📂 Project Structure

```text
src/
 ├ pages/
 ├ components/
 ├ layouts/
 └ assets/
```

---

## 🚀 Run Project

### Local

```bash
npm install
npm start
```

### Docker

```bash
docker build -t fds-monitoring .
docker run -p 80:80 fds-monitoring
```

---

## 📌 Future Plans

* Redis 기반 캐싱 적용
* Kafka 기반 이벤트 처리 구조 추가
* WebSocket 실시간 데이터 처리
* Docker Compose 환경 구성
* Monitoring 시스템 고도화

---

## 👨‍💻 Developer

KiHyuck Kang

* IoT Platform Engineer
* Backend / Android / Infra / Monitoring
