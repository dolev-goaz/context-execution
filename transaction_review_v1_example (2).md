# Example Flow — `transaction_review_v1`

## Request Body
```json
{
  "flow": {
    "id": "transaction_review_v1",
    "steps": [
      {
        "type": "task",
        "task": "riskCheck",
        "id": "risk",
        "input": {
          "amount": "$.transaction.amount",
          "country": "$.transaction.country"
        }
      },
      {
        "type": "if",
        "id": "route",
        "cond": { ">=": ["$.risk.riskScore", 8] },
        "then": [
          {
            "type": "task",
            "task": "notify",
            "input": { "team": "high_risk" }
          }
        ],
        "else": [
          {
            "type": "task",
            "task": "notify",
            "input": { "team": "standard" }
          }
        ]
      }
    ]
  },
  "context": {
    "transaction": {
      "amount": 12500,
      "country": "IL"
    }
  }
}
```

---

## Expected Output (Example)
```json
{
  "context": {
    "transaction": { "amount": 12500, "country": "IL" },
    "risk": { "riskScore": 3 },
    "notify": { "notified": true, "team": "standard" }
  },
  "trace": [
    { "id": "risk", "type": "task", "ok": true },
    { "id": "route", "type": "if", "branch": "else" },
    { "id": "notify", "type": "task", "ok": true }
  ]
}
```
