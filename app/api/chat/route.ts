import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function POST(request: Request) {
  try {
    const { message } = await request.json()
    const msgLower = message.toLowerCase()

    const supabase = await createClient()

    // Smart logic for "next event"
    if (msgLower.includes('next event') || msgLower.includes('upcoming event')) {
      const { data: events } = await supabase
        .from('events')
        .select('*')
        .gt('date', new Date().toISOString())
        .order('date', { ascending: true })
        .limit(1)

      if (events && events.length > 0) {
        const nextEvent = events[0]
        const dateStr = new Date(nextEvent.date).toLocaleDateString()
        const timeStr = new Date(nextEvent.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
        return NextResponse.json({ response: `The next event is "${nextEvent.title}" on ${dateStr} at ${timeStr}. The location is ${nextEvent.location}. You can reserve your spot by clicking "View & Register" on your dashboard!` })
      } else {
        return NextResponse.json({ response: "There are currently no upcoming events scheduled. Check back later!" })
      }
    }

    // Smart logic for "how to register"
    if (msgLower.includes('register') || msgLower.includes('sign up')) {
      return NextResponse.json({ response: "It's super easy! To register for an event, go to your Student Dashboard, find the event you're interested in, and click 'View & Register' at the bottom. Once registered, you'll instantly receive a unique QR code." })
    }

    // Smart logic for "attendance" or "qr code"
    if (msgLower.includes('qr code') || msgLower.includes('attendance') || msgLower.includes('ticket')) {
      return NextResponse.json({ response: "For every event you successfully register for, you get a unique QR Code ticket. You can find all your tickets in the 'My Registrations' tab on the left. Just show the QR code scanner to the Administrator at the event entrance!" })
    }

    // Default fallback simple AI response
    return NextResponse.json({ response: "I'm your official Event Assistant! 🤖 Try asking me things like 'When is the next event?', 'How do I register?', or 'Where is my QR code?'" })

  } catch (error) {
    return NextResponse.json({ response: "Sorry, I am having trouble securely connecting to the event database right now." })
  }
}
