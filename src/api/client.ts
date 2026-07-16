/**
 * Centralized API Client for Approval Flow AI
 * All REST API calls to the Java Spring Boot backend go through here.
 */

const API_BASE = "/api";

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE}${endpoint}`;

  const defaultHeaders: Record<string, string> = {
    "Content-Type": "application/json",
  };

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...(options.headers || {}),
    },
  });

  // Handle non-JSON responses
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    const data = await response.json();
    if (!response.ok) {
      throw new ApiError(response.status, data.error || "Request failed");
    }
    return data as T;
  }

  if (!response.ok) {
    throw new ApiError(response.status, "Request failed");
  }

  return {} as T;
}

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}

// ==========================================
// AUTH APIs
// ==========================================

export const authApi = {
  login: (username: string, password: string) =>
    request<{ success: boolean; username?: string; role?: string; error?: string }>(
      "/auth/login",
      {
        method: "POST",
        body: JSON.stringify({ username, password }),
      }
    ),

  register: (username: string, password: string, role: string) =>
    request<{ success: boolean; message?: string; error?: string }>(
      "/auth/register",
      {
        method: "POST",
        body: JSON.stringify({ username, password, role }),
      }
    ),
};

// ==========================================
// REQUEST APIs
// ==========================================

export interface ApprovalRequestData {
  id: number;
  requestId: string;
  title: string;
  requester: string;
  department: string;
  category: string;
  amount: string;
  description: string;
  isEmergency: boolean;
  status: string;
  date: string;
  pendingWith: string;
}

export const requestsApi = {
  getAll: (status?: string) =>
    request<ApprovalRequestData[]>(
      `/requests${status ? `?status=${encodeURIComponent(status)}` : ""}`
    ),

  create: (data: {
    title: string;
    requester: string;
    department: string;
    category: string;
    amount: string;
    description: string;
    isEmergency: boolean;
  }) =>
    request<ApprovalRequestData>("/requests", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getPending: (role: string) =>
    request<ApprovalRequestData[]>(
      `/requests/pending?role=${encodeURIComponent(role)}`
    ),

  approve: (requestId: string) =>
    request<{ success: boolean; message: string }>(
      `/requests/${encodeURIComponent(requestId)}/approve`,
      { method: "PUT" }
    ),

  reject: (requestId: string) =>
    request<{ success: boolean; message: string }>(
      `/requests/${encodeURIComponent(requestId)}/reject`,
      { method: "PUT" }
    ),
};

// ==========================================
// DASHBOARD APIs
// ==========================================

export interface DashboardStats {
  pending: number;
  approved: number;
  rejected: number;
  total: number;
}

export interface ChartDataItem {
  name: string;
  approved: number;
  rejected: number;
  pending: number;
}

export interface DepartmentDataItem {
  name: string;
  value: number;
  color: string;
}

export const dashboardApi = {
  getStats: () => request<DashboardStats>("/dashboard/stats"),

  getChartData: () => request<ChartDataItem[]>("/dashboard/chart-data"),

  getDepartmentData: () =>
    request<DepartmentDataItem[]>("/dashboard/department-data"),
};

// ==========================================
// WORKFLOW APIs
// ==========================================

export interface WorkflowStepData {
  id?: number;
  role: string;
  timeout: number;
  stepOrder: number;
}

export interface WorkflowRuleData {
  id: number;
  title: string;
  type: string;
  description: string;
  color: string;
  icon: string;
  steps: WorkflowStepData[];
}

export const workflowsApi = {
  getAll: () => request<WorkflowRuleData[]>("/workflows"),

  update: (id: number, steps: { role: string; timeout: number }[]) =>
    request<WorkflowRuleData>(`/workflows/${id}`, {
      method: "PUT",
      body: JSON.stringify({ steps }),
    }),
};

// ==========================================
// USER MANAGEMENT APIs
// ==========================================

export interface PendingUser {
  id: number;
  username: string;
  role: string;
  status: string;
  createdDate: string;
}

export const usersApi = {
  getPending: () => request<PendingUser[]>("/users/pending"),

  approve: (username: string) =>
    request<{ success: boolean; message: string }>(
      `/users/${encodeURIComponent(username)}/approve`,
      { method: "PUT" }
    ),

  reject: (username: string) =>
    request<{ success: boolean; message: string }>(
      `/users/${encodeURIComponent(username)}/reject`,
      { method: "PUT" }
    ),
};
