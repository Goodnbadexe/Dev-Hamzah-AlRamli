import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function generatePreMeetingBrief(opts: {
  clientName: string
  company: string
  service: string
  message: string
  startISO: string
}): Promise<string> {
  const dateStr = new Date(opts.startISO).toLocaleString('en-SA', {
    timeZone: 'Asia/Riyadh',
    weekday: 'long', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 600,
    system: `You are a professional assistant helping Hamzah Al-Ramli, a cybersecurity consultant based in Riyadh, prepare for client meetings.
You write concise, actionable pre-meeting briefs in bullet-point format.
You speak directly to Hamzah. Be sharp, practical, no fluff.`,
    messages: [
      {
        role: 'user',
        content: `Prepare a 45-minute pre-meeting brief for Hamzah. Meeting is at ${dateStr} AST.

CLIENT: ${opts.clientName}
COMPANY: ${opts.company || 'Not provided'}
SERVICE REQUESTED: ${opts.service}
THEIR MESSAGE: ${opts.message || '(no message)'}

Write a brief covering:
1. What this client likely needs (based on their inquiry)
2. Key questions to ask them to scope the work
3. What to prepare or have ready (relevant certifications, examples, pricing to mention)
4. Likely objections and how to handle them
5. Suggested next steps to propose at the end of the call

Keep it tight — 5 bullet points per section max. This brief must be readable in under 2 minutes.`,
      },
    ],
  })

  const block = response.content[0]
  return block.type === 'text' ? block.text : 'Brief generation failed.'
}
