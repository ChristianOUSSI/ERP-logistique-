// API Service for Reports Module

export interface ReportTemplate {
  id: string;
  module: string;
  title: string;
  description: string;
  lastRun: string;
  frequency: string;
  owner: string;
  fields: string[];
  filters: Record<string, any>;
}

export interface CustomReport {
  id: string;
  module: string;
  name: string;
  selectedFields: string[];
  filters: {
    startDate: string;
    endDate: string;
    searchColumns: string;
  };
  visualization: 'table' | 'chart' | 'pivot';
  exportFormat: 'excel' | 'pdf' | 'csv';
  scheduleReport: boolean;
}

export interface GeneratedReport {
  id: string;
  templateId: string;
  generatedAt: string;
  status: 'pending' | 'completed' | 'failed';
  fileUrl: string;
  fileSize: number;
}

class ReportsAPI {
  private baseUrl = '/api/reports';

  async getTemplates(): Promise<ReportTemplate[]> {
    const response = await fetch(`${this.baseUrl}/templates`);
    if (!response.ok) throw new Error('Failed to fetch templates');
    return response.json();
  }

  async getCustomReports(): Promise<CustomReport[]> {
    const response = await fetch(`${this.baseUrl}/custom-reports`);
    if (!response.ok) throw new Error('Failed to fetch custom reports');
    return response.json();
  }

  async getGeneratedReports(): Promise<GeneratedReport[]> {
    const response = await fetch(`${this.baseUrl}/generated-reports`);
    if (!response.ok) throw new Error('Failed to fetch generated reports');
    return response.json();
  }

  async createTemplate(template: Omit<ReportTemplate, 'id' | 'lastRun'>): Promise<ReportTemplate> {
    const response = await fetch(`${this.baseUrl}/templates`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(template),
    });
    if (!response.ok) throw new Error('Failed to create template');
    return response.json();
  }

  async createCustomReport(report: Omit<CustomReport, 'id'>): Promise<CustomReport> {
    const response = await fetch(`${this.baseUrl}/custom-reports`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(report),
    });
    if (!response.ok) throw new Error('Failed to create custom report');
    return response.json();
  }

  async generateReport(templateId: string): Promise<GeneratedReport> {
    const response = await fetch(`${this.baseUrl}/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ templateId }),
    });
    if (!response.ok) throw new Error('Failed to generate report');
    return response.json();
  }
}

export const reportsAPI = new ReportsAPI();
