
interface Config  {
  recipientEmails?: string[];
  phoneNumbers?: string[];
  webhookUrls?: string[];
};

const buildConfig = (input: RouteIntegrationPayload): Config => {
    switch (input.channel) {
      case "email":
        return {
          recipientEmails: input.recipientEmails
            .split("\n")
            .map((e) => e.trim())
            .filter(Boolean),
        };
      case "whatsapp":
        return { phoneNumbers: [input.phoneNumbers.trim()] };
      case "slack":
        return { webhookUrls: [input.webhookUrls.trim()] };
      default:
        return {};
    }
  };


interface RouteIntegrationPayload {
  label?: string;
  channel?: string;
  isActive?: boolean;
  recipientEmails?: string;
  phoneNumbers?: string;
  webhookUrls?: string;
}

/**
 *
 * @param input payload to upload the value that change
 * @returns valid pattern suitable for backend
 */
export function toRoutePayload(input: RouteIntegrationPayload) {
  const payload = {
    label: input.label,
    channel: input.channel,
    isActive: input.isActive,
    // config: {
    //   recipientEmails: input.recipientEmails ?? [],
    // },
    ...(input.recipientEmails !== undefined  || input.phoneNumbers !== undefined || input.webhookUrls !== undefined
      ? { config:buildConfig(input) }
      : {}),
  };

  return payload;
}

/**
 * 
 * @param input string of emails
 * @returns Object valid, invalid, emails list
 */
export const validateEmails = (input: string) => {
  const list = input
    .split("\n")
    .map((e) => e.trim())
    .filter(Boolean);

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const invalid = list.filter((email) => !isValidEmail(email));

  return {
    valid: invalid.length === 0,
    invalidEmails: invalid,
    emails: list,
  };
};
