export interface AdminUser {
  id: string;
  userName?: string;
  username?: string;
  roles?: string[];
  role?: string;
  sentimentAnalysis?: boolean;
  [key: string]: unknown;
}

export interface CreateAdminUserInput {
  userName: string;
  password: string;
}
