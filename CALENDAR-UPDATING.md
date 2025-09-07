# Calendar Updating Guide (Admins)

This project pulls events from the public Google Calendar for the club.

- Google account: `ccricyberknightclub@gmail.com`
- Public ICS: set in `index.html` as `CALENDAR_ICS_URL`
- Optional Google embed: set in `index.html` as `CALENDAR_EMBED_URL`

## Update the Calendar Contents

1. Open Google Calendar as the club account
2. Add or edit events as needed
   - Include Zoom link in the event URL field or in the description
   - For recurring meetings, use weekly recurrence (choose days and interval)
3. Save the event(s)
4. Wait up to ~3–4 hours for the public ICS feed to refresh
   - Tip: You can sometimes force a quicker refresh by adjusting event details, but Google controls the cadence

## Change Which Calendar Is Used by the Website

1. In Google Calendar → Settings → Integrate calendar
   - Copy the "Public address in iCal format" (ends with `/public/basic.ics`)
   - Optional: copy the "Embed code" URL
2. In this repo, open `index.html` and update the constants:

```
const CALENDAR_ICS_URL = "https://calendar.google.com/calendar/ical/<CALENDAR_ID>/public/basic.ics";
const CALENDAR_EMBED_URL = "https://calendar.google.com/calendar/embed?src=<CALENDAR_ID>&ctz=America/New_York"; // optional
```

3. Commit and push
4. Visit `?page=calendar` to verify the list, FullCalendar grid, and (optionally) the Google embed

## Troubleshooting

- Nothing appears in the list/grid
  - Ensure `CALENDAR_ICS_URL` is correct and publicly accessible
  - Wait for ICS refresh (3–4 hours typical)
  - The page attempts a read-only proxy fallback for CORS. If it still fails, check browser console
- Embed shows but list/grid is empty
  - Likely `CALENDAR_ICS_URL` is missing or blocked; verify constants
- Times look wrong
  - Confirm your calendar’s timezone and the `ctz` parameter in the embed URL
- Recurring meetings missing
  - Ensure recurrence is weekly; site expands weekly `RRULE` into the next ~90 days

## Security Notes

- Public ICS exposes event metadata. Avoid sensitive content in descriptions.
- Prefer Zoom passcodes/waiting rooms when sharing public links.
