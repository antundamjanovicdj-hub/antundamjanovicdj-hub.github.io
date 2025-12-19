// modules/tasks/tasks.calendar.js
export function exportToCalendar({ task, lang, T, platform }) {
  const start = new Date(task.date + "T" + task.time);
  if (isNaN(start)) return;

  const end = new Date(start.getTime() + 30 * 60000);
  const uid = `lifekompas-${task.id}@lifekompas`;
  const dt = d => d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

  let method = "PUBLISH";
  let sequenceLine = "";

  if (platform.isIOS) {
    method = "REQUEST";
    sequenceLine = `SEQUENCE:${task.seq}\r\n`;
  } else if (platform.isPixel) {
    sequenceLine = `SEQUENCE:${task.seq}\r\n`;
  }

  const alarm = task.reminder > 0
    ? `BEGIN:VALARM\r\nTRIGGER:-PT${task.reminder}M\r\nACTION:DISPLAY\r\nDESCRIPTION:${task.title}\r\nEND:VALARM\r\n`
    : "";

  const ics =
`BEGIN:VCALENDAR\r\nVERSION:2.0\r\nMETHOD:${method}\r\nPRODID:-//LifeKompas//HR\r\nBEGIN:VEVENT\r\nUID:${uid}\r\n${sequenceLine}DTSTAMP:${dt(new Date())}\r\nSUMMARY:${task.title}\r\nDTSTART:${dt(start)}\r\nDTEND:${dt(end)}\r\nDESCRIPTION:${T[lang].calendarNote}\r\n${alarm}END:VEVENT\r\nEND:VCALENDAR`;

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

