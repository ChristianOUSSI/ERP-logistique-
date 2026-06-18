// API Service for Finance Module

export interface Transaction {
  id: string;
  type: 'credit' | 'debit';
  amount: number;
  currency: string;
  date: string;
  description: string;
  status: 'pending' | 'completed' | 'failed';
}

export interface Invoice {
  id: string;
  client: string;
  amount: number;
  dueDate: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  items: Array<{ description: string; quantity: number; unitPrice: number }>;
}

export interface BankReconciliation {
  id: string;
  bankAccount: string;
  statementDate: string;
  openingBalance: number;
  closingBalance: number;
  transactions: Transaction[];
}

class FinanceAPI {
  private baseUrl = '/api/finance';

  async getTransactions(): Promise<Transaction[]> {
    const response = await fetch(`${this.baseUrl}/transactions`);
    if (!response.ok) throw new Error('Failed to fetch transactions');
    return response.json();
  }

  async getInvoices(): Promise<Invoice[]> {
    const response = await fetch(`${this.baseUrl}/invoices`);
    if (!response.ok) throw new Error('Failed to fetch invoices');
    return response.json();
  }

  async getBankReconciliations(): Promise<BankReconciliation[]> {
    const response = await fetch(`${this.baseUrl}/bank-reconciliations`);
    if (!response.ok) throw new Error('Failed to fetch bank reconciliations');
    return response.json();
  }

  async createTransaction(transaction: Omit<Transaction, 'id'>): Promise<Transaction> {
    const response = await fetch(`${this.baseUrl}/transactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(transaction),
    });
    if (!response.ok) throw new Error('Failed to create transaction');
    return response.json();
  }

  async createInvoice(invoice: Omit<Invoice, 'id'>): Promise<Invoice> {
    const response = await fetch(`${this.baseUrl}/invoices`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(invoice),
    });
    if (!response.ok) throw new Error('Failed to create invoice');
    return response.json();
  }
}

export const financeAPI = new FinanceAPI();
