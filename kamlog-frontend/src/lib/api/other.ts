// API Service for Other Modules (Documents, Settings, Support)

export interface Document {
  id: string;
  type: string;
  reference: string;
  generatedAt: string;
  module: string;
  fileSize: number;
  fileUrl: string;
}

export interface DocumentCategory {
  id: string;
  name: string;
  icon: string;
  count: number;
  lastAdded: string;
}

export interface SystemSetting {
  id: string;
  key: string;
  value: string;
  category: string;
  description: string;
}

export interface SupportTicket {
  id: string;
  subject: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  createdAt: string;
  userId: string;
}

class OtherAPI {
  private baseUrl = '/api/other';

  async getDocuments(): Promise<Document[]> {
    const response = await fetch(`${this.baseUrl}/documents`);
    if (!response.ok) throw new Error('Failed to fetch documents');
    return response.json();
  }

  async getDocumentCategories(): Promise<DocumentCategory[]> {
    const response = await fetch(`${this.baseUrl}/document-categories`);
    if (!response.ok) throw new Error('Failed to fetch document categories');
    return response.json();
  }

  async getSystemSettings(): Promise<SystemSetting[]> {
    const response = await fetch(`${this.baseUrl}/settings`);
    if (!response.ok) throw new Error('Failed to fetch system settings');
    return response.json();
  }

  async getSupportTickets(): Promise<SupportTicket[]> {
    const response = await fetch(`${this.baseUrl}/support-tickets`);
    if (!response.ok) throw new Error('Failed to fetch support tickets');
    return response.json();
  }

  async uploadDocument(file: File, metadata: Omit<Document, 'id' | 'generatedAt' | 'fileSize' | 'fileUrl'>): Promise<Document> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('metadata', JSON.stringify(metadata));

    const response = await fetch(`${this.baseUrl}/documents/upload`, {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) throw new Error('Failed to upload document');
    return response.json();
  }

  async createSupportTicket(ticket: Omit<SupportTicket, 'id' | 'createdAt'>): Promise<SupportTicket> {
    const response = await fetch(`${this.baseUrl}/support-tickets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ticket),
    });
    if (!response.ok) throw new Error('Failed to create support ticket');
    return response.json();
  }

  async updateSystemSetting(setting: Omit<SystemSetting, 'id'>): Promise<SystemSetting> {
    const response = await fetch(`${this.baseUrl}/settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(setting),
    });
    if (!response.ok) throw new Error('Failed to update system setting');
    return response.json();
  }
}

export const otherAPI = new OtherAPI();
