import { CLASSPLUS_TEST_LIST_URL, CLASSPLUS_HASHKEY } from "@/lib/config";

export type FreeTest = {
  kind: "test";
  name: string;
  category: "Ongoing" | "Completed";
  attemptsAllowed: number;
  attemptedCount: number;
  startTime: number;
  endTime: number | null;
  attemptUrl: string;
};

// Classplus nests some tests inside folders (`type: "folder"`, e.g. "NIMCET
// PYQ's"). A folder isn't attemptable itself — its contents are fetched
// on demand from CLASSPLUS_TEST_LIST_URL/{id} when a student opens it.
export type FreeTestFolder = {
  kind: "folder";
  id: string;
  name: string;
  category: "Ongoing" | "Completed";
  folderCount: number;
  testCount: number;
};

export type FreeTestsItem = FreeTest | FreeTestFolder;

export type FreeTestsResult = {
  items: FreeTestsItem[];
  total: number;
};

type RawClassplusItem = {
  _id?: unknown;
  type?: unknown;
  isFolder?: unknown;
  name?: unknown;
  testCategory?: unknown;
  noOfAttempts?: unknown;
  attemptedCount?: unknown;
  startTime?: unknown;
  endTime?: unknown;
  testUrl?: unknown;
  webUrl?: unknown;
  testCount?: unknown;
  folderCount?: unknown;
};

function mapItem(raw: RawClassplusItem): FreeTestsItem | null {
  if (typeof raw.name !== "string" || !raw.name) return null;
  const category: "Ongoing" | "Completed" = raw.testCategory === "Completed" ? "Completed" : "Ongoing";

  if (raw.type === "folder" || raw.isFolder === true) {
    if (typeof raw._id !== "string" || !raw._id) return null;
    const folderCount = typeof raw.folderCount === "number" ? raw.folderCount : 0;
    const testCount = typeof raw.testCount === "number" ? raw.testCount : 0;
    return {
      kind: "folder",
      id: raw._id,
      name: raw.name,
      category,
      folderCount,
      testCount,
    };
  }

  const attemptUrl =
    typeof raw.testUrl === "string" && raw.testUrl
      ? raw.testUrl
      : typeof raw.webUrl === "string"
        ? raw.webUrl
        : "";
  if (!attemptUrl) return null;

  return {
    kind: "test",
    name: raw.name,
    category,
    attemptsAllowed: typeof raw.noOfAttempts === "number" ? raw.noOfAttempts : 1,
    attemptedCount: typeof raw.attemptedCount === "number" ? raw.attemptedCount : 0,
    startTime: typeof raw.startTime === "number" ? raw.startTime : 0,
    endTime: typeof raw.endTime === "number" && raw.endTime > 0 ? raw.endTime : null,
    attemptUrl,
  };
}

// Server-only: talks to Classplus directly (this is the org's own DIY test
// portal, not a page needing its own auth — Classplus handles login when a
// student opens attemptUrl). Never call this from a Client Component; go
// through /api/free-tests instead so the hashkey stays server-side.
//
// Pass `folderId` (a folder's own id, surfaced to the client only so it can
// be echoed back here) to list a single folder's contents instead of the
// top-level list — same endpoint, Classplus takes the folder id as a path
// segment: `${CLASSPLUS_TEST_LIST_URL}/{folderId}`.
export async function fetchFreeTests({
  limit = 20,
  offset = 0,
  search = "",
  folderId,
}: {
  limit?: number;
  offset?: number;
  search?: string;
  folderId?: string;
}): Promise<FreeTestsResult> {
  const base = folderId ? `${CLASSPLUS_TEST_LIST_URL}/${folderId}` : CLASSPLUS_TEST_LIST_URL;
  const url = new URL(base);
  url.searchParams.set("limit", String(limit));
  url.searchParams.set("offset", String(offset));
  url.searchParams.set("search", search);

  try {
    const res = await fetch(url.toString(), {
      headers: {
        "api-version": "22",
        region: "IN",
        hashkey: CLASSPLUS_HASHKEY,
      },
      cache: "no-store",
    });

    if (!res.ok) return { items: [], total: 0 };

    const json = await res.json();
    const rawItems: RawClassplusItem[] = Array.isArray(json?.data?.testFolderList)
      ? json.data.testFolderList
      : [];
    const total = typeof json?.data?.total === "number" ? json.data.total : rawItems.length;

    const items = rawItems.map(mapItem).filter((t): t is FreeTestsItem => t !== null);

    return { items, total };
  } catch {
    return { items: [], total: 0 };
  }
}
