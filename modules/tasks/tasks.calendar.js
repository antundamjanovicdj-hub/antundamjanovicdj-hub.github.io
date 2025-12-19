// modules/tasks/tasks.calendar.js
export function exportToCalendar({
  task,
  lang,
  T,
  platform,
  cancel = false
}) {
  const start = new Date(task.date + "T" + task.time);
  if (isNaN(start)) return;

  const end = new Date(start.getTime() + 30 * 60000);
  const uid = `lifekompas-${task.id}@lifekompas`;

  const dt = d =>
    d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

  let method = "PUBLISH";
  let sequenceLine = "";

  if (platform.isIOS || platform.isPixel) {
    method = "REQUEST";
    sequenceLine = `SEQUENCE:${task.seq}\r\n`;
  }

  const alarm =
    !cancel && task.reminder > 0
      ? `BEGIN:VALARM\r\nTRIGGER:-PT${task.reminder}M\r\nACTION:DISPLAY\r\nDESCRIPTION:${task.title}\r\nEND:VALARM\r\n`
      : "";

  const statusLine = cancel ? "STATUS:CANCELLED\r\n" : "";

  const ics =
`BEGIN:VCALENDAR\r
VERSION:2.0\r
METHOD:${method}\r
PRODID:-//LifeKompas//HR\r
BEGIN:VEVENT\r
UID:${uid}\r
${sequenceLine}DTSTAMP:${dt(new Date())}\r
DTSTART:${dt(start)}\r
DTEND:${dt(end)}\r
SUMMARY:${task.title}\r
DESCRIPTION:${T[lang].calendarNote}\r
${statusLine}${alarm}END:VEVENT\r
END:VCALENDAR`;

  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `lifekompas-${task.id}.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
