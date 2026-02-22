# LLM Agent Runtime

Autonomous code agent runtime with multi-step planning and tool execution.

---

## Overview

LLM Agent Runtime is an experimental architecture for building tool-driven autonomous agents.a

This project explores:

- Multi-step planning
- Structured LLM output
- Tool execution pipeline
- Execution safety and control
- Agent runtime design patterns
- Context handling and extensibility

The goal is to build a robust agent runtime architecture rather than a simple chat wrapper.

---

## Architecture

```text
Client (VS Code Extension / CLI)
        ↓
Agent Runtime
        ├─ Planner
        ├─ Executor
        ├─ Tool Registry
        ├─ Context Builder
        └─ LLM Provider (OpenAI)
```

### Core Components

- Planner: Generates structured execution plans
- Executor: Executes tools based on planner output
- Tool Registry: Typed tool definitions and validation
- Runtime Layer: Controls flow, validation, and safety
- LLM Provider: OpenAI integration

---

## Current Features

- Structured request validation (Zod)
- OpenAI integration
- Typed agent runtime
- Modular folder structure
- ESLint + TypeScript strict mode
- Alias-based imports (`@/`)

---

## Tech Stack

- Node.js (ESM)
- TypeScript (strict mode)
- Fastify
- Zod
- OpenAI API
- ESLint (Flat Config)
- Prettier

---

## Project Structure

```text
src/
 ├─ server.ts
 ├─ services/
 ├─ tools/
 ├─ planner/
 ├─ executor/
 ├─ types/
 └─ utils/
```

---

## Running the Project

1. Install dependencies:

```bash
pnpm install
```

2. Configure environment:

Create a `.env` file:

```env
OPENAI_API_KEY=your_key_here
OPENAI_MODEL=gpt-4o-mini
PORT=3789
```

3. Start development server:

```bash
pnpm dev
```

Server runs at:

```text
http://127.0.0.1:3789
```

---

## Example Request

```bash
curl -X POST http://127.0.0.1:3789/run \
  -H "Content-Type: application/json" \
  -d '{
    "mode": "chat",
    "message": "Explain closures in JavaScript",
    "context": {}
  }'
```

---

## Roadmap

- [ ] Structured JSON output enforcement
- [ ] Planner / Executor separation
- [ ] Tool-calling abstraction
- [ ] Execution audit log
- [ ] Memory layer
- [ ] RAG support
- [ ] VS Code integration

---

## Purpose

This repository is part of a deeper exploration of:

- Autonomous agent design
- Tool-driven LLM systems
- Execution safety
- Runtime orchestration patterns
- AI-assisted developer tooling

---

## License

MIT
