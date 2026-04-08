Nice — you’re at the exact point where structure matters. Let’s wire this **cleanly** so your `IntegrationContext` doesn’t turn into a dumping ground.

---

# 🧠 First: Don’t move the service into context

👉 **Context ≠ data layer**
👉 **Hook = logic, Context = distribution**

So the correct flow is:

```txt
integrationService → useIntegrations → IntegrationContext → UI
```

---

# ✅ Step 1: Hook (wrap your service)

Your hook should:

* call the service
* normalize data
* manage state

```ts id="hook-ctx-1"
function useIntegrations() {
  const [routes, setRoutes] = useState<RouteIntegration[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchIntegrations = async () => {
    setLoading(true);
    try {
      const data = await integrationService.list(
        "?is_deleted=false&ordering=-is_active"
      );

      setRoutes(data.results.map(normalizeIntegration));
    } finally {
      setLoading(false);
    }
  };

  const createIntegration = async (input: {
    label: string;
    channel: string;
    recipientEmails: string[];
  }) => {
    const res = await integrationService.create(
      toApiPayload(input)
    );

    setRoutes(prev => [normalizeIntegration(res), ...prev]);
  };

  const updateIntegration = async (
    id: string,
    updates: any
  ) => {
    const res = await integrationService.update(
      id,
      toPartialPayload(updates)
    );

    setRoutes(prev =>
      prev.map(r => (r.id === id ? normalizeIntegration(res) : r))
    );
  };

  const deleteIntegration = async (id: string) => {
    await integrationService.remove(id);
    setRoutes(prev => prev.filter(r => r.id !== id));
  };

  useEffect(() => {
    fetchIntegrations();
  }, []);

  return {
    routes,
    loading,

    fetchIntegrations,
    createIntegration,
    updateIntegration,
    deleteIntegration,
  };
}
```

---

# ✅ Step 2: Context (thin wrapper)

👉 Context should NOT contain logic
👉 It should just expose the hook

```ts id="ctx-setup-2"
const IntegrationContext = createContext<
  ReturnType<typeof useIntegrations> | null
>(null);

export function IntegrationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const integrations = useIntegrations();

  return (
    <IntegrationContext.Provider value={integrations}>
      {children}
    </IntegrationContext.Provider>
  );
}
```

---

# ✅ Step 3: Safe consumer hook

Never use `useContext` directly in components.

```ts id="ctx-hook-3"
export function useIntegrationContext() {
  const ctx = useContext(IntegrationContext);

  if (!ctx) {
    throw new Error(
      "useIntegrationContext must be used within IntegrationProvider"
    );
  }

  return ctx;
}
```

---

# ✅ Step 4: Usage in your component

```tsx id="usage-4"
export default function Integrations() {
  const {
    routes,
    loading,
    createIntegration,
    deleteIntegration,
  } = useIntegrationContext();

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {routes.map(route => (
        <div key={route.id}>
          <h3>{route.label}</h3>

          <button onClick={() => deleteIntegration(route.id)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
```

---

# ⚠️ Common mistakes (avoid these)

### ❌ Putting fetch logic directly in context

```ts id="bad-1"
const IntegrationContext = createContext({
  fetch: async () => {}
});
```

👉 This becomes untestable and messy.

---

### ❌ Calling API directly in components

```ts id="bad-2"
useEffect(() => {
  fetch(...)
}, [])
```

👉 You lose reuse + consistency.

---

### ❌ Mixing normalization in components

```ts id="bad-3"
route.api_keys.live.prefix
```

👉 That belongs in the mapper only.

---

# 🔥 Optional improvement (very useful)

If you don’t want auto-fetch:

```ts id="optional-5"
function useIntegrations({ autoFetch = true } = {}) {
  useEffect(() => {
    if (autoFetch) fetchIntegrations();
  }, [autoFetch]);
}
```

---

# 🧠 When Context is actually worth it

Use `IntegrationProvider` if:

* multiple components need the same data (list + modal + sidebar)
* you want shared state without prop drilling

Don’t use it if:

* only one page uses this → just use the hook directly

---

# 🚀 Final takeaway

You’ve now built a **clean, scalable architecture**:

✔ Service → handles HTTP
✔ Hook → handles logic + state
✔ Context → distributes data
✔ UI → stays dumb

---

If you want, next I can help you:

* add **optimistic updates (instant UI before API responds)**
* implement **pagination with count/next/previous**
* or upgrade this to **React Query (real-world production pattern)**
