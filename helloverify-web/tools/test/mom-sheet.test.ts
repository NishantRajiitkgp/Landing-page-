/** Candidate CSV / paste / Excel-cell import for the MOM employer batch.
 *  The files in `tools/fixtures/mom-batch` are the same sheets an employer
 *  can upload. Excel's own cell types (a real date, a day serial) are passed
 *  in as the reader returns them. */
import { readFileSync, readdirSync } from "node:fs";

import { toCountry, toDay, toPass } from "../../src/lib/mom/org/cells.ts";
import { importRows, parseDelimited } from "../../src/lib/mom/org/sheet.ts";

import { check } from "./harness.ts";

const dir = new URL("../fixtures/mom-batch/", import.meta.url);
const csv = (name: string) => readFileSync(new URL(name, dir), "utf8");
const load = (name: string) => importRows(parseDelimited(csv(name)), []).candidates;

console.log("1. a clean sheet, in the template's own columns");
{
  const list = load("01-clean.csv");
  check("three candidates", list.length === 3, list.length);
  check("Indian nationality and employment pass", list[0].nationality === "IN" && list[0].passType === "EP");
  check("ISO date of birth", list[0].dob === "1990-08-15", list[0].dob);
  check("month from a full date", list[0].quals[0].start === "2008-08" && list[0].quals[0].end === "2012-05");
  check("Chinese and a master's", list[1].nationality === "CN" && list[1].quals[0].level === "master");
  check("day-first expiry", list[2].passportExpiry === "2031-03-04", list[2].passportExpiry);
}

console.log("2. headings renamed and reordered");
{
  const [c] = load("02-shuffled-aliases.csv");
  check("name and passport survived the shuffle", c.fullName === "Ravi Kumar" && c.passportNo === "R1234567", c);
  check("B.Tech, S-Pass, Republic of India", c.passType === "SP" && c.quals[0].level === "bachelor" && c.nationality === "IN" && c.quals[0].country === "IN", c);
}

console.log("3. dates, passes and addresses written several ways");
{
  const [priya, jose] = load("03-messy-dates-passes.csv");
  check("quoted comma stays inside the name", priya.fullName === "Menon, Priya", priya.fullName);
  check("mailto and spaces leave a real email", priya.email === "priya@example.com" && jose.email === "jose@example.com", [priya.email, jose.email]);
  check("passport spaces are ignored", priya.passportNo === "K1234567", priya.passportNo);
  check("U.S.A. and 15th August 1990", priya.nationality === "US" && priya.dob === "1990-08-15", priya);
  check("two-digit expiry year", priya.passportExpiry === "2030-08-15", priya.passportExpiry);
  check("SPass and S Pass (skilled)", priya.passType === "SP" && jose.passType === "SP");
  check("15-Aug-90 and a non-English flag", jose.dob === "1990-08-15" && jose.quals[0].english === false, jose);
}

console.log("4. a second degree on the next row, with the name left blank");
{
  const [ana] = load("04-second-degree.csv");
  check("one candidate, two qualifications", ana.quals.length === 2 && ana.quals[1].course === "Public Health", ana.quals.map((q) => q.course));
}

console.log("5. semicolon, tab, pipe, and a title row above the headings");
{
  check("semicolon", load("05-semicolon.csv")[0].fullName === "Wei Chen");
  check("tabs pasted from Excel", load("06-pasted-from-excel.tsv")[0].passportNo === "G1234567");
  check("pipes", load("07-pipe.csv")[0].passType === "TEP");
  const titled = load("08-title-and-sep.csv");
  check("the title and the sep= line are not candidates", titled.length === 1 && titled[0].fullName === "Li Na", titled.map((c) => c.fullName));
}

console.log("6. blank rows and the same passport written twice");
{
  const list = load("10-blanks-and-duplicate-passport.csv");
  check("one candidate, first email kept", list.length === 1 && list[0].email === "asha@example.com" && list[0].passportNo === "AB123456", list);
}

console.log("7. the 201st candidate is refused, the first 200 are kept");
{
  const { candidates, report } = importRows(parseDelimited(csv("09-over-200.csv")), []);
  check("200 kept", candidates.length === 200, candidates.length);
  check("10 over the limit", report.added === 200 && report.skipped === 10, report);
}

console.log("8. only two recognised headings still beat column position");
{
  const [c] = importRows(parseDelimited("Name,Passport\nRavi Kumar,R1234567\n"), []).candidates;
  check("passport is not read as the email", c.fullName === "Ravi Kumar" && c.passportNo === "R1234567" && c.email === "", c);
}

console.log("9. Excel cells: a date, a day serial, and a bare year");
{
  const { candidates } = importRows(
    [
      ["Full name", "Passport number", "Date of birth", "Passport expiry", "Started"],
      ["Mina Joseph", "M1234567", new Date(Date.UTC(1990, 7, 15)), 47870, 2012],
    ],
    [],
  );
  const c = candidates[0];
  check("date cell and serial", c.dob === "1990-08-15" && c.passportExpiry === "2031-01-22", c);
  check("a bare year asks for the month", c.quals[0].start === "2012-", c.quals[0].start);
}

console.log("10. day-first, and a country written as a demonym");
check("03/04/1990 is 3 April", toDay("03/04/1990") === "1990-04-03");
check("Filipino and PRC", toCountry("Filipino") === "PH" && toCountry("PRC") === "CN");
check("an unknown pass is left blank", toPass("Work Permit") === "");

console.log("11. every fixture parses");
for (const name of readdirSync(dir)) {
  const rows = parseDelimited(csv(name));
  check(`${name} has a header and at least one row`, rows.length >= 2, rows.length);
}
