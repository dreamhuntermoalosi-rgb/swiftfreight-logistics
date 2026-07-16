'use client';

import type { Invoice, Company, Delivery } from '@/lib/types';
import { deliveries } from '@/lib/mock-data';

// ============ Helpers ============

function formatCurrency(value: number): string {
  return `M${value.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-ZA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function getTrackingNumber(deliveryId: string): string {
  const delivery = deliveries.find((d: Delivery) => d.id === deliveryId);
  return delivery?.trackingNumber || '—';
}

function getItemizedBreakdown(invoice: Invoice) {
  return [
    { description: 'Delivery charges', amount: Math.round(invoice.amount * 0.65) },
    { description: 'Handling & packaging', amount: Math.round(invoice.amount * 0.15) },
    { description: 'Border processing', amount: Math.round(invoice.amount * 0.1) },
    { description: 'Insurance', amount: Math.round(invoice.amount * 0.1) },
  ];
}

function getStatusDisplay(status: Invoice['status']): { label: string; color: string; bg: string } {
  switch (status) {
    case 'paid':
      return { label: 'PAID', color: '#065f46', bg: '#d1fae5' };
    case 'pending':
      return { label: 'PENDING', color: '#92400e', bg: '#fef3c7' };
    case 'overdue':
      return { label: 'OVERDUE', color: '#991b1b', bg: '#fee2e2' };
  }
}

// ============ HTML Generation ============

function generateInvoiceHtml(invoice: Invoice, company: Company): string {
  const breakdown = getItemizedBreakdown(invoice);
  const subtotal = breakdown.reduce((s, item) => s + item.amount, 0);
  const taxRate = 0.15;
  const tax = Math.round(subtotal * taxRate);
  const total = invoice.amount;
  const trackingNumber = getTrackingNumber(invoice.deliveryId);
  const status = getStatusDisplay(invoice.status);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Invoice ${invoice.id} — ${company.name}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

    @page {
      size: A4;
      margin: 0;
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      color: #1a1a2e;
      background: #ffffff;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    .invoice-print-area {
      width: 210mm;
      min-height: 297mm;
      margin: 0 auto;
      background: #ffffff;
      position: relative;
    }

    /* ─── Green Header Bar ─── */
    .header-bar {
      background: linear-gradient(135deg, #065f46 0%, #047857 40%, #0d9488 100%);
      padding: 32px 48px;
      color: #ffffff;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }

    .header-bar .company-info h1 {
      font-size: 24px;
      font-weight: 800;
      letter-spacing: -0.5px;
      margin-bottom: 4px;
    }

    .header-bar .company-info p {
      font-size: 12px;
      opacity: 0.85;
      line-height: 1.5;
    }

    .header-bar .invoice-label {
      text-align: right;
    }

    .header-bar .invoice-label h2 {
      font-size: 36px;
      font-weight: 800;
      letter-spacing: 4px;
      opacity: 0.9;
    }

    .header-bar .invoice-label .status-badge {
      display: inline-block;
      margin-top: 8px;
      padding: 4px 14px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 1px;
      color: ${status.color};
      background: ${status.bg};
      border: 2px solid ${status.color}22;
    }

    /* ─── Body Content ─── */
    .invoice-body {
      padding: 32px 48px 24px;
    }

    /* ─── Invoice Meta Row ─── */
    .meta-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 32px;
    }

    .meta-block h3 {
      font-size: 10px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1.2px;
      color: #6b7280;
      margin-bottom: 10px;
    }

    .meta-block .value {
      font-size: 13px;
      color: #1a1a2e;
      line-height: 1.7;
    }

    .meta-block .value strong {
      font-weight: 600;
    }

    .bill-to-box {
      background: #f0fdf4;
      border-left: 4px solid #047857;
      border-radius: 0 8px 8px 0;
      padding: 16px 20px;
    }

    /* ─── Divider ─── */
    .divider {
      height: 1px;
      background: linear-gradient(90deg, #e5e7eb, #d1d5db, #e5e7eb);
      margin: 24px 0;
    }

    /* ─── Items Table ─── */
    .items-section h3 {
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #374151;
      margin-bottom: 12px;
    }

    .items-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 0;
    }

    .items-table thead th {
      background: #f9fafb;
      padding: 10px 16px;
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      color: #6b7280;
      text-align: left;
      border-bottom: 2px solid #e5e7eb;
    }

    .items-table thead th:last-child {
      text-align: right;
    }

    .items-table tbody td {
      padding: 12px 16px;
      font-size: 13px;
      border-bottom: 1px solid #f3f4f6;
    }

    .items-table tbody td:last-child {
      text-align: right;
      font-weight: 600;
      font-variant-numeric: tabular-nums;
    }

    .items-table tbody tr:last-child td {
      border-bottom: none;
    }

    /* ─── Totals Section ─── */
    .totals-section {
      display: flex;
      justify-content: flex-end;
      margin-top: 16px;
    }

    .totals-box {
      width: 280px;
    }

    .totals-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 0;
      font-size: 13px;
      color: #4b5563;
    }

    .totals-row.total {
      padding: 14px 16px;
      background: linear-gradient(135deg, #065f46, #047857);
      color: #ffffff;
      font-size: 16px;
      font-weight: 700;
      border-radius: 8px;
      margin-top: 4px;
    }

    .totals-row.total .amount {
      font-size: 18px;
    }

    .totals-divider {
      height: 1px;
      background: #e5e7eb;
    }

    /* ─── Footer ─── */
    .invoice-footer {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 20px 48px;
      border-top: 2px solid #e5e7eb;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .invoice-footer .footer-left p {
      font-size: 10px;
      color: #9ca3af;
      line-height: 1.6;
    }

    .invoice-footer .footer-right {
      text-align: right;
    }

    .invoice-footer .footer-right p {
      font-size: 10px;
      color: #9ca3af;
      line-height: 1.6;
    }

    .invoice-footer .thank-you {
      font-size: 12px;
      font-weight: 600;
      color: #047857;
      margin-bottom: 2px;
    }

    /* ─── Watermark ─── */
    .watermark {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) rotate(-30deg);
      font-size: 72px;
      font-weight: 800;
      color: ${status.label === 'PAID' ? '#065f4608' : status.label === 'OVERDUE' ? '#991b1b08' : '#92400e08'};
      letter-spacing: 12px;
      pointer-events: none;
      white-space: nowrap;
    }
  </style>
</head>
<body>
  <div class="invoice-print-area">
    ${status.label !== 'PAID' ? `<div class="watermark">${status.label}</div>` : ''}

    <!-- Header Bar -->
    <div class="header-bar">
      <div class="company-info">
        <h1>${company.name}</h1>
        <p>${company.address}, ${company.city}, ${company.country}</p>
        <p>${company.email} &middot; ${company.phone}</p>
      </div>
      <div class="invoice-label">
        <h2>INVOICE</h2>
        <span class="status-badge">${status.label}</span>
      </div>
    </div>

    <!-- Body -->
    <div class="invoice-body">
      <!-- Meta Row -->
      <div class="meta-row">
        <div class="meta-block">
          <h3>Invoice Details</h3>
          <div class="value">
            <strong>Invoice #:</strong> ${invoice.id}<br />
            <strong>Date Created:</strong> ${formatDate(invoice.createdAt)}<br />
            <strong>Due Date:</strong> ${formatDate(invoice.dueDate)}<br />
            <strong>Currency:</strong> ${invoice.currency === 'M' ? 'Maloti (M)' : invoice.currency}
          </div>
        </div>
        <div class="meta-block">
          <h3>Delivery Reference</h3>
          <div class="value">
            <strong>Tracking #:</strong> ${trackingNumber}<br />
            <strong>Delivery ID:</strong> ${invoice.deliveryId}
          </div>
        </div>
      </div>

      <!-- Bill To -->
      <div class="bill-to-box">
        <h3 style="font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:1.2px;color:#6b7280;margin-bottom:8px;">Bill To</h3>
        <div style="font-size:14px;font-weight:600;color:#1a1a2e;margin-bottom:2px;">${invoice.customerName}</div>
        <div style="font-size:12px;color:#6b7280;">Customer ID: ${invoice.customerId}</div>
      </div>

      <!-- Divider -->
      <div class="divider"></div>

      <!-- Items Table -->
      <div class="items-section">
        <h3>Invoice Breakdown</h3>
        <table class="items-table">
          <thead>
            <tr>
              <th style="width: 60px;">#</th>
              <th>Description</th>
              <th style="width: 140px;">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${breakdown.map((item, idx) => `
              <tr>
                <td style="color: #9ca3af;">${idx + 1}</td>
                <td>${item.description}</td>
                <td>${formatCurrency(item.amount)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <!-- Totals -->
      <div class="totals-section">
        <div class="totals-box">
          <div class="totals-row">
            <span>Subtotal</span>
            <span class="amount" style="font-variant-numeric:tabular-nums;">${formatCurrency(subtotal)}</span>
          </div>
          <div class="totals-row">
            <span>VAT (15%)</span>
            <span class="amount" style="font-variant-numeric:tabular-nums;">${formatCurrency(tax)}</span>
          </div>
          <div class="totals-divider"></div>
          <div class="totals-row total">
            <span>Total</span>
            <span class="amount">${formatCurrency(total)}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="invoice-footer">
      <div class="footer-left">
        <p><strong>SwiftFreight</strong> — Lesotho Logistics Platform</p>
        <p>www.swiftfreight.com &middot; support@swiftfreight.com &middot; +266 2231 0000</p>
      </div>
      <div class="footer-right">
        <p class="thank-you">Thank you for your business!</p>
        <p>Payment terms: Net 30 days</p>
      </div>
    </div>
  </div>
</body>
</html>`;
}

// ============ Public API ============

export function downloadInvoicePdf(invoice: Invoice, company: Company): void {
  const html = generateInvoiceHtml(invoice, company);

  const printWindow = window.open('', '_blank', 'width=800,height=1100');
  if (!printWindow) {
    // Fallback: try without dimensions
    const fallbackWindow = window.open('');
    if (!fallbackWindow) return;
    fallbackWindow.document.write(html);
    fallbackWindow.document.close();
    fallbackWindow.focus();
    setTimeout(() => fallbackWindow.print(), 500);
    return;
  }

  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.focus();

  // Wait for fonts to load, then print
  setTimeout(() => {
    printWindow.print();
  }, 600);
}