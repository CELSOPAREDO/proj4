import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function POST(request: Request) {
  try {
    const { message } = await request.json()
    const msgLower = String(message || '').toLowerCase().trim()

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const isGreeting =
      msgLower === 'hi' ||
      msgLower === 'hello' ||
      msgLower === 'hey' ||
      msgLower.includes('good morning') ||
      msgLower.includes('good afternoon')

    if (isGreeting) {
      return NextResponse.json({
        response:
          "Hello! Ask me anything about your system data: events, schedules, tickets, registrations, attendance, and your account."
      })
    }

    const asksAboutEventTiming =
      msgLower.includes('next event') ||
      msgLower.includes('upcoming event') ||
      msgLower.includes('upcoming events') ||
      msgLower.includes('when is the event') ||
      msgLower.includes('when is event') ||
      msgLower.includes('when is the next event') ||
      msgLower.includes('this friday') ||
      (msgLower.includes('event') && msgLower.includes('when'))

    if (asksAboutEventTiming) {
      const { data: nextEvent } = await supabase
        .from('events')
        .select('*')
        .gt('date', new Date().toISOString())
        .order('date', { ascending: true })
        .limit(1)
        .maybeSingle()

      if (nextEvent) {
        const dateStr = new Date(nextEvent.date).toLocaleDateString()
        const timeStr = new Date(nextEvent.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
        const dayName = new Date(nextEvent.date).toLocaleDateString(undefined, { weekday: 'long' })
        return NextResponse.json({
          response: `The next event is "${nextEvent.title}" on ${dayName}, ${dateStr} at ${timeStr}. Location: ${nextEvent.location}. You can register from your Student Dashboard using "View & Register".`
        })
      } else {
        return NextResponse.json({ response: "There are currently no upcoming events scheduled. Check back later!" })
      }
    }

    const asksForEventList =
      msgLower.includes('list events') ||
      msgLower.includes('all events') ||
      msgLower.includes('show events') ||
      (msgLower.includes('events') && msgLower.includes('show'))

    if (asksForEventList) {
      const { data: events } = await supabase
        .from('events')
        .select('title, date, location')
        .order('date', { ascending: true })
        .limit(5)

      if (!events || events.length === 0) {
        return NextResponse.json({ response: 'No events are available in the system right now.' })
      }

      const lines = events.map((event, idx) => {
        const dateStr = new Date(event.date).toLocaleDateString()
        const timeStr = new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        return `${idx + 1}. ${event.title} — ${dateStr} ${timeStr} @ ${event.location}`
      })

      return NextResponse.json({ response: `Here are the next ${events.length} events:\n${lines.join('\n')}` })
    }

    if (msgLower.includes('register') || msgLower.includes('sign up')) {
      return NextResponse.json({ response: "It's super easy! To register for an event, go to your Student Dashboard, find the event you're interested in, and click 'View & Register' at the bottom. Once registered, you'll instantly receive a unique QR code." })
    }

    if (msgLower.includes('qr code') || msgLower.includes('attendance') || msgLower.includes('ticket')) {
      if (!user) {
        return NextResponse.json({ response: "Sign in first so I can check your tickets and attendance in the system." })
      }

      const { data: myRegistrations } = await supabase
        .from('registrations')
        .select('id, qr_code_data, event_id')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)

      if (myRegistrations && myRegistrations.length > 0) {
        return NextResponse.json({
          response: `You have ${myRegistrations.length} recent ticket record(s). Your latest QR token starts with: ${myRegistrations[0].qr_code_data.slice(0, 18)}... You can view the full QR in "My Registrations".`
        })
      }

      return NextResponse.json({ response: "For every event you successfully register for, you get a unique QR Code ticket. You can find all your tickets in the 'My Registrations' tab on the left. Just show the QR code scanner to the Administrator at the event entrance!" })
    }

    const asksMyProfile =
      msgLower.includes('my profile') ||
      msgLower.includes('who am i') ||
      msgLower.includes('my role')

    if (asksMyProfile) {
      if (!user) {
        return NextResponse.json({ response: 'You are not signed in right now.' })
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, role')
        .eq('id', user.id)
        .maybeSingle()

      return NextResponse.json({
        response: `Signed in as ${profile?.full_name || user.email || 'Unknown user'} with role: ${profile?.role || 'student'}.`
      })
    }

    const asksAdminStats =
      msgLower.includes('dashboard stats') ||
      msgLower.includes('total events') ||
      msgLower.includes('total students') ||
      msgLower.includes('system stats')

    if (asksAdminStats) {
      const { count: eventsCount } = await supabase.from('events').select('*', { count: 'exact', head: true })
      const { count: studentsCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'student')
      const { count: registrationsCount } = await supabase.from('registrations').select('*', { count: 'exact', head: true })

      return NextResponse.json({
        response: `Current system stats: ${eventsCount || 0} event(s), ${studentsCount || 0} student(s), and ${registrationsCount || 0} registration(s).`
      })
    }

    return NextResponse.json({
      response:
        "I can answer system-based questions only. Try asking: 'show events', 'when is the next event', 'how do I register', 'check my profile', 'my tickets', or 'system stats'."
    })

  } catch (error) {
    return NextResponse.json({ response: "Sorry, I am having trouble securely connecting to the event database right now." })
  }
}
