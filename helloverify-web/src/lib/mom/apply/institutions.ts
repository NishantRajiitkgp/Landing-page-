/** Demo institution directory for `GET /api/mom/apply/institutions`. `listed`
 *  marks the institutions on MOM's list; live mode asks the upstream instead.
 *  DEMO DATA: a sample, not MOM's published list. */
import "server-only";

import type { Institution } from "./types";

const LISTED: [string, string][] = [
  ["National University of Singapore", "SG"],
  ["Nanyang Technological University", "SG"],
  ["Singapore Management University", "SG"],
  ["Indian Institute of Technology Bombay", "IN"],
  ["Indian Institute of Technology Delhi", "IN"],
  ["Indian Institute of Technology Madras", "IN"],
  ["Indian Institute of Science", "IN"],
  ["University of Delhi", "IN"],
  ["University of Mumbai", "IN"],
  ["Anna University", "IN"],
  ["Birla Institute of Technology and Science, Pilani", "IN"],
  ["University of the Philippines Diliman", "PH"],
  ["Ateneo de Manila University", "PH"],
  ["De La Salle University", "PH"],
  ["Tsinghua University", "CN"],
  ["Peking University", "CN"],
  ["Fudan University", "CN"],
  ["Zhejiang University", "CN"],
  ["University of Malaya", "MY"],
  ["Universiti Kebangsaan Malaysia", "MY"],
  ["Universiti Teknologi Malaysia", "MY"],
  ["Bandung Institute of Technology", "ID"],
  ["Gadjah Mada University", "ID"],
  ["Chulalongkorn University", "TH"],
  ["Mahidol University", "TH"],
  ["University of Dhaka", "BD"],
  ["Bangladesh University of Engineering and Technology", "BD"],
  ["University of Colombo", "LK"],
  ["University of Oxford", "GB"],
  ["University of Cambridge", "GB"],
  ["Imperial College London", "GB"],
  ["University of Melbourne", "AU"],
  ["University of Sydney", "AU"],
  ["Massachusetts Institute of Technology", "US"],
  ["Stanford University", "US"],
];

const UNLISTED: [string, string][] = [
  ["Visvesvaraya Technological University", "IN"],
  ["Jawaharlal Nehru Technological University", "IN"],
  ["Osmania University", "IN"],
  ["University of Calicut", "IN"],
  ["Savitribai Phule Pune University", "IN"],
  ["Mapúa University", "PH"],
  ["Polytechnic University of the Philippines", "PH"],
  ["Universitas Indonesia", "ID"],
  ["Vietnam National University, Hanoi", "VN"],
  ["Hanoi University of Science and Technology", "VN"],
  ["University of Yangon", "MM"],
  ["Tribhuvan University", "NP"],
  ["University of the Punjab", "PK"],
  ["Coventry University", "GB"],
];

const DIRECTORY: Institution[] = [
  ...LISTED.map(([name, country]) => ({ name, country, listed: true })),
  ...UNLISTED.map(([name, country]) => ({ name, country, listed: false })),
];

export const fold = (s: string) =>
  s
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const INDEX = DIRECTORY.map((inst) => ({ inst, key: fold(inst.name) }));

/** Every query word must start a word of the name; prefix matches rank first. */
export function searchDemoInstitutions(query: string, limit = 8): Institution[] {
  const words = fold(query).split(" ").filter(Boolean);
  if (!words.length) return [];
  const q = words.join(" ");
  return INDEX.filter(({ key }) => {
    const parts = key.split(" ");
    return words.every((w) => parts.some((p) => p.startsWith(w)));
  })
    .sort((a, b) => Number(b.key.startsWith(q)) - Number(a.key.startsWith(q)) || a.key.localeCompare(b.key))
    .slice(0, limit)
    .map(({ inst }) => inst);
}
