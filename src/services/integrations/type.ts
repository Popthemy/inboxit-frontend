

type Status = "active" | "inactive" | "archived" | "deleted";

export type ChannelType = "email" | "whatsapp" | "slack";



export interface ApiKey {
  id: string | number;
  prefix: string;
  lastUsed: string;
  full?: string;
  isActive: Status;
  env: "live" | "test";
  usageCount: number;
  createdAt: string;
}


export interface RawApiKey {
  id?: number;
  uid?: string;
  keyHash?: string;
  prefix?: string;
  isActive?: boolean;
  envChoice?: "live" | "test";
  isRevoked?: boolean;
  revokedAt?: string | null;
  route?: number;
  lastUsedAt?: string | null;
  usageCount?: number;
  createdAt?: string;
  key?: string; // only on create
}

export interface RouteIntegration {
  id: string;
  label: string;
  channel: string;
  status:Status;
  config: {
    recipientEmails: string[];
  };
  liveKey?: ApiKey;
  testKey?:ApiKey;
  messageCount: number;
  createdAt: string;
  deletedAt?: string;
}
