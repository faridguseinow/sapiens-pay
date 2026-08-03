export type LocaleCode = "az" | "ru" | "en";
export type PostStatus = "draft" | "published" | "scheduled" | "archived";
export type LeadStatus = "new" | "contacted" | "qualified" | "won" | "closed";
export type TaskStatus = "todo" | "in_progress" | "done";
export type TaskPriority = "low" | "medium" | "high";
export type UserRole = "admin" | "sales";
export type SalesCustomerStatus =
  | "new"
  | "contacted"
  | "interested"
  | "proposal"
  | "won"
  | "lost";

export type BlogPost = {
  id: string;
  translation_group_id: string;
  locale: LocaleCode;
  title: string;
  subtitle: string | null;
  slug: string;
  excerpt: string | null;
  content: string;
  cover_image_url: string | null;
  featured_image_alt: string | null;
  seo_title: string | null;
  seo_description: string | null;
  category: string | null;
  tags: string[];
  author: string | null;
  is_featured: boolean;
  focus_keyword: string | null;
  secondary_keywords: string[];
  canonical_url: string | null;
  og_title: string | null;
  og_description: string | null;
  og_image_url: string | null;
  robots_index: boolean;
  include_in_sitemap: boolean;
  scheduled_at: string | null;
  status: PostStatus;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type LeadAnswer = {
  question: string;
  answer: string;
};

export type LeadProfile = {
  serviceKey?: string;
  service?: string;
  package?: string;
  businessStatus?: string;
  timeline?: string;
  details?: string;
  email?: string;
  sourcePath?: string;
  sourceLabel?: string;
  priority?: "high" | "medium" | "low";
  readAt?: string;
  followUpNotifiedAt?: string;
  businessType?: string;
  adBudget?: string;
  commissionAmount?: string;
  growthPlan?: string;
};

export type Lead = {
  id: string;
  name: string;
  phone: string;
  preferred_contact: string | null;
  service_key: string | null;
  service_name: string | null;
  package_name: string | null;
  source_path: string | null;
  source_label: string | null;
  estimated_loss: number;
  locale: LocaleCode;
  profile: LeadProfile;
  answers: LeadAnswer[];
  status: LeadStatus;
  notes: string | null;
  next_follow_up_at: string | null;
  submitted_at: string;
  updated_at: string;
};

export type TeamMember = {
  id: string;
  auth_user_id: string | null;
  name: string;
  email: string | null;
  role: UserRole;
  is_active: boolean;
  created_at: string;
};

export type AdminTask = {
  id: string;
  title: string;
  description: string | null;
  assignee_id: string;
  status: TaskStatus;
  priority: TaskPriority;
  deadline: string;
  seen_at: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
  assignee?: TeamMember | null;
};

export type TaskUpdate = {
  id: string;
  task_id: string;
  author: string;
  note: string;
  from_status: TaskStatus | null;
  to_status: TaskStatus | null;
  created_at: string;
};

export type SalesCustomer = {
  id: string;
  representative_id: string;
  name: string;
  phone: string;
  email: string | null;
  service_key: string;
  status: SalesCustomerStatus;
  potential_value: number;
  notes: string | null;
  next_contact_at: string | null;
  created_at: string;
  updated_at: string;
  representative?: TeamMember | null;
};
