/** One-page partner agreement. WinAnsi only, so the signed file stays a
 *  plain English instrument even when the page around it is translated. */

const WIN = /[^\x20-\x7E]/g;

function pdfSafe(value: string): string {
  return value
    .replace(WIN, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/[()\\]/g, (ch) => `\\${ch}`);
}

function wrap(value: string, width: number): string[] {
  const words = pdfSafe(value).split(" ").filter(Boolean);
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (next.length > width && line) {
      lines.push(line);
      line = word;
    } else line = next;
  }
  if (line) lines.push(line);
  return lines.length ? lines : [""];
}

export function agreementPdf(input: {
  k: string;
  parties: string;
  with: string;
  lines: readonly string[];
  sign: string;
  stamp: string;
}): Uint8Array {
  const commands: string[] = [];
  let y = 760;
  const row = (size: number, value: string, gap: number) => {
    commands.push(`BT /F1 ${size} Tf 56 ${y} Td (${pdfSafe(value)}) Tj ET`);
    y -= gap;
  };
  row(20, input.k, 34);
  row(13, input.parties, 20);
  row(12, input.with, 32);
  for (const line of input.lines) {
    for (const part of wrap(line, 84)) row(11, part, 16);
    y -= 8;
  }
  y -= 36;
  row(11, "________________________", 18);
  row(10, input.sign, 40);
  row(11, "________________________", 18);
  row(10, input.stamp, 16);

  const stream = commands.join("\n");
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>",
    `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`,
    "<< /Type /Font /Subtype /Type1 /BaseFont /Times-Roman >>",
  ];
  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  objects.forEach((body, i) => {
    offsets.push(pdf.length);
    pdf += `${i + 1} 0 obj\n${body}\nendobj\n`;
  });
  const xref = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (let i = 1; i < offsets.length; i++) pdf += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`;
  pdf += `trailer << /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  return new TextEncoder().encode(pdf);
}

export function downloadAgreement(filename: string, bytes: Uint8Array) {
  const blob = new Blob([Uint8Array.from(bytes)], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
