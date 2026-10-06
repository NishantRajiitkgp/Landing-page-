/** Information Guide lookups (`/products/immigration`): the old SPA's three
 *  visa back-office calls, made from here so the page keeps `connect-src
 *  'self'`. `GET /api/visa-guide/embassies`, `…/countries?id=<embassy>`,
 *  `…/visa-types?id=<office>`. Only the fields the guide shows go back. */
import {
  VISA_GUIDE_PATHS,
  VISA_GUIDE_UPSTREAM,
  type GuideEmbassy,
  type GuideOffice,
  type GuideVisa,
  type VisaGuideAction,
} from "@/lib/immigration/guide";

export const dynamic = "force-dynamic";

const isAction = (a: string): a is VisaGuideAction => Object.hasOwn(VISA_GUIDE_PATHS, a);

function json(body: unknown, status = 200) {
  return Response.json(body, {
    status,
    headers: status === 200 ? { "Cache-Control": "public, max-age=60, s-maxage=300" } : { "Cache-Control": "no-store" },
  });
}

async function upstream(action: VisaGuideAction, body: Record<string, unknown>): Promise<unknown> {
  const res = await fetch(`${VISA_GUIDE_UPSTREAM}${VISA_GUIDE_PATHS[action]}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) throw new Error(`Upstream ${res.status}`);
  return res.json();
}

type Row = Record<string, unknown>;
const rows = (v: unknown): Row[] => (Array.isArray(v) ? v.filter((x): x is Row => !!x && typeof x === "object") : []);
const named = <T extends { id: number; name: string }>(x: T) => Number.isFinite(x.id) && x.id > 0 && x.name.trim().length > 0;

export async function GET(req: Request, ctx: { params: Promise<{ action: string }> }) {
  const { action } = await ctx.params;
  if (!isAction(action)) return json({ message: "Unknown lookup" }, 404);

  let id = 0;
  if (action !== "embassies") {
    const raw = new URL(req.url).searchParams.get("id") ?? "";
    if (!/^\d{1,10}$/.test(raw)) return json({ message: "A numeric id is required" }, 400);
    id = Number(raw);
  }

  try {
    if (action === "embassies") {
      const data = (await upstream(action, { agentid: "" })) as Row;
      const list: GuideEmbassy[] = rows(data?.EmbassyList)
        .map((r) => ({ id: Number(r.EmbassyAdminId), name: String(r.EmbassyName ?? "") }))
        .filter(named);
      return json(list);
    }
    if (action === "countries") {
      const data = (await upstream(action, { CustomerId: id })) as Row;
      const list: GuideOffice[] = rows(data?.EmbassyList)
        .map((r) => ({ id: Number(r.EmbassyAdminId), name: String(r.VisaOfficeCity ?? "") }))
        .filter(named);
      return json(list);
    }
    const list: GuideVisa[] = rows(await upstream(action, { EmbassyAdminId: id }))
      .map((r) => ({
        id: Number(r.VisaTypeCategoryId),
        name: String(r.VISA_Type ?? ""),
        subtypes: rows(r.SubCategory)
          .map((c) => ({ id: Number(c.EAVT_AutoId), name: String(c.VisaTypeChildCategory ?? "") }))
          .filter(named),
      }))
      .filter(named);
    return json(list);
  } catch {
    return json({ message: "Lookup failed" }, 502);
  }
}
