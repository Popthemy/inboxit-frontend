import { createContext, useContext, useState, useEffect } from "react";
import { integrationService } from "@/api/integrationService";

interface RouteIntegration {
  id: string;
  label: string;
  channel: string;
  status: "active" | "inactive" | "archived" | "deleted";
  config: {
    recipientEmails: string[];
  };
  liveKey?: {
    id: string;
    prefix: string;
    lastUsed: string;
  };
  testKey: {
    id: string;
    prefix: string;
    lastUsed: string;
  };
  messageCount: number;
  createdAt: string;
  deletedAt?: string;
}

function normalizeRouteIntegration(route: any): RouteIntegration {
  const id = route.id ?? String(route.uid);

  let recipientEmails: string[] = [];
  if (route.config?.recipientEmails?.length) {
    recipientEmails = route.config.recipientsEmails;
  } else if (route.recipientEmails) {
    recipientEmails = route.recipientEmails
      .replace(/"/g, "")
      .split(",")
      .map((email: string) => email.trim())
      .filter(Boolean);
  }

  let status: "active" | "inactive" | "archived" | "deleted";
  if (route.is_deleted) {
    status = "deleted";
  } else if (route.is_archived) {
    status = "archived";
  } else {
    status = route.isActive ? "active" : "inactive";
  }

  return {
    id: id,
    label: route.label || recipientEmails[0] || "Untitled",
    channel: route.channel,

    status: status,

    config: { recipientEmails },

    liveKey: route.apiKeys?.live
      ? {
          id: route.apiKeys.live.uid ?? String(route.apiKeys.live.id),
          prefix: route.apiKeys.live.prefix,
          lastUsed: route.apiKeys.live.lastUsedAt,
        }
      : undefined,
    testKey: {
      id: route.apiKeys?.test.id,
      prefix: route.apiKeys?.test.prefix,
      lastUsed: route.apiKeys?.test.lastUsedAt,
    },
    messageCount:
      route.apiKeys?.test?.usageCount + route.apiKeys?.live?.usageCount || 0,
    createdAt: route.createdAt,
    deletedAt: route.deletedAt,
  };
}

interface RouteIntegrationPayload {
  label?: string;
  channel?: string;
  isActive?: boolean;
  recipientEmails?: string[];
}

/**
 *
 * @param input payload to upload the value that change
 * @returns valid pattern suitable for backend
 */
function toRoutePayload(input: RouteIntegrationPayload) {
  return {
    label: input.label,
    channel: input.channel,
    isActive: input.isActive,
    config: {
      recipientEmails: input.recipientEmails ?? [],
    },
  };
}

const IntegrationContext = createContext<RouteIntegration[]>([]);


function useIntegrations() {
  const [routes, setRoutes] = useState<RouteIntegration[]>([]);
  const [loading, setLoading] = useState(false);

  // ✅ LIST
  const fetchIntegrations = async () => {
    setLoading(true);
    try {
      const data = await integrationService.list(
        "?is_deleted=false&ordering=-is_active",
      );
      
      // setRoutes(data.results.map(route=> normalizeRouteIntegration(route)));
      const result = data.results.map(route=> normalizeRouteIntegration(route))
      setRoutes(result)

      console.log(result)
    } finally {
      setLoading(false);
    }
  };

  // ✅ CREATE
  const createIntegration = async (input: {
    label: string;
    channel: string;
    recipientEmails: string[];
  }) => {
    const payload = toRoutePayload(input);
    const res = await integrationService.create(payload);
    setRoutes((prev) => [normalizeRouteIntegration(res), ...prev]);
  };

  // ✅ UPDATE (PATCH)
  const updateIntegration = async (
    id: string,
    updates: Partial<{
      label: string;
      recipientEmails: string[];
      isActive: boolean;
    }>,
  ) => {
    const payload = toRoutePayload({
      label: updates.label!,
      channel: "email", // or keep existing
      recipientEmails: updates.recipientEmails ?? [],
      isActive: updates.isActive,
    });

    const res = await integrationService.update(id, payload);

    setRoutes((prev) =>
      prev.map((r) => (r.id === id ? normalizeRouteIntegration(res) : r)),
    );
  };

  // ✅ DELETE (soft delete)
  const deleteIntegration = async (id: string) => {
    await integrationService.remove(id);

    // remove from UI (since API filters is_deleted=false)
    setRoutes((prev) => prev.filter((r) => r.id !== id));
  };

  // ✅ RETRIEVE (optional detail view)
  const getIntegration = async (id: string) => {
    const res = await integrationService.retrieve(id);
    return normalizeRouteIntegration(res);
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
    getIntegration,
  };
}

export function IntegrationsProvider({ children }: { children: ReactNode }) {
  const integrations = useIntegrations();
  return (
    <IntegrationContext.Provider value={integrations}>
      {children}
    </IntegrationContext.Provider>
  );
} 

export function useIntegrationContext() {
  const ctx = useContext(IntegrationContext);

  if (!ctx) {
    throw new Error("useIntegrationContext must be used within a IntegrationContextProvider");
  }
  return ctx;
}



// // for get integration list apikey live or key might exist if it only.
// {
//   "count": 4,
//   "next": null,
//   "previous": null,
//   "results": [
//     {
//       "id": 2,
//       "uid": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
//       "label": "",
//       "user": {
//         "id": "ce7e4cc5-f6ac-4118-bab7-b64771c163df",
//         "user": "intern@gmail.com"
//       },
//       "channel": "email",
//       "is_active": true,
//       "recipient_emails": "intern1@gmail.com",
//       "config": null,
//       "is_deleted": false,
//       "deleted_at": null,
//       "created_at": "2025-08-29T16:30:31.143041Z",
//       "api_keys": {
//         "test": {
//           "id": 1,
//           "route": 2,
//           "prefix": "8h97nIIS",
//           "is_active": false,
//           "env_choices": "test",
//           "channel": "email",
//           "usage_count": 3,
//           "last_used_at": "2025-08-29T21:51:05.389264Z",
//           "created_at": "2025-08-29T16:42:01.800349Z"
//         }
//       }
//     },
//     {
//       "id": 9,
//       "label": "",
//       "user": {
//         "id": "ce7e4cc5-f6ac-4118-bab7-b64771c163df",
//         "user": "intern@gmail.com"
//       },
//       "channel": "email",
//       "is_active": true,
//       "recipient_emails": "\"bubu@gmail.com\",\"nice@gmail.com\", \"trip@gmail.com\"",
//       "config": null,
//       "is_deleted": false,
//       "deleted_at": null,
//       "created_at": "2026-03-11T11:20:21.841163Z",
//       "api_keys": {
//         "test": {
//           "id": 5,
//           "route": 9,
//           "prefix": "5uvdNqjH",
//           "is_active": true,
//           "env_choices": "test",
//           "channel": "email",
//           "usage_count": 1,
//           "last_used_at": "2026-03-11T11:37:50.076442Z",
//           "created_at": "2026-03-11T11:21:34.782002Z"
//         }
//       }
//     },

//   ]
// }

// // post an api
// {
//   "id": 11,
//   "label": "Contact",
//   "channel": "email",
//   "is_active": true,
//   "config": {
//     "recipient_emails": [
//       "edupima@gmail.com",
//       "pima@gmail.com"
//     ]
//   },
//   "is_deleted": false,
//   "deleted_at": null,
//   "created_at": "2026-04-07T12:24:40.164605Z",
//   "api_keys": {
//     "test": {
//       "id": 16,
//       "prefix": "ii_test_3YixkE",
//       "env_choices": "test",
//       "is_active": true,
//       "usage_count": 0,
//       "last_used_at": null,
//       "created_at": "2026-04-07T12:24:40.164605Z",
//       "key": "ii_test_rY7AnEpSt7DOJXNNZNkdNbB0cGvcU3zylDYQF3YixkE"
//     },
//     "live": {
//       "id": 17,
//       "prefix": "ii_live_yqHbuw",
//       "env_choices": "live",
//       "is_active": true,
//       "usage_count": 0,
//       "last_used_at": null,
//       "created_at": "2026-04-07T12:24:40.179366Z",
//       "key": "ii_live_tDMENbh7lnNOqrX7lXDDHBL_ZF9KVyp0kmzA_yqHbuw"
//     }
//   }
// }
