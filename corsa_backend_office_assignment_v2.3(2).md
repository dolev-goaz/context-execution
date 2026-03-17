# Corsa Backend Office Assignment — V2.2 (Language-agnostic)

## Summary
Build a small web service that runs a **flow** on a **context**.  
A flow is a list of steps. Each step is a **task** or an **if**.  
The service returns the updated context and a short execution trace.

---

## What to build
- A web server with one endpoint: `POST /run`
- Core logic that:
  - Executes steps in order
  - Reads values from the context using paths that start with `$.` (e.g., `$.transaction.amount` → `context.transaction.amount`)
  - Supports two built-in tasks: `riskCheck`, `notify`
  - Supports simple comparisons in `if`: `==`, `!=`, `>`, `>=`, `<`, `<=`
  - Saves each step result at `context[ step.id OR step.task ]`
  - Returns a simple `trace` that shows what ran

**Use any common stack. Suggested:**
- **Node.js + TypeScript** (Express/Fastify) **or**
- **Python** (FastAPI/Flask)  
Pick the ecosystem you’re most comfortable with.

---

## Endpoint

### `POST /run`

**Request body**
```json
{
  "flow": { "id": "string", "steps": [] },
  "context": {}
}
```

**Successful response**
```json
{
  "context": {},
  "trace": [
    { "id": "risk", "type": "task", "ok": true },
    { "id": "route", "type": "if", "branch": "then" },
    { "id": "notify", "type": "task", "ok": true }
  ]
}
```

**Error response**  
HTTP 400 with:
```json
{ "error": "clear message" }
```

---

## Flow format

### Step type: `task`
```json
{
  "type": "task",
  "task": "riskCheck" | "notify",
  "id": "optional step key",
  "input": {
    "anyKey": "literal value or a path like $.transaction.amount"
  }
}
```

### Step type: `if`
```json
{
  "type": "if",
  "id": "optional step key",
  "cond": { "<operator>": [ leftValue, rightValue ] },
  "then": [],
  "else": []
}
```

Supported operators: `==`, `!=`, `>`, `>=`, `<`, `<=`  
Operands can be literals or path strings that start with `$.`

---

## Built-in tasks

### `riskCheck`
**Input**
```json
{ "amount": <number>, "country": <string> }
```
**Output**
```json
{ "riskScore": <number> }
```
**Rule**
- `riskScore = round(amount / 10000 + (country === "IL" ? 1 : 0))`  
- Clamp to the range `0..10`

### `notify`
**Input**
```json
{ "team": <string> }
```
**Output**
```json
{ "notified": true, "team": "<string>" }
```
Default `team` is `"standard"` if missing.

---

## Examples
(unchanged JSON payloads; language/runtime doesn’t matter)

- **Example A — Transaction review**
- **Example B — Simple notify**

---

## Tests to include (Bonus)
- One **happy path** test that runs a valid flow and succeeds
- One **invalid case** test that fails for a clear reason (e.g., unsupported operator or malformed step)  
Recommended frameworks: **Jest/Vitest** (Node) or **pytest/unittest** (Python).

---
