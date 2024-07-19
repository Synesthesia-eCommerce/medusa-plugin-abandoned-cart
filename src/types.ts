/* eslint-disable @typescript-eslint/no-unused-vars */
import { LineItem } from "@medusajs/medusa";

export interface BasePluginOptions {
  /* enable sendgrid */
  sendgridEnabled: boolean;
  /* email from which you will be sending */
  from: { name?: string; email: string } | string;
  /* template id from sendgrid */
  templateId: string;
  /* header line of the email optional */
  header?: string;
  /* number of days to track */
  days_to_track?: number;
  /* subject of the email optional */
  subject?: string;
  localization?: {
    [key: string]: {
      subject?: string;
      header?: string;
      templateId: string;
    };
  };
}

export interface IntervalOptions {
  /* interval example string "1d", "1h", "30m" 
  check parse-duration package for more examples */
  interval: string | number;
  /* subject of the email optional */
  subject?: string;
  header?: string;
  /* template id from sendgrid */
  templateId?: string;
  localization?: {
    [key: string]: {
      subject?: string;
      header?: string;
      templateId: string;
    };
  };
}

export interface AutomatedAbandonedCart extends BasePluginOptions {
  /* intervals */
  intervals: Array<IntervalOptions>;
  /* max overdue @default "2h"*/
  max_overdue: string;
  /* set as completed if overdue */
  set_as_completed_if_overdue: boolean;
}

export interface ManualAbandonedCart extends BasePluginOptions {
  localization: {
    [key: string]: {
      subject?: string;
      header?: string;
      templateId: string;
    };
  };
}

export type PluginOptions = AutomatedAbandonedCart | ManualAbandonedCart;

export type NewLineItem = Omit<
  LineItem,
  "beforeUpdate" | "afterUpdateOrLoad"
> & {
  price: string;
};

export interface TransformedCart {
  id: string;
  email: string;
  items: NewLineItem[];
  cart_context: Record<string, unknown>;
  first_name: string;
  last_name: string;
  totalPrice: number;
  created_at: Date;
  currency: string;
  region: string;
  country_code: string;
  region_name: string;
  abandoned_count?: number;
  abandoned_lastdate?: Date;
  abandoned_last_interval?: number;
  abandoned_completed_at?: Date;
  subject?: string;
  header?: string;
}

export type MailchimpPluginOptions = {
  newsletter_list_id: string;
  api_key: string;
  server: string;
};

type MergeFields = {
  [key: string]: unknown; // Adjust as needed, e.g., { FNAME: string; LNAME: string; }
};

type Interests = {
  [interestId: string]: boolean;
};

type MarketingPermissions = {
  marketing_permission_id: string;
  enabled: boolean;
};

export interface AddOrUpdateListMemberPayload {
  email_address: string;
  status_if_new?:
    | "subscribed"
    | "unsubscribed"
    | "cleaned"
    | "pending"
    | "transactional";
  email_type?: "html" | "text";
  status?:
    | "subscribed"
    | "unsubscribed"
    | "cleaned"
    | "pending"
    | "transactional";
  merge_fields?: MergeFields;
  interests?: Interests;
  language?: string;
  vip?: boolean;
  location?: {
    latitude: number;
    longitude: number;
  };
  marketing_permissions?: MarketingPermissions[];
  ip_signup?: string;
  timestamp_signup?: string;
  ip_opt?: string;
  timestamp_opt?: string;
}

interface Tag {
  name: string;
  status: "active" | "inactive";
}

interface AddOrRemoveMemberTagsPayload {
  tags: Tag[];
}

interface EcommerceData {
  total_revenue: number;
  number_of_orders: number;
  currency_code: string;
}

interface Stats {
  avg_open_rate: number;
  avg_click_rate: number;
  ecommerce_data: EcommerceData;
}

interface Location {
  latitude: number;
  longitude: number;
  gmtoff: number;
  dstoff: number;
  country_code: string;
  timezone: string;
  region: string;
}

interface MarketingPermission {
  marketing_permission_id: string;
  text: string;
  enabled: boolean;
}

interface LastNote {
  note_id: number;
  created_at: string;
  created_by: string;
  note: string;
}

interface Tag {
  id: number;
  name: string;
}

interface Link {
  rel: string;
  href: string;
  method: string;
  targetSchema: string;
  schema: string;
}

export interface AddOrUpdateListMemberResponse {
  id: string;
  email_address: string;
  unique_email_id: string;
  contact_id: string;
  full_name: string;
  web_id: number;
  email_type: string;
  status:
    | "subscribed"
    | "unsubscribed"
    | "cleaned"
    | "pending"
    | "transactional";
  unsubscribe_reason: string;
  consents_to_one_to_one_messaging: boolean;
  merge_fields: MergeFields;
  interests: Interests;
  stats: Stats;
  ip_signup: string;
  timestamp_signup: string;
  ip_opt: string;
  timestamp_opt: string;
  member_rating: number;
  last_changed: string;
  language: string;
  vip: boolean;
  email_client: string;
  location: Location;
  marketing_permissions: MarketingPermission[];
  last_note: LastNote;
  source: string;
  tags_count: number;
  tags: Tag[];
  list_id: string;
  _links: Link[];
}
