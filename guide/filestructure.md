# 🧠 The FIle structure (Layers)

Think of your frontend as 5 layers:

```
1. UI Layer (React components)
2. State Layer (hooks)
3. Adapter Layer (data mapping)
4. Service Layer (API calls)
5. Utils Layer (pure helpers)
```

Now let’s break each one down properly.

---

# 1. 🧩 UI Layer (React Components)

📁 `components/`

### What belongs here:

* JSX
* user interactions
* calling hooks/services
* no business logic

### Example:

```ts
<CreateIntegrationDialog />
<EditIntegrationDialog />
<IntegrationList />
```

### ❌ Should NOT contain:

* API calls
* payload building
* validation logic

---

# 2. 🪝 State Layer (Hooks)

📁 `hooks/`

### What belongs here:

* component state logic
* async actions orchestration
* calling services
* caching / mutation logic

### Example:

```ts
useIntegrations()
useCreateIntegration()
useUpdateIntegration()
```

### Example hook:

```ts
export function useUpdateIntegration() {
  const update = async (id, data) => {
    return integrationService.update(id, data);
  };

  return { update };
}
```

---

# 3. 🔁 Adapter Layer (VERY IMPORTANT)

📁 `services/integrations/adapter.ts`

### What belongs here:

* transform React form → API payload
* transform API response → UI model
* mapping logic

### Example:

```ts
export function toIntegrationPayload(form) {
  return {
    label: form.label,
    channel: form.channel,
    config: buildConfig(form),
    is_active: form.isActive,
  };
}
```

### Also:

```ts
export function fromIntegrationResponse(apiData) {
  return {
    id: apiData.id,
    label: apiData.label,
    isActive: apiData.is_active,
    recipientEmails: apiData.config?.recipient_emails ?? [],
  };
}
```

---

# 4. 🌐 Service Layer (API ONLY)

📁 `services/integrations/service.ts`

### What belongs here:

* HTTP requests only
* NO transformation logic

### Example:

```ts
import apiClient from "../client";

export const integrationService = {
  list: () => apiClient.get("/route-apikeys/"),
  create: (payload) => apiClient.post("/route-apikeys/", payload),
  update: (id, payload) =>
    apiClient.patch(`/route-apikeys/${id}/`, payload),
};
```

### ❌ Do NOT:

* build payloads here
* format data here

---

# 5. 🧠 Utils Layer (Pure Functions)

📁 `utils/` or `services/integrations/utils.ts`

### What belongs here:

* pure reusable logic
* no API knowledge
* no React knowledge

### Example:

```ts
export function buildConfig(data) {
  const config: any = {};

  if (data.recipientEmails) {
    config.recipient_emails = data.recipientEmails;
  }

  return config;
}
```

---

# 🗂️ Final Recommended Folder Structure

```
src/
│
├── components/
│   ├── integrations/
│   │   ├── CreateIntegrationDialog.tsx
│   │   ├── EditIntegrationDialog.tsx
│   │   ├── IntegrationList.tsx
│
├── hooks/
│   ├── useIntegrations.ts
│   ├── useCreateIntegration.ts
│   ├── useUpdateIntegration.ts
│
├── services/
│   ├── apiClient.ts
│   ├── integrationService.ts
│   │
│   └── integrations/
│       ├── adapter.ts        ← mapping logic
│       ├── utils.ts          ← helpers like buildConfig
│
├── types/
│   ├── integration.ts
│
└── utils/
    ├── formatDate.ts
```

---

# 🔥 How Everything Flows (IMPORTANT)

### Example: Update Integration

```
UI (EditDialog)
   ↓
hook (useUpdateIntegration)
   ↓
adapter (toIntegrationPayload)
   ↓
service (integrationService.update)
   ↓
DRF API
```

---

# ⚠️ Common Mistake (What you're currently close to doing)

❌ Putting `buildConfig` inside:

* components
* service
* hooks

This causes:

* circular imports
* duplicated logic
* unpredictable bugs

---

# 💡 Simple Rules (Memorize These)

### 🧩 Components

> “What the user sees”

---

### 🪝 Hooks

> “What the user does”

---

### 🔁 Adapter

> “Shape data”

---

### 🌐 Service

> “Talk to backend”

---

### 🧠 Utils

> “Pure math / logic helpers”

---

# 🚀 Final Answer

👉 `buildConfig` belongs in:

```
services/integrations/utils.ts
```

or better:

```
services/integrations/adapter.ts
```

NOT:

* components ❌
* service ❌
* hooks ❌
