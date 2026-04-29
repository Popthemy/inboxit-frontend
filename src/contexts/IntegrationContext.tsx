import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { integrationService } from "@/services/integrationService";
import { apikeyService } from "@/services/apikeyService";
import { dateFormat } from "@/lib/utils";
import { toRoutePayload } from "@/services/integrations/utils";
import { ApiKey, RawApiKey,RouteIntegration } from "@/services/integrations/type";


const normalizeApiKey = (key?: RawApiKey): ApiKey | undefined => {
  if (!key) return undefined;

  const status: "active" | "inactive" =
    key.isActive && !key.isRevoked ? "active" : "inactive";

  return {
    id: key.id ?? (key.uid ? String(key.uid) : ""),
    prefix: key.prefix ?? "",
    lastUsed: key.lastUsedAt
      ? dateFormat(key.lastUsedAt)
      : "Never",
    full: key.key,
    isActive: status,
    env: key.envChoice ?? "test",
    usageCount: key.usageCount ?? 0,
    createdAt: key.createdAt
      ? dateFormat(key.createdAt)
      : "",
  };
};

function normalizeRouteIntegration(route: any): RouteIntegration {
  const id = route.id ?? String(route.uid);

  let recipientEmails: string[] = [];
  if (route.config?.recipientEmails?.length) {
    recipientEmails = route.config.recipientEmails;
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
    label: route.label || "Untitled",
    channel: route.channel,

    status: status,

    config: { recipientEmails },

    liveKey: normalizeApiKey(route.apiKeys?.live ),
    testKey: normalizeApiKey(route.apiKeys?.test),
    messageCount:
      route.apiKeys?.test?.usageCount + route.apiKeys?.live?.usageCount || 0,
    createdAt: new Date(route.createdAt).toLocaleDateString("en-US",{"day":"numeric","month":"long", "year":"numeric"}),
    deletedAt: route.deletedAt,
  };
}

type IntegrationContextType = {
  routes: RouteIntegration[];
  setRoutes: React.Dispatch<React.SetStateAction<RouteIntegration[]>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;

  fetchIntegrations: () => Promise<void>;
  createIntegration: (input: {
    label: string;
    channel: string;
    recipientEmails?: string;
    phoneNumbers?: string;
    webhookUrls?: string;
  }) => Promise<RouteIntegration>;

  updateIntegration: (
    id: string,
    updates: Partial<{
      label?: string;
      channel?: string;
      recipientEmails?: string;
      phoneNumbers?: string;
      webhookUrls?: string;
      isActive?: boolean;
    }>,
  ) => Promise<void>;

  deleteIntegration: (id: string) => Promise<void>;
  getIntegration: (id: string) => Promise<RouteIntegration>;
  regenerateApiKey: (id: string, env: string) => Promise<ApiKey>;
};

const IntegrationContext = createContext<IntegrationContextType | null>(null);

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
      console.log(result)
      setRoutes(result)

    } finally {
      setLoading(false);
    }
  };

  // ✅ CREATE
  const createIntegration = async (input: {
    label: string;
    channel: string;
    recipientEmails?: string;
    phoneNumbers?: string;
    webhookUrls?: string;
  }) => {
    const payload = toRoutePayload(input);
    // console.log( `updates: ${JSON.stringify(input)}`);
    // console.log(`payload: ${JSON.stringify(payload)}`);
    try{
      setLoading(true);

      const res = await integrationService.create(payload);
      const integration = normalizeRouteIntegration(res);
      setRoutes((prev) => [integration, ...prev]);
      return integration ;
    } catch (error){
      
      throw new Error(error)

    } finally {
      setLoading(false);
    }
    // console.log(`createIntegration: ${JSON.stringify(integration)}`);

    //testKey: { prefix: "ib_test_", full: testFull, lastUsed: "Never" },
    // liveKey: { prefix: "ib_live_", full: liveFull, lastUsed: "Never" },
    //{ testKey: testFull, liveKey: liveFull }
  };

  // ✅ UPDATE (PATCH)
  const updateIntegration = async (
    id: string,
    updates: Partial<{
      label?: string;
      channel?: string;
      recipientEmails?: string;
      phoneNumbers?:string;
      webhookUrls?:string;
      isActive?: boolean;
    }>,
  ) => {
    const payload = toRoutePayload({
      label: updates.label,
      channel: updates.channel, // or keep existing
      
      // build config
      recipientEmails: updates.recipientEmails ,
      phoneNumbers:updates.phoneNumbers,
      webhookUrls:updates.webhookUrls,

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


  const regenerateApiKey = async (id:string,env : string):Promise<ApiKey> =>{
    console.log("api key id:", id)
    if (loading) return
    setLoading(true)
    try{
      
      const res = await apikeyService.regenerate(id);
      const updatedApikey = normalizeApiKey(res.data?.[env]);
  
      setRoutes((prev) =>
        prev.map((r) => {
          const keyField =
            env === "live" ? "liveKey" : env === "test" ? "testKey" : null;
          if (!keyField) return r;
          const existingKey = r[keyField];
          if (!existingKey || existingKey.id !== id) return r
          return {
            ...r,
            [keyField]: updatedApikey,
          };
        }),
      );
      return updatedApikey;
    } catch (error){
      throw new Error(error)

    } finally {
      setLoading(false)
    }

  }

  useEffect(() => {
    fetchIntegrations();
  }, []);

  return {
    routes,
    setRoutes,
    setLoading,
    loading,

    fetchIntegrations,
    createIntegration,
    updateIntegration,
    deleteIntegration,
    getIntegration,
    regenerateApiKey,
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
