// Simple test script to verify Gemini API key
import { GoogleGenerativeAI } from '@google/generative-ai'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const apiKey = process.env.VITE_GEMINI_API_KEY

if (!apiKey) {
  console.error('❌ VITE_GEMINI_API_KEY not found in environment variables')
  process.exit(1)
}

console.log('🔑 API Key found:', apiKey.substring(0, 10) + '...')

const genAI = new GoogleGenerativeAI(apiKey)
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

async function testGemini() {
  try {
    console.log('🧪 Testing Gemini API...')
    
    const prompt = "Write a short professional email greeting."
    const result = await model.generateContent(prompt)
    const response = result.response
    const text = response.text()
    
    console.log('✅ Gemini API is working!')
    console.log('📧 Generated text:', text)
    
  } catch (error) {
    console.error('❌ Gemini API test failed:', error.message)
    
    if (error.message.includes('API_KEY_INVALID')) {
      console.log('💡 Please check your API key at: https://aistudio.google.com/app/apikey')
    }
  }
}

testGemini()
