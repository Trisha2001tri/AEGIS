# AEGIS — AI-Powered Mental Health Risk Detection System

## Overview

AEGIS is an AI-powered backend system designed to detect emotional distress and potential mental health risk from user messages in real time.

The system processes messages asynchronously using queues, analyzes emotional patterns using Gemini AI, tracks historical behavior, classifies risk levels, and recommends appropriate actions such as clarification, grounding support, or crisis escalation.

This project focuses on building a scalable and production-style backend architecture for intelligent emotional risk assessment.

---

# Features

* AI-powered sentiment and risk analysis
* Historical context-aware detection
* Async processing using BullMQ + Redis
* Risk classification (LOW / MEDIUM / HIGH)
* Action recommendation engine
* Hard-risk phrase detection
* Fallback risk engine when AI fails
* Tracking ID based status retrieval
* Explainable AI decision responses
* SOS escalation workflow support

---

# Tech Stack

## Backend

* Node.js
* Express.js

## Database

* MongoDB
* Mongoose

## Queue & Workers

* BullMQ
* Redis

## AI

* Gemini 2.5 Flash API

---

# Architecture

```text
Client Request
      ↓
POST /messages
      ↓
Store Message in MongoDB
      ↓
Push Job to BullMQ Queue
      ↓
Message Worker
      ↓
Risk Analysis Engine
      ├── Hard Risk Detection
      ├── AI Analysis
      ├── Historical Trend Analysis
      └── Fallback Engine
      ↓
Store Final Decision
      ↓
GET /messages/:tracking_id
```

---

# Risk Classification

| Risk Level | Meaning                            |
| ---------- | ---------------------------------- |
| LOW        | Mild emotional concern             |
| MEDIUM     | Emotional distress detected        |
| HIGH       | Crisis or suicidal intent detected |

---

# Action System

| Action    | Purpose                                |
| --------- | -------------------------------------- |
| CLARIFY   | Encourage supportive conversation      |
| GROUNDING | Suggest calming / grounding techniques |
| ESCALATE  | Crisis escalation and helpline support |

---

# AI Decision Flow

## Step 1 — Hard Risk Detection

Critical phrases are immediately detected before AI processing.

Examples:

* "I want to end my life"
* "suicide"
* "kill myself"

These directly trigger HIGH risk escalation.

---

## Step 2 — Context-Aware AI Analysis

If no critical phrase is detected:

* Last 3–5 historical messages are fetched
* Message history is passed to Gemini AI
* AI returns:

  * sentiment
  * confidence
  * risk
  * trend
  * action
  * reasoning

---

## Step 3 — Validation Layer

AI responses are validated before storing results.

Invalid responses trigger the fallback engine.

---

## Step 4 — Fallback Engine

If:

* AI fails
* API errors occur
* invalid responses are returned

The system switches to a rule-based fallback engine to ensure uninterrupted processing.

---

# API Endpoints

## Create Message

### POST `/v1/messages`

### Request

```json
{
  "user_id": "user123",
  "message": "I feel very hopeless today"
}
```

### Response

```json
{
  "success": true,
  "tracking_id": "uuid-generated-id",
  "status": "PENDING"
}
```

---

# Get Message Status

## GET `/v1/messages/:tracking_id`

### Response

```json
{
  "success": true,
  "tracking_id": "uuid-generated-id",
  "status": "PROCESSED",
  "message": "I feel very hopeless today",
  "sentiment": "negative",
  "confidence": 0.92,
  "risk": "MEDIUM",
  "risk_trend": "STABLE",
  "action": "GROUNDING",
  "decision_reason": "The user expresses emotional distress indicating medium risk."
}
```

---

# Database Schema

Each message stores:

* user_id
* message
* sentiment
* confidence
* risk
* risk_trend
* action
* decision_reason
* status
* tracking_id

---

# Queue System

## Message Queue

Handles async AI processing.

## SOS Queue

Handles high-risk escalation workflows separately.

This separation improves scalability and fault isolation.

---

# Future Improvements

* Real-time WebSocket updates
* Slack / Email escalation integration
* Multi-language support
* Behavioral analytics
* Rate limiting
* Advanced intervention recommendation engine

---

# Running Locally

## Install dependencies

```bash
npm install
```

## Configure environment variables

Create `.env`

```env
PORT=5000

MONGODB_URI=your_mongodb_uri

REDIS_HOST=your_redis_host
REDIS_PORT=your_redis_port
REDIS_PASSWORD=your_redis_password

GEMINI_API_KEY=your_gemini_api_key
```

---

## Start server

```bash
npm run dev
```

---

# Project Goals

This project was built to explore:

* AI-assisted backend systems
* scalable async architectures
* intelligent risk classification
* explainable decision systems
* resilient fallback design patterns

---

# Disclaimer

This project is a technical demonstration and is not intended to replace professional mental health services or crisis intervention systems.
