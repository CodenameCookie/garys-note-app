import { json, type ActionFunctionArgs, type LoaderFunctionArgs } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import db from "../db.server";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Authorization, Content-Type",
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  const { session, cors } = await authenticate.admin(request);
  const url = new URL(request.url);
  const resourceId = url.searchParams.get("resourceId");
  const resourceType = url.searchParams.get("resourceType");

  if (!resourceId || !resourceType) {
    return cors(json({ error: "Missing resourceId or resourceType" }, { status: 400 }));
  }

  const note = await db.internalNote.findUnique({
    where: {
      shop_resourceType_resourceId: {
        shop: session.shop,
        resourceType,
        resourceId,
      },
    },
  });

  return cors(json({ note: note?.content || "" }));
};

export const action = async ({ request }: ActionFunctionArgs) => {
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  const { session, cors } = await authenticate.admin(request);

  const data = await request.json();
  const { resourceId, resourceType, content } = data;

  if (!resourceId || !resourceType) {
    return cors(json({ error: "Missing resourceId or resourceType" }, { status: 400 }));
  }

  const note = await db.internalNote.upsert({
    where: {
      shop_resourceType_resourceId: {
        shop: session.shop,
        resourceType,
        resourceId,
      },
    },
    update: { content },
    create: {
      shop: session.shop,
      resourceType,
      resourceId,
      content,
    },
  });

  return cors(json({ note: note.content }));
};
