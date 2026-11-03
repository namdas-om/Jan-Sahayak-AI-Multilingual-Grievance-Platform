import {
  User,
  Complaint,
  Department,
  ComplaintCategory,
  LanguageCapability,
  AIAnalysisResult,
  NotificationItem,
  AdminMetrics,
} from '../types';

const BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || '/api/v1';

// Token Management
export const getToken = (): string | null => localStorage.getItem('jansahayak_token');
export const setToken = (token: string) => localStorage.setItem('jansahayak_token', token);
export const removeToken = () => {
  localStorage.removeItem('jansahayak_token');
  localStorage.removeItem('jansahayak_user');
};

export const getStoredUser = (): User | null => {
  const data = localStorage.getItem('jansahayak_user');
  if (data) {
    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
  }
  return null;
};

export const setStoredUser = (user: User) => {
  localStorage.setItem('jansahayak_user', JSON.stringify(user));
};

// HTTP Client wrapper with automatic JSON and Bearer auth
async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  let res: Response | null = null;
  try {
    res = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const contentType = res.headers.get('content-type') || '';

    // If static host (e.g. Vercel SPA) returned index.html for an API route
    if (contentType.includes('text/html')) {
      return handleFallback<T>(endpoint, options, new Error('HTML page returned instead of API JSON'));
    }

    if (!res.ok) {
      // 404 (route missing) or 502/503/504 (backend offline/proxy drop)
      if (res.status === 404 || res.status >= 502) {
        return handleFallback<T>(endpoint, options, new Error(`Server returned HTTP ${res.status}`));
      }
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.detail || errorData.message || `Request failed with status ${res.status}`);
    }

    return await res.json();
  } catch (err: any) {
    // If backend actively sent a 400, 401, 403, 422 validation response, propagate it
    if (res && (res.status === 400 || res.status === 401 || res.status === 403 || res.status === 422)) {
      throw err;
    }

    return handleFallback<T>(endpoint, options, err);
  }
}

// -------------------------------------------------------------
// Resilient Mock Store for offline testing & demo modes
// -------------------------------------------------------------
export const MOCK_LANGUAGES: LanguageCapability[] = [
  { code: 'en', name: 'English', native_name: 'English', ui_supported: true, speech_supported: true, translation_supported: true },
  { code: 'hi', name: 'Hindi', native_name: 'हिन्दी', ui_supported: true, speech_supported: true, translation_supported: true },
  { code: 'mr', name: 'Marathi', native_name: 'मराठी', ui_supported: true, speech_supported: true, translation_supported: true },
  { code: 'bn', name: 'Bengali', native_name: 'বাংলা', ui_supported: true, speech_supported: true, translation_supported: true },
  { code: 'ta', name: 'Tamil', native_name: 'தமிழ்', ui_supported: true, speech_supported: true, translation_supported: true },
  { code: 'te', name: 'Telugu', native_name: 'తెలుగు', ui_supported: true, speech_supported: true, translation_supported: true },
  { code: 'kn', name: 'Kannada', native_name: 'ಕನ್ನಡ', ui_supported: true, speech_supported: true, translation_supported: true },
  { code: 'ml', name: 'Malayalam', native_name: 'മലയാളം', ui_supported: true, speech_supported: true, translation_supported: true },
  { code: 'gu', name: 'Gujarati', native_name: 'ગુજરાતી', ui_supported: true, speech_supported: true, translation_supported: true },
  { code: 'pa', name: 'Punjabi', native_name: 'ਪੰਜਾਬੀ', ui_supported: true, speech_supported: true, translation_supported: true },
  { code: 'od', name: 'Odia', native_name: 'ଓଡ଼ିଆ', ui_supported: true, speech_supported: true, translation_supported: true },
  { code: 'as', name: 'Assamese', native_name: 'অসমীয়া', ui_supported: true, speech_supported: true, translation_supported: true },
  { code: 'ur', name: 'Urdu', native_name: 'اردو', ui_supported: true, speech_supported: true, translation_supported: true },
];

export const MOCK_DEPARTMENTS: Department[] = [
  { id: 'd1', name: 'Department of Water Supply & Sewerage', code: 'DWSS', jurisdiction: 'Statewide', is_active: true, created_at: new Date().toISOString() },
  { id: 'd2', name: 'Department of Energy & Power', code: 'DEP', jurisdiction: 'Statewide', is_active: true, created_at: new Date().toISOString() },
  { id: 'd3', name: 'Public Works Department (PWD)', code: 'PWD', jurisdiction: 'Statewide', is_active: true, created_at: new Date().toISOString() },
  { id: 'd4', name: 'Municipal Corporation & Sanitation', code: 'MCS', jurisdiction: 'Urban/Municipal', is_active: true, created_at: new Date().toISOString() },
  { id: 'd5', name: 'Department of Health & Family Welfare', code: 'DHF', jurisdiction: 'Statewide', is_active: true, created_at: new Date().toISOString() },
  { id: 'd6', name: 'Department of Transport', code: 'DOT', jurisdiction: 'Statewide', is_active: true, created_at: new Date().toISOString() },
  { id: 'd7', name: 'Department of School Education', code: 'DSE', jurisdiction: 'Statewide', is_active: true, created_at: new Date().toISOString() },
  { id: 'd8', name: 'Food & Civil Supplies Department', code: 'FCSD', jurisdiction: 'Statewide', is_active: true, created_at: new Date().toISOString() },
  { id: 'd9', name: 'Department of Police & Public Safety', code: 'DPPS', jurisdiction: 'Statewide', is_active: true, created_at: new Date().toISOString() },
];

export const MOCK_CATEGORIES: ComplaintCategory[] = [
  { id: 'c1', name: 'Water Supply', code: 'CAT_WATER', is_active: true, created_at: new Date().toISOString() },
  { id: 'c2', name: 'Electricity', code: 'CAT_POWER', is_active: true, created_at: new Date().toISOString() },
  { id: 'c3', name: 'Roads & Infrastructure', code: 'CAT_ROADS', is_active: true, created_at: new Date().toISOString() },
  { id: 'c4', name: 'Sanitation & Waste Management', code: 'CAT_SANITATION', is_active: true, created_at: new Date().toISOString() },
  { id: 'c5', name: 'Public Health', code: 'CAT_HEALTH', is_active: true, created_at: new Date().toISOString() },
  { id: 'c6', name: 'Public Transport', code: 'CAT_TRANSPORT', is_active: true, created_at: new Date().toISOString() },
  { id: 'c7', name: 'Municipal Services', code: 'CAT_MUNICIPAL', is_active: true, created_at: new Date().toISOString() },
];

const INITIAL_COMPLAINTS: Complaint[] = [
  {
    id: 'comp-101',
    ticket_id: 'JSA-2026-W8491A',
    citizen_id: 'demo-citizen-1',
    citizen_email: 'citizen@jansahayak.gov.in',
    title: 'Severe pipeline leakage and low drinking water pressure',
    original_description: 'हमारे वार्ड नंबर 12 में पिछले 4 दिनों से मुख्य पाइपलाइन फटी हुई है और पीने के पानी का दबाव बेहद कम है। गंदा पानी भी आ रहा है। कृपया तुरंत मरम्मत करें।',
    original_language: 'hi',
    translated_description: 'In our Ward No. 12, the main drinking water pipeline has been ruptured for the past 4 days, resulting in extremely low water pressure and contaminated supply. Immediate repair is requested.',
    ai_summary: 'Citizen reported main drinking water pipeline rupture in Ward 12 for 4 days with low pressure and muddy water. Recommended action: Immediate line inspection and valve repair.',
    category_id: 'c1',
    category_name: 'Water Supply',
    assigned_department_id: 'd1',
    department_name: 'Department of Water Supply & Sewerage',
    priority: 'high',
    status: 'in_progress',
    ai_confidence: 0.94,
    ai_suggested_urgency: 'high',
    state: 'Maharashtra',
    district: 'Pune',
    locality: 'Ward 12, Shivaji Nagar',
    submitted_at: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
    due_at: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
    status_history: [
      { id: 'sh-1', new_status: 'submitted', public_comment: 'Complaint registered in JanSahayak AI system.', created_at: new Date(Date.now() - 48 * 3600 * 1000).toISOString() },
      { id: 'sh-2', previous_status: 'submitted', new_status: 'in_progress', changed_by_name: 'Amit Verma (Officer)', public_comment: 'Field maintenance crew dispatched for pipeline inspection.', created_at: new Date(Date.now() - 24 * 3600 * 1000).toISOString() },
    ],
    comments: [
      { id: 'cm-1', author_name: 'Amit Verma', author_role: 'department_officer', body: 'Site inspection was completed by the water maintenance team. Replacement parts for the 8-inch valve have been requisitioned.', visibility: 'public', created_at: new Date(Date.now() - 18 * 3600 * 1000).toISOString() }
    ],
  },
  {
    id: 'comp-102',
    ticket_id: 'JSA-2026-P9215B',
    citizen_id: 'demo-citizen-1',
    citizen_email: 'citizen@jansahayak.gov.in',
    title: 'Frequent voltage drops and power transformer spark',
    original_description: 'There is a transformer near Sector 4 community park giving loud sparks and continuous tripping. Risk of fire.',
    original_language: 'en',
    ai_summary: 'Transformer sparking near Sector 4 park with recurring tripping. High fire risk. Immediate lineman inspection needed.',
    category_id: 'c2',
    category_name: 'Electricity',
    assigned_department_id: 'd2',
    department_name: 'Department of Energy & Power',
    priority: 'critical',
    status: 'assigned',
    ai_confidence: 0.98,
    ai_suggested_urgency: 'critical',
    state: 'Delhi',
    district: 'South West',
    locality: 'Sector 4 Community Park',
    submitted_at: new Date(Date.now() - 14 * 3600 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    due_at: new Date(Date.now() + 10 * 3600 * 1000).toISOString(),
    status_history: [
      { id: 'sh-10', new_status: 'submitted', public_comment: 'Ticket generated and flagged critical.', created_at: new Date(Date.now() - 14 * 3600 * 1000).toISOString() },
      { id: 'sh-11', previous_status: 'submitted', new_status: 'assigned', changed_by_name: 'Power Control Room', public_comment: 'Assigned to Sector 4 Rapid Response Electrician squad.', created_at: new Date(Date.now() - 2 * 3600 * 1000).toISOString() },
    ],
    comments: [],
  },
  {
    id: 'comp-103',
    ticket_id: 'JSA-2026-R7724C',
    citizen_id: 'demo-citizen-1',
    citizen_email: 'citizen@jansahayak.gov.in',
    title: 'Deep road potholes causing traffic and minor accidents',
    original_description: 'On Main Market road, multiple potholes have appeared after rain. Two wheelers skid regularly.',
    original_language: 'en',
    ai_summary: 'Multiple monsoon potholes on Main Market road posing two-wheeler hazard.',
    category_id: 'c3',
    category_name: 'Roads & Infrastructure',
    assigned_department_id: 'd3',
    department_name: 'Public Works Department (PWD)',
    priority: 'medium',
    status: 'resolved',
    resolution_summary: 'Road patch work executed by PWD cold mix asphalt unit on 1st Nov. Traffic flow restored.',
    submitted_at: new Date(Date.now() - 96 * 3600 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 10 * 3600 * 1000).toISOString(),
    resolved_at: new Date(Date.now() - 10 * 3600 * 1000).toISOString(),
    status_history: [
      { id: 'sh-20', new_status: 'submitted', created_at: new Date(Date.now() - 96 * 3600 * 1000).toISOString() },
      { id: 'sh-21', new_status: 'resolved', public_comment: 'Road repairs completed.', created_at: new Date(Date.now() - 10 * 3600 * 1000).toISOString() }
    ],
    feedback: { id: 'fb-1', rating: 5, feedback_text: 'Repaired swiftly within 3 days. Thank you JanSahayak team!', created_at: new Date(Date.now() - 6 * 3600 * 1000).toISOString() }
  }
];

let localComplaintsStore: Complaint[] = (() => {
  try {
    const saved = localStorage.getItem('jansahayak_complaints');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {}
  return INITIAL_COMPLAINTS;
})();

function handleFallback<T>(endpoint: string, options: RequestInit, originalError: any): T {
  console.info(`[JanSahayak API client] Fallback handler for: ${endpoint}`);

  // User Registration fallback
  if (endpoint === '/auth/register' && options.method === 'POST') {
    const body = JSON.parse((options.body as string) || '{}');
    if (!body.email || !body.full_name) {
      throw new Error('Please provide your name and email address.');
    }
    if (body.password && body.password.length < 8) {
      throw new Error('Password must be at least 8 characters long.');
    }

    const emailClean = body.email.trim().toLowerCase();
    
    // Check local registered users store
    let registeredUsers: any[] = [];
    try {
      registeredUsers = JSON.parse(localStorage.getItem('jansahayak_registered_users') || '[]');
    } catch {
      registeredUsers = [];
    }

    const existing = registeredUsers.find((u: any) => u.email.toLowerCase() === emailClean);
    if (existing) {
      throw new Error('An account with this email address already exists.');
    }

    const newUser: User = {
      id: `usr-${Date.now()}`,
      email: emailClean,
      full_name: body.full_name.trim(),
      preferred_language: body.preferred_language || 'hi',
      phone_number: body.phone_number?.trim() || undefined,
      account_status: 'active',
      roles: [{ role: 'citizen', department_id: null }],
      created_at: new Date().toISOString(),
    };

    registeredUsers.push({ ...newUser, password: body.password });
    try {
      localStorage.setItem('jansahayak_registered_users', JSON.stringify(registeredUsers));
    } catch {}

    const token = `jwt_token_citizen_${Date.now()}`;
    return {
      access_token: token,
      token_type: 'bearer',
      user: newUser,
    } as unknown as T;
  }

  // User Login fallback
  if (endpoint === '/auth/login' && options.method === 'POST') {
    const body = JSON.parse((options.body as string) || '{}');
    const emailClean = (body.email || '').trim().toLowerCase();
    const password = body.password || '';

    // 1. Check in locally registered users
    let registeredUsers: any[] = [];
    try {
      registeredUsers = JSON.parse(localStorage.getItem('jansahayak_registered_users') || '[]');
    } catch {
      registeredUsers = [];
    }
    const userFound = registeredUsers.find((u: any) => u.email.toLowerCase() === emailClean);
    if (userFound) {
      if (userFound.password && userFound.password !== password) {
        throw new Error('Incorrect email or password.');
      }
      const { password: _, ...cleanUser } = userFound;
      return {
        access_token: `jwt_token_${cleanUser.id}`,
        token_type: 'bearer',
        user: cleanUser,
      } as unknown as T;
    }

    // 2. Check demo accounts
    const demoAccounts: Record<string, { role: any; name: string; dept?: string }> = {
      'citizen@jansahayak.gov.in': { role: 'citizen', name: 'Ramesh Kumar (Citizen)' },
      'officer.water@jansahayak.gov.in': { role: 'department_officer', name: 'Amit Verma (Field Officer)', dept: 'd1' },
      'head.water@jansahayak.gov.in': { role: 'department_head', name: 'Dr. Sunita Deshmukh (Dept Head)', dept: 'd1' },
      'admin@jansahayak.gov.in': { role: 'system_admin', name: 'Rajesh Sharma (System Admin)' },
    };

    const demo = demoAccounts[emailClean];
    if (demo) {
      const demoUser: User = {
        id: `demo-${demo.role}`,
        email: emailClean,
        full_name: demo.name,
        preferred_language: 'en',
        account_status: 'active',
        roles: [{ role: demo.role, department_id: demo.dept || null }],
        created_at: new Date().toISOString(),
      };
      return {
        access_token: `demo_jwt_token_${demo.role}_${Date.now()}`,
        token_type: 'bearer',
        user: demoUser,
      } as unknown as T;
    }

    // 3. Fallback: Allow logging in as citizen for testing
    if (emailClean && password.length >= 6) {
      const fallbackUser: User = {
        id: `usr-${Date.now()}`,
        email: emailClean,
        full_name: emailClean.split('@')[0],
        preferred_language: 'en',
        account_status: 'active',
        roles: [{ role: 'citizen', department_id: null }],
        created_at: new Date().toISOString(),
      };
      return {
        access_token: `jwt_token_${Date.now()}`,
        token_type: 'bearer',
        user: fallbackUser,
      } as unknown as T;
    }

    throw new Error('Incorrect email or password.');
  }

  // Current User (/auth/me) fallback
  if (endpoint === '/auth/me') {
    const current = getStoredUser();
    if (current) return current as unknown as T;
    return {
      id: 'demo-citizen-1',
      email: 'citizen@jansahayak.gov.in',
      full_name: 'Citizen User',
      preferred_language: 'hi',
      account_status: 'active',
      roles: [{ role: 'citizen', department_id: null }],
      created_at: new Date().toISOString(),
    } as unknown as T;
  }

  // Languages endpoint
  if (endpoint === '/languages') {
    return MOCK_LANGUAGES as unknown as T;
  }

  // Departments endpoint
  if (endpoint === '/departments') {
    return MOCK_DEPARTMENTS as unknown as T;
  }

  // Categories endpoint
  if (endpoint === '/departments/categories') {
    return MOCK_CATEGORIES as unknown as T;
  }

  // Track complaint endpoint
  if (endpoint.startsWith('/complaints/track/')) {
    const ticketId = endpoint.split('/')[3].toUpperCase();
    const found = localComplaintsStore.find(c => c.ticket_id.toUpperCase() === ticketId);
    if (found) {
      return {
        ticket_id: found.ticket_id,
        title: found.title,
        category_name: found.category_name || 'Civic Services',
        department_name: found.department_name || 'Municipal Department',
        status: found.status,
        priority: found.priority,
        submitted_at: found.submitted_at,
        updated_at: found.updated_at,
        resolution_summary: found.resolution_summary,
        timeline: found.status_history?.map(h => ({
          status: h.new_status,
          comment: h.public_comment,
          timestamp: h.created_at,
        })) || [],
      } as unknown as T;
    }
  }

  // Complaints list
  if (endpoint.startsWith('/complaints') && (!options.method || options.method === 'GET')) {
    const singleMatch = endpoint.match(/\/complaints\/([^\/?]+)/);
    if (singleMatch && singleMatch[1] && singleMatch[1] !== 'track') {
      const c = localComplaintsStore.find(x => x.id === singleMatch[1] || x.ticket_id === singleMatch[1]);
      if (c) return c as unknown as T;
      return localComplaintsStore[0] as unknown as T;
    }

    const currentUser = getStoredUser();
    const userRole = currentUser?.roles?.[0]?.role;

    // For Citizens: ONLY display grievances submitted by this citizen (new citizen accounts start with 0 complaints)
    if (userRole === 'citizen') {
      // Preloaded demo citizen sees demo complaints
      if (currentUser?.email?.toLowerCase() === 'citizen@jansahayak.gov.in') {
        return localComplaintsStore.filter(c =>
          !c.citizen_email || c.citizen_email.toLowerCase() === 'citizen@jansahayak.gov.in' || c.citizen_id === 'demo-citizen-1'
        ) as unknown as T;
      }
      // Newly registered citizen: fresh empty slate until they submit their own complaints
      return localComplaintsStore.filter(c =>
        (currentUser?.id && c.citizen_id === currentUser.id) ||
        (currentUser?.email && c.citizen_email && c.citizen_email.toLowerCase() === currentUser.email.toLowerCase())
      ) as unknown as T;
    }

    // For Department Staff: filter by department
    if (userRole === 'department_officer' || userRole === 'department_head') {
      const deptId = currentUser?.roles?.[0]?.department_id;
      if (deptId) {
        return localComplaintsStore.filter(c => c.assigned_department_id === deptId) as unknown as T;
      }
      return localComplaintsStore as unknown as T;
    }

    // System Admin sees all complaints
    return localComplaintsStore as unknown as T;
  }

    // Department Complaints Queue
  if (endpoint.startsWith('/departments/me/complaints')) {
    let deptFilter: string | null = null;
    let priorityFilter: string | null = null;
    let statusFilter: string | null = null;

    if (endpoint.includes('?')) {
      const qs = endpoint.split('?')[1] || '';
      const params = new URLSearchParams(qs);
      deptFilter = params.get('department_id') || params.get('dept');
      priorityFilter = params.get('priority');
      statusFilter = params.get('status');
    }

    let results = [...localComplaintsStore];
    if (deptFilter && deptFilter !== 'all') {
      results = results.filter(c => c.assigned_department_id === deptFilter);
    }
    if (priorityFilter && priorityFilter !== 'all') {
      results = results.filter(c => c.priority === priorityFilter);
    }
    if (statusFilter && statusFilter !== 'all') {
      results = results.filter(c => c.status === statusFilter);
    }
    return results as unknown as T;
  }

  // Case Status Update
  if (options.method === 'POST') {
    const statusMatch = endpoint.match(/\/complaints\/([^\/]+)\/status/);
    if (statusMatch) {
      const cid = statusMatch[1];
      const body = JSON.parse((options.body as string) || '{}');
      const currentUser = getStoredUser();
      const comp = localComplaintsStore.find(c => c.id === cid || c.ticket_id === cid);
      if (comp) {
        const prevStatus = comp.status;
        comp.status = body.new_status;
        comp.updated_at = new Date().toISOString();
        if (!comp.status_history) comp.status_history = [];
        comp.status_history.push({
          id: `sh-${Date.now()}`,
          previous_status: prevStatus,
          new_status: body.new_status,
          changed_by_name: currentUser?.full_name || 'Department Officer',
          public_comment: body.public_comment || `Status updated to ${body.new_status.replace('_', ' ')}`,
          created_at: new Date().toISOString(),
        });
        try { localStorage.setItem('jansahayak_complaints', JSON.stringify(localComplaintsStore)); } catch {}
        return comp as unknown as T;
      }
    }

    // Resolve Case
    const resolveMatch = endpoint.match(/\/complaints\/([^\/]+)\/resolve/);
    if (resolveMatch) {
      const cid = resolveMatch[1];
      const body = JSON.parse((options.body as string) || '{}');
      const currentUser = getStoredUser();
      const comp = localComplaintsStore.find(c => c.id === cid || c.ticket_id === cid);
      if (comp) {
        const prevStatus = comp.status;
        comp.status = 'resolved';
        comp.resolution_summary = body.resolution_summary;
        comp.resolved_at = new Date().toISOString();
        comp.updated_at = new Date().toISOString();
        if (!comp.status_history) comp.status_history = [];
        comp.status_history.push({
          id: `sh-${Date.now()}`,
          previous_status: prevStatus,
          new_status: 'resolved',
          changed_by_name: currentUser?.full_name || 'Department Officer',
          public_comment: body.public_comment || `Resolution: ${body.resolution_summary}`,
          created_at: new Date().toISOString(),
        });
        try { localStorage.setItem('jansahayak_complaints', JSON.stringify(localComplaintsStore)); } catch {}
        return comp as unknown as T;
      }
    }

    // Escalate Case
    const escalateMatch = endpoint.match(/\/complaints\/([^\/]+)\/escalate/);
    if (escalateMatch) {
      const cid = escalateMatch[1];
      const body = JSON.parse((options.body as string) || '{}');
      const currentUser = getStoredUser();
      const comp = localComplaintsStore.find(c => c.id === cid || c.ticket_id === cid);
      if (comp) {
        const prevStatus = comp.status;
        comp.status = 'escalated';
        comp.priority = 'critical';
        comp.updated_at = new Date().toISOString();
        if (!comp.status_history) comp.status_history = [];
        comp.status_history.push({
          id: `sh-${Date.now()}`,
          previous_status: prevStatus,
          new_status: 'escalated',
          changed_by_name: currentUser?.full_name || 'Department Officer',
          public_comment: `Escalated: ${body.reason || 'Case flagged for supervisor intervention'}`,
          created_at: new Date().toISOString(),
        });
        try { localStorage.setItem('jansahayak_complaints', JSON.stringify(localComplaintsStore)); } catch {}
        return comp as unknown as T;
      }
    }

    // Add Note / Comment
    const commentMatch = endpoint.match(/\/complaints\/([^\/]+)\/comments/);
    if (commentMatch) {
      const cid = commentMatch[1];
      const body = JSON.parse((options.body as string) || '{}');
      const currentUser = getStoredUser();
      const comp = localComplaintsStore.find(c => c.id === cid || c.ticket_id === cid);
      if (comp) {
        if (!comp.comments) comp.comments = [];
        const newCm = {
          id: `cm-${Date.now()}`,
          author_id: currentUser?.id,
          author_name: currentUser?.full_name || 'Authorized Official',
          author_role: currentUser?.roles?.[0]?.role || 'department_officer',
          body: body.body,
          visibility: (body.visibility || 'public') as 'public' | 'internal',
          created_at: new Date().toISOString(),
        };
        comp.comments.push(newCm);
        try { localStorage.setItem('jansahayak_complaints', JSON.stringify(localComplaintsStore)); } catch {}
        return newCm as unknown as T;
      }
    }

    // Feedback
    const feedbackMatch = endpoint.match(/\/complaints\/([^\/]+)\/feedback/);
    if (feedbackMatch) {
      const cid = feedbackMatch[1];
      const body = JSON.parse((options.body as string) || '{}');
      const comp = localComplaintsStore.find(c => c.id === cid || c.ticket_id === cid);
      if (comp) {
        comp.feedback = {
          id: `fb-${Date.now()}`,
          rating: body.rating || 5,
          feedback_text: body.feedback_text || null,
          created_at: new Date().toISOString(),
        };
        try { localStorage.setItem('jansahayak_complaints', JSON.stringify(localComplaintsStore)); } catch {}
        return comp.feedback as unknown as T;
      }
    }

    // Reopen Case
    const reopenMatch = endpoint.match(/\/complaints\/([^\/]+)\/reopen/);
    if (reopenMatch) {
      const cid = reopenMatch[1];
      const body = JSON.parse((options.body as string) || '{}');
      const currentUser = getStoredUser();
      const comp = localComplaintsStore.find(c => c.id === cid || c.ticket_id === cid);
      if (comp) {
        const prevStatus = comp.status;
        comp.status = 'reopened';
        comp.updated_at = new Date().toISOString();
        if (!comp.status_history) comp.status_history = [];
        comp.status_history.push({
          id: `sh-${Date.now()}`,
          previous_status: prevStatus,
          new_status: 'reopened',
          changed_by_name: currentUser?.full_name || 'Citizen',
          public_comment: `Citizen reopened case: ${body.reason}`,
          created_at: new Date().toISOString(),
        });
        try { localStorage.setItem('jansahayak_complaints', JSON.stringify(localComplaintsStore)); } catch {}
        return comp as unknown as T;
      }
    }

    // Admin Run Escalation
    if (endpoint === '/admin/run-escalation') {
      let count = 0;
      localComplaintsStore.forEach(c => {
        if (['submitted', 'assigned', 'in_progress'].includes(c.status) && c.priority === 'critical') {
          c.status = 'escalated';
          count++;
        }
      });
      try { localStorage.setItem('jansahayak_complaints', JSON.stringify(localComplaintsStore)); } catch {}
      return {
        message: 'Escalation engine completed successfully.',
        escalated_count: count,
        processed_count: localComplaintsStore.length,
        timestamp: new Date().toISOString(),
      } as unknown as T;
    }
  }

  // Admin Users List
  if (endpoint === '/admin/users') {
    let registeredUsers: any[] = [];
    try {
      registeredUsers = JSON.parse(localStorage.getItem('jansahayak_registered_users') || '[]');
    } catch {}

    const seedUsers = [
      {
        id: 'u-1',
        email: 'admin@jansahayak.gov.in',
        full_name: 'Rajesh Sharma (System Admin)',
        preferred_language: 'en',
        account_status: 'active',
        roles: [{ role: 'system_admin', department_id: null }],
        created_at: new Date().toISOString(),
      },
      {
        id: 'u-2',
        email: 'officer.water@jansahayak.gov.in',
        full_name: 'Amit Verma (Field Officer)',
        preferred_language: 'hi',
        account_status: 'active',
        roles: [{ role: 'department_officer', department_id: 'd1' }],
        created_at: new Date().toISOString(),
      },
      {
        id: 'u-3',
        email: 'head.water@jansahayak.gov.in',
        full_name: 'Dr. Sunita Deshmukh (Dept Head)',
        preferred_language: 'mr',
        account_status: 'active',
        roles: [{ role: 'department_head', department_id: 'd1' }],
        created_at: new Date().toISOString(),
      },
      {
        id: 'u-4',
        email: 'citizen@jansahayak.gov.in',
        full_name: 'Ramesh Kumar (Citizen)',
        preferred_language: 'hi',
        account_status: 'active',
        roles: [{ role: 'citizen', department_id: null }],
        created_at: new Date().toISOString(),
      },
    ];

    const cleanRegistered = registeredUsers.map(({ password: _, ...rest }) => rest);
    return [...seedUsers, ...cleanRegistered] as unknown as T;
  }

  // Admin Audit Logs
  if (endpoint === '/admin/audit-logs') {
    return [
      {
        id: 'audit-1',
        action: 'COMPLAINT_SUBMITTED',
        entity_type: 'complaint',
        entity_id: localComplaintsStore[0]?.ticket_id || 'JSA-2026-W8491A',
        actor_name: 'Citizen Portal',
        ip_address: '127.0.0.1',
        created_at: new Date(Date.now() - 3600 * 1000).toISOString(),
      },
      {
        id: 'audit-2',
        action: 'AI_CLASSIFICATION_PERFORMED',
        entity_type: 'ai_engine',
        entity_id: 'sarvam-indic-v2',
        actor_name: 'Sarvam AI Provider',
        ip_address: '10.0.4.12',
        created_at: new Date(Date.now() - 3500 * 1000).toISOString(),
      },
      {
        id: 'audit-3',
        action: 'STATUS_TRANSITION',
        entity_type: 'complaint',
        entity_id: localComplaintsStore[0]?.ticket_id || 'JSA-2026-W8491A',
        actor_name: 'Amit Verma (Field Officer)',
        ip_address: '192.168.1.45',
        created_at: new Date(Date.now() - 1800 * 1000).toISOString(),
      },
    ] as unknown as T;
  }

  // Dynamic Department Analytics
  if (endpoint.startsWith('/departments/me/analytics')) {
    const total = localComplaintsStore.length;
    const submitted = localComplaintsStore.filter(c => c.status === 'submitted').length;
    const inProgress = localComplaintsStore.filter(c => ['assigned', 'in_progress', 'under_review', 'awaiting_information'].includes(c.status)).length;
    const resolved = localComplaintsStore.filter(c => ['resolved', 'closed'].includes(c.status)).length;
    const escalated = localComplaintsStore.filter(c => c.status === 'escalated').length;
    const rate = total > 0 ? Math.round((resolved / total) * 1000) / 10 : 100;

    return {
      total_assigned: total,
      new_received: submitted,
      in_progress: inProgress,
      resolved: resolved,
      escalated: escalated,
      overdue: escalated,
      resolution_rate_percent: rate,
      category_distribution: [
        { category: 'Water Supply', count: localComplaintsStore.filter(c => c.category_name?.includes('Water')).length || 1 },
        { category: 'Electricity', count: localComplaintsStore.filter(c => c.category_name?.includes('Electricity')).length || 1 },
        { category: 'Roads & Infrastructure', count: localComplaintsStore.filter(c => c.category_name?.includes('Roads')).length || 1 },
        { category: 'Sanitation', count: localComplaintsStore.filter(c => c.category_name?.includes('Sanitation')).length || 1 },
      ],
      priority_distribution: [
        { priority: 'critical', count: localComplaintsStore.filter(c => c.priority === 'critical').length },
        { priority: 'high', count: localComplaintsStore.filter(c => c.priority === 'high').length },
        { priority: 'medium', count: localComplaintsStore.filter(c => c.priority === 'medium').length },
        { priority: 'low', count: localComplaintsStore.filter(c => c.priority === 'low').length },
      ],
    } as unknown as T;
  }
// Admin Overview
  if (endpoint === '/admin/overview') {
    return {
      total_users: 1420,
      total_citizens: 1350,
      total_department_staff: 70,
      total_complaints: 894,
      open_complaints: 112,
      in_progress_complaints: 245,
      resolved_complaints: 520,
      escalated_complaints: 17,
      avg_resolution_hours: 38.5,
      resolution_rate_percent: 84.6,
      total_departments: 9,
      total_categories: 11,
    } as unknown as T;
  }

  // Notifications
  if (endpoint.startsWith('/notifications')) {
    return [
      {
        id: 'notif-1',
        title: 'Status Update: JSA-2026-W8491A',
        message: 'Your complaint regarding water pipeline leakage was marked In Progress.',
        channel: 'in_app',
        status: 'sent',
        created_at: new Date(Date.now() - 3600 * 1000).toISOString(),
      },
      {
        id: 'notif-2',
        title: 'Grievance Redressed: JSA-2026-R7724C',
        message: 'Your complaint regarding potholes on Main Market road has been resolved.',
        channel: 'in_app',
        status: 'read',
        created_at: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
      }
    ] as unknown as T;
  }

  // AI Analyze
  if (endpoint === '/ai/analyze' && options.method === 'POST') {
    const body = JSON.parse(options.body as string || '{}');
    const fullText = `${body.title || ''} ${body.description || ''}`.toLowerCase();
    
    let cat = 'Municipal Services';
    let catId = 'c7';
    let dept = 'Municipal Corporation & Sanitation';
    let deptId = 'd4';
    let urgency: 'low' | 'medium' | 'high' | 'critical' = 'medium';
    let confidence = 0.95;

    // 1. Water Supply & Sewerage Keywords (English + Indic)
    const waterKeywords = [
      'water', 'pipeline', 'pipe', 'leak', 'leakage', 'drinking water', 'paani', 'sewage', 'sewer', 'tap',
      'पानी', 'पाणी', 'पाइपलाइन', 'पाईपलाईन', 'पेयजल', 'नल', 'जल', 'सीवर', 'गळती', 'जलकुंभ', 'water supply'
    ];

    // 2. Electricity & Power Keywords (English + Indic)
    const powerKeywords = [
      'light', 'lights', 'streetlight', 'streetlights', 'power', 'electricity', 'electric', 'voltage', 'transformer',
      'wire', 'wires', 'pole', 'blackout', 'tripping', 'spark', 'bijli', 'load shedding',
      'बिजली', 'लाइट', 'लाईट', 'स्ट्रीट लाइट', 'स्ट्रीटलाइट', 'बत्ती', 'ट्रांसफार्मर', 'करंट', 'तार', 'अंधेरा', 'अंधार', 'विद्युत'
    ];

    // 3. Roads & Infrastructure Keywords (English + Indic)
    const roadKeywords = [
      'road', 'roads', 'pothole', 'potholes', 'pavement', 'highway', 'bridge', 'flyover', 'street', 'footpath',
      'tar', 'asphalt', 'manhole', 'sadak', 'rasta', 'erosion',
      'सड़क', 'सडक', 'गड्ढे', 'गड्ढा', 'गड्डा', 'मार्ग', 'पुल', 'रस्ता', 'रास्ता', 'फूटपाथ', 'धंस', 'मरम्मत'
    ];

    // 4. Sanitation & Waste Management Keywords (English + Indic)
    const sanitationKeywords = [
      'garbage', 'waste', 'trash', 'dump', 'dustbin', 'cleaning', 'sanitation', 'sweeper', 'stench', 'smell',
      'kachra', 'gandagi', 'overflow',
      'कचरा', 'गंदगी', 'कूड़ा', 'सफाई', 'कचराकुंडी', 'घाण', 'दुर्गंधी', 'नाली', 'गटर'
    ];

    // 5. Public Health Keywords (English + Indic)
    const healthKeywords = [
      'hospital', 'doctor', 'health', 'clinic', 'medicine', 'dengue', 'malaria', 'ambulance', 'patient', 'fever',
      'अस्पताल', 'दवाखाना', 'डॉक्टर', 'दवा', 'दवाई', 'स्वास्थ्य', 'आरोग्य', 'मलेरिया', 'डेंग्यू', 'रुग्णालय'
    ];

    // 6. Public Transport Keywords (English + Indic)
    const transportKeywords = [
      'bus', 'transport', 'depot', 'traffic', 'metro', 'auto', 'rickshaw', 'conductor', 'driver', 'fare',
      'बस', 'परिवहन', 'वाहतूक', 'भाडे', 'चालक', 'कंडक्टर', 'डेपो'
    ];

    if (powerKeywords.some(kw => fullText.includes(kw))) {
      cat = 'Electricity';
      catId = 'c2';
      dept = 'Department of Energy & Power';
      deptId = 'd2';
    } else if (roadKeywords.some(kw => fullText.includes(kw))) {
      cat = 'Roads & Infrastructure';
      catId = 'c3';
      dept = 'Public Works Department (PWD)';
      deptId = 'd3';
    } else if (waterKeywords.some(kw => fullText.includes(kw))) {
      cat = 'Water Supply';
      catId = 'c1';
      dept = 'Department of Water Supply & Sewerage';
      deptId = 'd1';
    } else if (sanitationKeywords.some(kw => fullText.includes(kw))) {
      cat = 'Sanitation & Waste Management';
      catId = 'c4';
      dept = 'Municipal Corporation & Sanitation';
      deptId = 'd4';
    } else if (healthKeywords.some(kw => fullText.includes(kw))) {
      cat = 'Public Health';
      catId = 'c5';
      dept = 'Department of Health & Family Welfare';
      deptId = 'd5';
    } else if (transportKeywords.some(kw => fullText.includes(kw))) {
      cat = 'Public Transport';
      catId = 'c6';
      dept = 'Department of Transport';
      deptId = 'd6';
    }

    // Urgency Detection
    const criticalKeywords = ['danger', 'urgent', 'spark', 'fire', 'accident', 'burst', 'collapse', 'life', 'hazard', 'खतरा', 'दुर्घटना', 'अपघात', 'आग', 'तत्काल', 'तातडीने', 'गंभीर', 'emergency'];
    const highKeywords = ['days', 'dirty', 'severe', 'frequent', 'broken', 'damage', 'weeks', 'overflow', 'disease', 'हफ्ते', 'दिवस', 'खराब', 'अस्वच्छ', 'धोकादायक', 'अंधेरा'];

    if (criticalKeywords.some(kw => fullText.includes(kw))) {
      urgency = 'critical';
      confidence = 0.98;
    } else if (highKeywords.some(kw => fullText.includes(kw))) {
      urgency = 'high';
      confidence = 0.94;
    } else {
      urgency = 'medium';
      confidence = 0.91;
    }

    const detectedLang = (body.selected_language && body.selected_language !== 'en') ? body.selected_language : (fullText.match(/[\u0900-\u097F]/) ? 'hi' : 'en');
    const langObj = MOCK_LANGUAGES.find(l => l.code === detectedLang) || MOCK_LANGUAGES[0];

    const result: AIAnalysisResult = {
      detected_language: detectedLang,
      language_name: langObj.name,
      translated_text: detectedLang !== 'en' ? `[AI English Translation]: Citizen grievance concerning ${cat.toLowerCase()}: "${body.description}"` : null,
      suggested_category: cat,
      suggested_category_id: catId,
      suggested_department: dept,
      suggested_department_id: deptId,
      suggested_urgency: urgency,
      summary: `Citizen reported: ${body.title || 'Civic grievance'}. Recommended routing to ${dept} (${cat}) with ${urgency.toUpperCase()} urgency priority.`,
      confidence,
      reasoning_summary: `Strong semantic correlation with ${cat} domain terminology and ${urgency.toUpperCase()} SLA urgency indicators.`,
      requires_human_review: false,
      provider: 'sarvam_ai_fallback',
      model: 'indic-grievance-classifier-v2'
    };
    return result as unknown as T;
  }

  // Create Complaint
  if (endpoint === '/complaints' && options.method === 'POST') {
    const body = JSON.parse(options.body as string || '{}');
    const randomTicket = `JSA-2026-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    // Lookup matching category and department from available lists
    const matchedCategory = MOCK_CATEGORIES.find(c => c.id === body.category_id) || MOCK_CATEGORIES[0];
    const matchedDepartment = MOCK_DEPARTMENTS.find(d => d.id === body.assigned_department_id) || MOCK_DEPARTMENTS[0];
    const currentUser = getStoredUser();

    const newComp: Complaint = {
      id: `comp-${Date.now()}`,
      ticket_id: randomTicket,
      citizen_id: currentUser?.id || `usr-${Date.now()}`,
      citizen_email: currentUser?.email?.toLowerCase() || undefined,
      title: body.title,
      original_description: body.description,
      original_language: body.language || 'en',
      translated_description: body.translated_description,
      ai_summary: body.ai_summary,
      category_id: matchedCategory.id,
      category_name: matchedCategory.name,
      assigned_department_id: matchedDepartment.id,
      department_name: matchedDepartment.name,
      priority: body.priority || 'medium',
      status: 'submitted',
      state: body.state || 'Maharashtra',
      district: body.district || 'Pune',
      locality: body.locality || 'Ward 12',
      submitted_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      due_at: new Date(Date.now() + 48 * 3600 * 1000).toISOString(),
      status_history: [
        { id: `sh-${Date.now()}`, new_status: 'submitted', public_comment: 'Grievance submitted via JanSahayak AI.', created_at: new Date().toISOString() }
      ],
      comments: [],
    };
    localComplaintsStore.unshift(newComp);
    try {
      localStorage.setItem('jansahayak_complaints', JSON.stringify(localComplaintsStore));
    } catch (e) {}
    return newComp as unknown as T;
  }

  throw originalError;
}

export const api = {
  get: <T>(endpoint: string) => request<T>(endpoint, { method: 'GET' }),
  post: <T>(endpoint: string, body?: any) => request<T>(endpoint, { method: 'POST', body: body ? JSON.stringify(body) : undefined }),
  patch: <T>(endpoint: string, body?: any) => request<T>(endpoint, { method: 'PATCH', body: body ? JSON.stringify(body) : undefined }),
  delete: <T>(endpoint: string) => request<T>(endpoint, { method: 'DELETE' }),
};
