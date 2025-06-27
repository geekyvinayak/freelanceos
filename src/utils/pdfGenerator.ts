import jsPDF from 'jspdf'
import type { Bill, Project } from '@/types'

interface InvoiceData extends Bill {
  project?: Project
  companyInfo?: {
    name: string
    address: string
    email: string
    phone?: string
  }
  clientInfo?: {
    name: string
    address: string
    email: string
  }
}

export function generateInvoicePDF(invoiceData: InvoiceData) {
  const doc = new jsPDF()

  // Modern color palette
  const primaryColor = '#1e40af' // blue-800
  // const accentColor = '#3b82f6' // blue-500
  const textColor = '#1f2937' // gray-800
  const lightTextColor = '#6b7280' // gray-500
  // const lightBg = '#f8fafc' // slate-50

  // Company info (default values)
  const companyInfo = invoiceData.companyInfo || {
    name: 'FreelanceOS',
    address: '123 Business St, City, State 12345',
    email: 'contact@freelanceos.com'
  }

  // Page dimensions
  const pageWidth = doc.internal.pageSize.width
  const pageHeight = doc.internal.pageSize.height
  const margin = 25
  
  // Clean minimal header
  doc.setTextColor(textColor)
  doc.setFontSize(32)
  doc.setFont('helvetica', 'bold')
  doc.text('INVOICE', margin, 40)

  // Company name - top right
  doc.setFontSize(18)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(primaryColor)
  doc.text(companyInfo.name, pageWidth - margin - 60, 30)

  // Subtle line separator
  doc.setDrawColor(230, 230, 230)
  doc.setLineWidth(0.5)
  doc.line(margin, 55, pageWidth - margin, 55)
  
  // Invoice details in clean layout
  let yPos = 75

  // Invoice number - prominent
  doc.setTextColor(textColor)
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text(`Invoice #${invoiceData.invoice_number}`, margin, yPos)

  // Status badge
  yPos += 20
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  const statusColor = invoiceData.status === 'paid' ? '#10b981' : '#f59e0b'
  doc.setTextColor(statusColor)
  doc.text(invoiceData.status.toUpperCase(), margin, yPos)

  // Date information - right aligned
  yPos = 75
  doc.setTextColor(lightTextColor)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')

  const dateText = `Created: ${new Date(invoiceData.created_at).toLocaleDateString()}`
  const dueDateText = `Due: ${new Date(invoiceData.due_date).toLocaleDateString()}`

  doc.text(dateText, pageWidth - margin - 60, yPos)
  doc.text(dueDateText, pageWidth - margin - 60, yPos + 12)
  
  // Company and project information in clean layout
  yPos = 110

  // Company info section
  doc.setTextColor(lightTextColor)
  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  doc.text('FROM', margin, yPos)

  yPos += 15
  doc.setTextColor(textColor)
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text(companyInfo.name, margin, yPos)

  yPos += 12
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text(companyInfo.address, margin, yPos)

  yPos += 10
  doc.text(companyInfo.email, margin, yPos)

  // Project info section (right side)
  if (invoiceData.project) {
    let projectYPos = 110

    doc.setTextColor(lightTextColor)
    doc.setFontSize(9)
    doc.setFont('helvetica', 'bold')
    doc.text('PROJECT', pageWidth - margin - 80, projectYPos)

    projectYPos += 15
    doc.setTextColor(textColor)
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text(invoiceData.project.name, pageWidth - margin - 80, projectYPos)

    if (invoiceData.project.description) {
      projectYPos += 12
      doc.setFontSize(9)
      doc.setFont('helvetica', 'normal')
      const splitDescription = doc.splitTextToSize(invoiceData.project.description, 75)
      doc.text(splitDescription, pageWidth - margin - 80, projectYPos)
    }
  }

  yPos = Math.max(yPos + 30, 180)
  
  // Invoice description section
  yPos += 20

  // Description header
  doc.setTextColor(lightTextColor)
  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  doc.text('DESCRIPTION', margin, yPos)

  yPos += 15
  doc.setTextColor(textColor)
  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')
  const splitDescription = doc.splitTextToSize(invoiceData.description, pageWidth - 2 * margin - 20)
  doc.text(splitDescription, margin, yPos)

  // Amount section - clean and prominent
  yPos += Math.max(splitDescription.length * 6, 20) + 30

  // Subtle separator line
  doc.setDrawColor(230, 230, 230)
  doc.setLineWidth(0.5)
  doc.line(margin, yPos, pageWidth - margin, yPos)

  yPos += 20

  // Total amount - prominent display
  const formattedAmount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(Number(invoiceData.amount))

  doc.setTextColor(lightTextColor)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text('TOTAL AMOUNT', margin, yPos)

  doc.setTextColor(primaryColor)
  doc.setFontSize(24)
  doc.setFont('helvetica', 'bold')
  doc.text(formattedAmount, margin, yPos + 15)
  
  // Clean minimal footer
  yPos = pageHeight - 30

  // Subtle separator line
  doc.setDrawColor(240, 240, 240)
  doc.setLineWidth(0.3)
  doc.line(margin, yPos - 10, pageWidth - margin, yPos - 10)

  doc.setTextColor(lightTextColor)
  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  doc.text('Thank you for your business!', margin, yPos)
  doc.text(`Generated by FreelanceOS on ${new Date().toLocaleDateString()}`, pageWidth - margin - 80, yPos)
  
  return doc
}

export function downloadInvoicePDF(invoiceData: InvoiceData) {
  const doc = generateInvoicePDF(invoiceData)
  const filename = `invoice-${invoiceData.invoice_number}.pdf`
  doc.save(filename)
}

export function previewInvoicePDF(invoiceData: InvoiceData) {
  const doc = generateInvoicePDF(invoiceData)
  const pdfBlob = doc.output('blob')
  const url = URL.createObjectURL(pdfBlob)
  window.open(url, '_blank')
}
