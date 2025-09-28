import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getAdminDb, getAdminAuth } from "@/lib/firebase/admin";
import { UserDashboard } from "@/types/dashboard";

const upsertSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  widgets: z
    .array(
      z.object({
        id: z.string(),
        type: z.string(),
        x: z.number().int().nonnegative(),
        y: z.number().int().nonnegative(),
        w: z.number().int().positive(),
        h: z.number().int().positive(),
        props: z.record(z.string(), z.any()).optional(),
      })
    )
    .default([]),
  isDefault: z.boolean().optional(),
});

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const token = authHeader.replace(/^Bearer\s+/i, "");
    const decoded = await getAdminAuth().verifyIdToken(token);
    const db = getAdminDb();
    const userId = decoded.uid;
    const snap = await db
      .collection("users")
      .doc(userId)
      .collection("dashboards")
      .orderBy("updatedAt", "desc")
      .get();
    const items: UserDashboard[] = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
    return NextResponse.json({ dashboards: items });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Failed to fetch dashboards" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, name, widgets, isDefault } = upsertSchema.parse(body);
    const db = getAdminDb();
    const authHeader = req.headers.get("authorization");
    if (!authHeader) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const token = authHeader.replace(/^Bearer\s+/i, "");
    const decoded = await getAdminAuth().verifyIdToken(token);
    const userId = decoded.uid;
    const collection = db.collection("users").doc(userId).collection("dashboards");

    let ref = id ? collection.doc(id) : collection.doc();
    const doc: Partial<UserDashboard> = {
      name,
      widgets,
      isDefault: Boolean(isDefault),
      // store ISO strings for simplicity; Firestore Timestamp also ok
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as any;

    await ref.set(doc as any, { merge: true });
    const result = await ref.get();
    return NextResponse.json({ id: ref.id, ...(result.data() as any) });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Failed to save dashboard" }, { status: 400 });
  }
}

