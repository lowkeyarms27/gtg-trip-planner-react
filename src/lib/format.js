// Internal/working copy — includes the internal review note, used by
// "Copy itinerary" (the team's own reference copy, not client-facing).
export function formatItineraryAsText(data) {
  const lines = [];
  lines.push(`${data.city}, ${data.country} — World Cup 2026 Golf Itinerary`);
  lines.push('');
  lines.push(`Fixture: ${data.match}`);
  lines.push(`Venue: ${data.venue}`);
  lines.push(`Courses: ${data.courses.join(', ')}`);
  if (data.estValue) lines.push(`Estimated value: ${data.estValue} pp`);
  lines.push('');
  data.days.forEach((d, i) => {
    lines.push(`Day ${i + 1}: ${d.title}`);
    lines.push(d.text);
    lines.push('');
  });
  lines.push('— Drafted by Golf Travel Group. Please review and personalise before confirming with the client.');
  return lines.join('\n');
}

// Client-facing version — warm, polished, no internal notes. This is what
// actually goes in the email body sent (or copy-pasted) to a client.
export function formatItineraryForClient(data) {
  const dayNames = ['One', 'Two', 'Three', 'Four', 'Five'];
  const divider = '─'.repeat(38);
  const lines = [];

  lines.push('Dear [Client Name],');
  lines.push('');
  lines.push(
    `Thank you for your interest in joining us for the FIFA World Cup 2026. We're delighted to share a bespoke golf itinerary built around your trip to ${data.city}, ${data.country}.`
  );
  lines.push('');
  lines.push(divider);
  lines.push(`  ${data.city.toUpperCase()}, ${data.country.toUpperCase()}`);
  lines.push(divider);
  lines.push('');
  lines.push(`  Fixture       ${data.match}`);
  lines.push(`  Venue         ${data.venue}`);
  lines.push(`  Course(s)     ${data.courses.join(', ')}`);
  if (data.estValue) lines.push(`  Estimated*    ${data.estValue} per person`);
  lines.push('');
  lines.push(divider);
  lines.push('');

  data.days.forEach((d, i) => {
    lines.push(`DAY ${dayNames[i] || i + 1} — ${d.title.toUpperCase()}`);
    lines.push('');
    lines.push(d.text);
    lines.push('');
  });

  lines.push(divider);
  lines.push('');
  lines.push(
    "This itinerary is a starting point — we're happy to adjust courses, pacing, or accommodation to suit you. Just reply to this email and we'll take care of the rest."
  );
  lines.push('');
  lines.push('*Estimated value is indicative, based on typical World Cup travel costs plus golf — your confirmed quote will follow once details are finalised.');
  lines.push('');
  lines.push('Warm regards,');
  lines.push('The Golf Travel Group Team');
  lines.push('');
  lines.push('Golf Travel Group | golftravel.group');

  return lines.join('\n');
}

export function timeAgo(ts) {
  const s = Math.round((Date.now() - ts) / 1000);
  if (s < 60) return 'just now';
  const m = Math.round(s / 60);
  return m === 1 ? '1 min ago' : `${m} mins ago`;
}
