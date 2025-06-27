import { useState } from 'react'
import { MainLayout } from '@/components/layout/MainLayout'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select'
import { Mail, Sparkles, Copy, RefreshCw } from 'lucide-react'
import { generateEmail } from '@/lib/gemini'
import { useToast } from '@/hooks/useToast'

export function EmailAssistantPage() {
  const [formData, setFormData] = useState({
    recipientName: '',
    context: '',
    tone: 'professional' as 'professional' | 'friendly' | 'urgent'
  })
  const [generatedEmail, setGeneratedEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleGenerateEmail = async () => {
    if (!formData.recipientName.trim() || !formData.context.trim()) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in both recipient name and context',
        variant: 'destructive',
      })
      return
    }

    setLoading(true)
    try {
      const email = await generateEmail(
        formData.recipientName,
        formData.context,
        formData.tone
      )
      setGeneratedEmail(email)
      toast({
        title: 'Success',
        description: 'Email generated successfully!',
        variant: 'success',
      })
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to generate email',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(generatedEmail)
      toast({
        title: 'Copied!',
        description: 'Email copied to clipboard',
        variant: 'success',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to copy email',
        variant: 'destructive',
      })
    }
  }

  const handleClearForm = () => {
    setFormData({
      recipientName: '',
      context: '',
      tone: 'professional'
    })
    setGeneratedEmail('')
  }

  const toneDescriptions = {
    professional: 'Formal and business-appropriate tone',
    friendly: 'Warm and approachable tone',
    urgent: 'Direct and time-sensitive tone'
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Mail className="mr-3 h-8 w-8 text-primary-600" />
            AI Email Assistant
          </h1>
          <p className="text-gray-600 mt-2">
            Generate professional emails with AI assistance. Perfect for client communication, project updates, and business correspondence.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Sparkles className="mr-2 h-5 w-5 text-primary-600" />
                Email Details
              </CardTitle>
              <CardDescription>
                Provide the details below and let AI craft the perfect email for you
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="recipientName" className="text-sm font-medium text-gray-700">
                  Recipient Name *
                </label>
                <Input
                  id="recipientName"
                  value={formData.recipientName}
                  onChange={(e) => handleInputChange('recipientName', e.target.value)}
                  placeholder="e.g., John Smith"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="context" className="text-sm font-medium text-gray-700">
                  Context/Subject *
                </label>
                <Textarea
                  id="context"
                  value={formData.context}
                  onChange={(e) => handleInputChange('context', e.target.value)}
                  placeholder="e.g., Following up on project proposal, requesting payment for completed work, scheduling a meeting..."
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="tone" className="text-sm font-medium text-gray-700">
                  Tone
                </label>
                <Select value={formData.tone} onValueChange={(value: 'professional' | 'friendly' | 'urgent') => handleInputChange('tone', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="friendly">Friendly</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500">
                  {toneDescriptions[formData.tone]}
                </p>
              </div>

              <div className="flex space-x-3 pt-4">
                <Button 
                  onClick={handleGenerateEmail} 
                  disabled={loading || !formData.recipientName.trim() || !formData.context.trim()}
                  className="flex-1"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate Email
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={handleClearForm}>
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Generated Email Output */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center">
                  <Mail className="mr-2 h-5 w-5 text-primary-600" />
                  Generated Email
                </span>
                {generatedEmail && (
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={handleCopyEmail}>
                      <Copy className="mr-2 h-4 w-4" />
                      Copy
                    </Button>
                  </div>
                )}
              </CardTitle>
              <CardDescription>
                Your AI-generated email will appear here
              </CardDescription>
            </CardHeader>
            <CardContent>
              {generatedEmail ? (
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4 border">
                    <pre className="whitespace-pre-wrap text-sm text-gray-800 font-sans">
                      {generatedEmail}
                    </pre>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={handleCopyEmail} className="flex-1">
                      <Copy className="mr-2 h-4 w-4" />
                      Copy to Clipboard
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleGenerateEmail} disabled={loading} className="flex-1">
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Regenerate
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Mail className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                  <p>No email generated yet</p>
                  <p className="text-sm">Fill in the details and click "Generate Email" to get started</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Tips Section */}
        <Card>
          <CardHeader>
            <CardTitle>Tips for Better Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900">Be Specific</h4>
                <p className="text-sm text-gray-600">
                  Provide clear context about what you want to communicate. The more specific you are, the better the AI can tailor the email.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900">Choose the Right Tone</h4>
                <p className="text-sm text-gray-600">
                  Select the tone that matches your relationship with the recipient and the nature of your message.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900">Review and Edit</h4>
                <p className="text-sm text-gray-600">
                  Always review the generated email and make any necessary adjustments before sending.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
