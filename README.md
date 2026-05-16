````md
# AEGIS — AI-Powered Mental Health Risk Detection & Safety Monitoring Platform

## Overview

AEGIS is a full-stack AI-powered mental health risk detection and intervention platform designed to monitor emotional distress signals from user conversations in real time.

The platform includes:

- A secure anonymous user chat interface
- Real-time AI-powered emotional analysis
- Historical risk tracking
- Async queue-based processing architecture
- Risk escalation workflows
- Operational monitoring dashboard
- AI failure recovery with fallback decision engine

AEGIS processes user messages asynchronously using BullMQ workers, analyzes emotional patterns using Gemini AI, tracks behavioral trends over time, classifies psychological risk levels, and recommends intervention actions such as clarification, grounding support, journaling prompts, or crisis escalation.

The system is designed with resilience and privacy-first principles inspired by real-world mental health platforms.

---

# Features

- AI-powered sentiment and risk analysis
- Historical context-aware detection
- Async processing using BullMQ + Redis
- Risk classification (LOW / MEDIUM / HIGH)
- Action recommendation engine
- Hard-risk phrase detection
- Fallback risk engine when AI fails
- Tracking ID based status retrieval
- Explainable AI decision responses
- SOS escalation workflow support
- Anonymous nickname-based user sessions
- Persistent session-aware behavioral tracking
- Real-time operational monitoring dashboard
- Live risk trend visualization
- Intervention action pipeline
- AI retry mechanism with exponential backoff
- AI failure observability
- Frontend chatbot interface
- Session-safe backend identity generation

---

# Tech Stack

## Frontend

- React.js
- Tailwind CSS
- Recharts
- Axios
- React Router

## Backend

- Node.js
- Express.js

## Database

- MongoDB
- Mongoose

## Queue & Workers

- BullMQ
- Redis

## AI

- Gemini 2.5 Flash API

---

# Architecture

```text
Anonymous User Chat
        ↓
POST /messages
        ↓
Express API Layer
        ↓
Session-based Internal User Mapping
        ↓
Store Message in MongoDB
        ↓
Push Job to BullMQ Queue
        ↓
Message Worker
        ↓
Risk Analysis Engine
   ├── Hard Risk Detection
   ├── Gemini AI Analysis
   ├── Historical Trend Analysis
   ├── Retry Mechanism
   └── Fallback Engine
        ↓
Store Final Decision
        ↓
Dashboard Monitoring Layer
   ├── Risk Distribution
   ├── Risk Trend Analytics
   ├── Intervention Tracking
   └── Operational Visibility
````

---

# Privacy-First Session Design

AEGIS follows a privacy-aware architecture inspired by modern mental health platforms.

Users only provide a nickname during chat initialization.

The backend internally generates and manages a persistent session-based identifier used for:

* historical trend analysis
* behavioral tracking
* emotional progression monitoring

This internal identifier is never exposed to the frontend UI.

Stored structure:

```json
{
  "nickname": "night_owl",
  "user_id": "internal-session-id",
  "tracking_id": "uuid",
  "message": "I feel emotionally exhausted"
}
```

This approach allows:

* anonymous interaction
* longitudinal emotional tracking
* safer user privacy boundaries

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
| NONE      | No intervention needed                 |
| CLARIFY   | Encourage supportive conversation      |
| GROUNDING | Suggest calming / grounding techniques |
| JOURNAL   | Suggest emotional journaling           |
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

## Step 4 — Retry Mechanism

If AI processing fails:

* Automatic retry attempts are triggered
* Exponential backoff is applied
* Retry counts are tracked internally
* Queue processing continues safely

---

## Step 5 — Fallback Engine

If:

* AI fails
* API quota errors occur
* invalid responses are returned
* retries are exhausted

The system switches to a rule-based fallback engine to ensure uninterrupted processing.

---

# AI Resilience System

AEGIS includes a resilient AI recovery pipeline.

If Gemini AI fails:

1. The worker retries processing automatically
2. Exponential backoff is applied
3. Retry attempts are tracked
4. If all retries fail, the fallback engine activates

Fallback processing ensures:

* uninterrupted message handling
* graceful degradation
* operational reliability

Possible statuses:

* PENDING
* PROCESSING
* RETRYING
* PROCESSED
* AI_FAILED_FALLBACK_USED
* FAILED

---

# Frontend Monitoring Dashboard

AEGIS includes a real-time operational dashboard for monitoring safety intelligence.

Features include:

* Live conversation monitoring
* Risk trend analytics
* Risk distribution visualization
* Intervention tracking
* Queue processing visibility
* AI failure observability
* Escalation monitoring
* Session-aware conversation tracking

---

# API Endpoints

# Create Message

## POST `/v1/messages`

### Request

```json
{
  "nickname": "night_owl",
  "message": "I feel emotionally exhausted lately"
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
  "nickname": "night_owl",
  "status": "PROCESSED",
  "message": "I feel emotionally exhausted lately",
  "sentiment": "negative",
  "confidence": 0.92,
  "risk": "MEDIUM",
  "risk_trend": "INCREASING",
  "action": "GROUNDING",
  "decision_reason": "The user expresses sustained emotional distress indicating medium risk."
}
```

---

# Database Schema

Each message stores:

* nickname
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
* retry_count
* last_error
* system_note

---

# Queue System

## Message Queue

Handles async AI processing.

## SOS Queue

Handles high-risk escalation workflows separately.

This separation improves scalability and fault isolation.

---

# Demonstration Scenarios

The platform demonstrates multiple production-style safety workflows:

## 1. Happy Path Processing

* User sends emotionally concerning message
* AI analyzes sentiment and risk
* Appropriate intervention action generated

Example progression:

```text
LOW → MEDIUM → HIGH
```

Intervention evolution:

```text
NONE → GROUNDING → ESCALATE
```

---

## 2. AI Retry Recovery

* AI API failure occurs
* Worker retries processing automatically
* Exponential backoff applied

---

## 3. Fallback Engine Activation

* AI remains unavailable after retries
* Rule-based fallback engine activates
* Message still processed safely

---

## 4. Failure Observability

* AI failures visible in operational monitoring
* Retry states observable in dashboard
* System maintains resilience during outages

---

# Screenshots

## Safety Monitoring Dashboard

Features shown:

* Real-time risk monitoring
* Emotional trend analytics
* Intervention visibility
* Queue processing telemetry
* Escalation workflows

---

## Anonymous User Chat Interface

Features shown:

* Nickname-based session initialization
* Real-time emotional conversation flow
* Privacy-first interaction model

---

# Running Locally

## Install dependencies

```bash
npm install
```

---

# Configure Environment Variables

Create `.env`

```env
PORT=5000

MONGODB_URI=your_mongodb_uri

REDIS_HOST=your_redis_host
REDIS_PORT=your_redis_port
REDIS_PASSWORD=your_redis_password

GEMINI_API_KEY=your_gemini_api_key

SESSION_SECRET=your_session_secret
```

---

# Start Backend

```bash
npm run dev
```

---

# Start Frontend

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
* operational monitoring systems
* privacy-aware AI workflows
* production-style queue processing

---

# Future Improvements

* Real-time WebSocket updates
* Slack / Email escalation integration
* Multi-language support
* Behavioral analytics
* Rate limiting
* Advanced intervention recommendation engine
* Human-in-the-loop moderation
* Therapist escalation routing
* Live queue telemetry visualization
* Distributed worker scaling

---

# Disclaimer

AEGIS is a technical demonstration project and is not intended to replace professional mental health services, crisis intervention systems, or licensed clinical support.

The system is designed for educational, architectural, and engineering demonstration purposes only.

```
```
