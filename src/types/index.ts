/**
 * CloudForge — Core Domain Types
 * ------------------------------------------------------------------
 * Single source of truth for shared domain types. Self-contained:
 * no external dependencies, safe on Linux/Vercel builds (case-exact).
 */

/** Supported UI languages (14 languages, RTL-aware). */
export type Language =
  | 'en'
  | 'ar'
  | 'es'
  | 'fr'
  | 'de'
  | 'zh'
  | 'ja'
  | 'hi'
  | 'ru'
  | 'tr'
  | 'pt'
  | 'it'
  | 'ko'
  | 'nl';

/** Main application views (SPA-style routing inside the App shell). */
export type ViewMode =
  | 'landing'
  | 'dashboard'
  | 'workspace'
  | 'preview'
  | 'code'
  | 'chat'
  | 'pricing'
  | 'about'
  | 'contact'
  | 'support'
  | 'support-sales'
  | 'support-billing'
  | 'support-tech'
  | 'support-executive'
  | 'community'
  | 'changelog'
  | 'privacy'
  | 'academy'
  | 'marketplace'
  | 'cloudforge';

/** AI generation engine identifiers. */
export type AIModel =
  | 'cv-neural-v5'
  | 'gemini-2.5-pro'
  | 'gpt-4o'
  | 'claude-3-7-sonnet';

/** A single file inside a generated project / workspace. */
export interface ProjectFile {
  path: string;
  content: string;
  language?: string;
}

/** A CloudForge project (AI-generated or user-created). */
export interface Project {
  id: string;
  name: string;
  description?: string;
  language: Language;
  createdAt: string;
  updatedAt: string;
  isRTL?: boolean;
  files: ProjectFile[];
  modelUsed?: AIModel;
}

/** Marketplace template entry. */
export interface TemplateItem {
  id: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  category: 'saas' | 'ecommerce' | 'dashboard' | 'ai' | 'landing';
  badge: string;
  image: string;
  files: ProjectFile[];
}

/** Support ticket data (used by DepartmentalSupportPortal). */
export interface TicketData {
  id: string;
  magicKey?: string;
  department: string;
  subject: string;
  message: string;
  senderName?: string;
  senderEmail?: string;
  status?: 'open' | 'in_progress' | 'resolved';
  createdAt?: string;
  replies?: { author: string; content: string; createdAt: string }[];
}

export interface TicketAttachment {
  name: string;
  size: number;
  type: string;
  dataUrl?: string;
}

/** Academic certificate record. */
export interface CertificateRecord {
  certificateId: string;
  studentName: string;
  courseId: string;
  courseTitle: string;
  score: number;
  issueDate: string;
  verificationUrl: string;
}

/** Auth / session user (local mirror of the Supabase profile). */
export interface PlatformUser {
  id: string;
  email: string;
  name: string;
  role: 'super_admin' | 'admin' | 'enterprise' | 'developer' | 'free_user';
  avatarUrl?: string;
  verified: boolean;
}

/* ------------------------------------------------------------------ */
/*  UI / Workspace domain types (used across components)               */
/* ------------------------------------------------------------------ */

/** AI chat assistant message. */
export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai' | 'agent';
  text: string;
  timestamp: string;
}

/** Deployment pipeline log entry / result. */
export interface DeploymentLog {
  success?: boolean;
  id?: string;
  deploymentId?: string;
  deploymentUrl: string;
  status?: string;
  logs: string[];
  createdAt?: string;
  deployedAt?: string;
  cdnStatus?: string;
  sslStatus?: string;
  error?: string;
}

/** Interactive terminal log line. */
export interface TerminalLog {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'cmd';
  text: string;
  timestamp?: string;
}

/** LiveCanvas responsive preview device. */
export type DeviceMode = 'desktop' | 'tablet' | 'mobile';

/** PromptEngine theme accents. */
export type AccentColor = 'cyan' | 'emerald' | 'violet' | 'amber';

/** PromptEngine typography choices. */
export type FontChoice = 'cairo' | 'tajawal' | 'readex' | 'jakarta';

/** CloudForgeEngine schema builder types. */
export interface SchemaField {
  id: string;
  name: string;
  type:
    | 'string'
    | 'text'
    | 'number'
    | 'boolean'
    | 'date'
    | 'uuid'
    | 'timestamp'
    | 'json'
    | 'relation';
  required?: boolean;
  unique?: boolean;
  defaultValue?: string;
  relationTo?: string;
  relationTarget?: string;
}

export interface SchemaEntity {
  id: string;
  name: string;
  tableName?: string;
  description?: string;
  fields: SchemaField[];
}

export interface CloudForgeSchema {
  projectName?: string;
  version?: string;
  rlsEnabled?: boolean;
  entities: SchemaEntity[];
}

export interface CloudForgeDeployment {
  id: string;
  status: 'building' | 'deployed' | 'failed' | 'success';
  url?: string;
  projectId?: string;
  projectTitle?: string;
  deploymentUrl?: string;
  createdAt: string;
  logs?: string | string[];
}

/** Legacy certificate payload used by CertificateModal. */
export interface Certificate {
  certificateId: string;
  studentName: string;
  courseTitle: string;
  score: number;
  issueDate: string;
  verificationUrl: string;
}
