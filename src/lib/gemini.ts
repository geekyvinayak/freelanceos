import { GoogleGenerativeAI } from '@google/generative-ai'

const apiKey = import.meta.env.VITE_GEMINI_API_KEY

if (!apiKey) {
  throw new Error('Missing Gemini API key')
}

const genAI = new GoogleGenerativeAI(apiKey)

export const geminiModel = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

export async function generateEmail(
  recipientName: string,
  context: string,
  tone: 'professional' | 'friendly' | 'urgent'
): Promise<string> {
  const prompt = `
    Write a professional email with the following details:
    
    Recipient: ${recipientName}
    Context/Subject: ${context}
    Tone: ${tone}
    
    Please generate a well-structured email that includes:
    - Appropriate subject line
    - Professional greeting
    - Clear and concise body content
    - Appropriate closing
    
    Format the response as a complete email ready to send.
  `

  try {
    const result = await geminiModel.generateContent(prompt)
    const response = result.response
    return response.text()
  } catch (error) {
    console.error('Error generating email:', error)
    throw new Error('Failed to generate email content')
  }
}
