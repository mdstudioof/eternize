import { Hono } from "hono";
import {
  exchangeCodeForSessionToken,
  getOAuthRedirectUrl,
  authMiddleware,
  deleteSession,
  MOCHA_SESSION_TOKEN_COOKIE_NAME,
} from "@getmocha/users-service/backend";
import { getCookie, setCookie } from "hono/cookie";
import Stripe from "stripe";
import QRCode from "qrcode";

declare global {
  interface Env {
    STRIPE_SECRET_KEY: string;
    STRIPE_WEBHOOK_SECRET: string;
    MOCHA_USERS_SERVICE_API_URL: string;
    MOCHA_USERS_SERVICE_API_KEY: string;


    R2_BUCKET: R2Bucket;

    DB: D1Database;


  }
}

const app = new Hono<{ Bindings: Env }>();

// Get OAuth redirect URL
app.get("/api/oauth/google/redirect_url", async (c) => {
  const redirectUrl = await getOAuthRedirectUrl("google", {
    apiUrl: c.env.MOCHA_USERS_SERVICE_API_URL,
    apiKey: c.env.MOCHA_USERS_SERVICE_API_KEY,
  });

  return c.json({ redirectUrl }, 200);
});

// Exchange code for session token
app.post("/api/sessions", async (c) => {
  const body = await c.req.json();

  if (!body.code) {
    return c.json({ error: "No authorization code provided" }, 400);
  }

  const sessionToken = await exchangeCodeForSessionToken(body.code, {
    apiUrl: c.env.MOCHA_USERS_SERVICE_API_URL,
    apiKey: c.env.MOCHA_USERS_SERVICE_API_KEY,
  });

  setCookie(c, MOCHA_SESSION_TOKEN_COOKIE_NAME, sessionToken, {
    httpOnly: true,
    path: "/",
    sameSite: "none",
    secure: true,
    maxAge: 60 * 24 * 60 * 60, // 60 days
  });

  return c.json({ success: true }, 200);
});

// Get current user
app.get("/api/users/me", authMiddleware, async (c) => {
  return c.json(c.get("user"));
});

// Logout
app.get("/api/logout", async (c) => {
  const sessionToken = getCookie(c, MOCHA_SESSION_TOKEN_COOKIE_NAME);

  if (typeof sessionToken === "string") {
    await deleteSession(sessionToken, {
      apiUrl: c.env.MOCHA_USERS_SERVICE_API_URL,
      apiKey: c.env.MOCHA_USERS_SERVICE_API_KEY,
    });
  }

  setCookie(c, MOCHA_SESSION_TOKEN_COOKIE_NAME, "", {
    httpOnly: true,
    path: "/",
    sameSite: "none",
    secure: true,
    maxAge: 0,
  });

  return c.json({ success: true }, 200);
});

// Create Stripe checkout session
app.post("/api/checkout/create-session", authMiddleware, async (c) => {
  const user = c.get("user");
  if (!user) {
    return c.json({ error: "Unauthorized" }, 401);
  }
  
  const { memorialId } = await c.req.json();

  if (!memorialId) {
    return c.json({ error: "Memorial ID is required" }, 400);
  }

  // Verify memorial belongs to user
  const memorial = await c.env.DB.prepare(
    "SELECT id, title FROM memorials WHERE id = ? AND user_id = ?"
  )
    .bind(memorialId, user.id)
    .first();

  if (!memorial) {
    return c.json({ error: "Memorial not found" }, 404);
  }

  const stripe = new Stripe(c.env.STRIPE_SECRET_KEY);

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "brl",
          product_data: {
            name: "Plano Premium EternoQR",
            description: `Memorial: ${memorial.title}`,
          },
          unit_amount: 2990, // R$ 29,90
        },
        quantity: 1,
      },
    ],
    success_url: `${new URL(c.req.url).origin}/success?memorial_id=${memorialId}`,
    cancel_url: `${new URL(c.req.url).origin}/checkout?memorial_id=${memorialId}`,
    metadata: {
      memorialId: memorialId.toString(),
      userId: user.id,
    },
  });

  return c.json({ url: session.url });
});

// Stripe webhook handler
app.post("/api/webhooks/stripe", async (c) => {
  const body = await c.req.text();
  const sig = c.req.header("stripe-signature") || "";

  const stripe = new Stripe(c.env.STRIPE_SECRET_KEY);

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      c.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return c.json({ error: "Invalid signature" }, 400);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const memorialId = session.metadata?.memorialId;
    const userId = session.metadata?.userId;

    if (memorialId && userId) {
      // Generate unique QR code ID
      const qrCodeId = `qr_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;

      // Update memorial with payment status and QR code ID
      await c.env.DB.prepare(
        "UPDATE memorials SET has_paid = 1, qr_code_id = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?"
      )
        .bind(qrCodeId, memorialId, userId)
        .run();
    }
  }

  return c.json({ received: true }, 200);
});

// Get QR code for memorial
app.get("/api/memorials/:id/qr-code", async (c) => {
  const id = c.req.param("id");

  const memorial = await c.env.DB.prepare(
    "SELECT id, qr_code_id, has_paid FROM memorials WHERE id = ?"
  )
    .bind(id)
    .first();

  if (!memorial) {
    return c.json({ error: "Memorial not found" }, 404);
  }

  if (!memorial.has_paid || !memorial.qr_code_id) {
    return c.json({ error: "QR code not available - payment required" }, 403);
  }

  // Generate QR code that points to the memorial view page
  const memorialUrl = `${new URL(c.req.url).origin}/memorial/${memorial.qr_code_id}`;
  
  try {
    const qrCodeDataUrl = await QRCode.toDataURL(memorialUrl, {
      width: 500,
      margin: 2,
      color: {
        dark: "#7C3AED",
        light: "#FFFFFF",
      },
    });

    return c.json({ qrCodeDataUrl, memorialUrl });
  } catch (err) {
    console.error("Error generating QR code:", err);
    return c.json({ error: "Failed to generate QR code" }, 500);
  }
});

// View memorial by QR code ID (public endpoint)
app.get("/api/memorials/view/:qrCodeId", async (c) => {
  const qrCodeId = c.req.param("qrCodeId");

  const memorial = await c.env.DB.prepare(
    "SELECT id, title, description, profile_image_key, created_at FROM memorials WHERE qr_code_id = ? AND has_paid = 1"
  )
    .bind(qrCodeId)
    .first();

  if (!memorial) {
    return c.json({ error: "Memorial not found" }, 404);
  }

  // Get profile image URL if exists
  let profile_image_url = null;
  if (memorial.profile_image_key) {
    const profileImage = await c.env.R2_BUCKET.get(memorial.profile_image_key as string);
    if (profileImage) {
      const arrayBuffer = await profileImage.arrayBuffer();
      const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
      profile_image_url = `data:${profileImage.httpMetadata?.contentType || 'image/jpeg'};base64,${base64}`;
    }
  }

  // Get gallery images
  const imagesResult = await c.env.DB.prepare(
    "SELECT id, file_key, file_name, file_type FROM memorial_images WHERE memorial_id = ?"
  )
    .bind(memorial.id)
    .all();

  const images = await Promise.all(
    (imagesResult.results || []).map(async (img: any) => {
      const file = await c.env.R2_BUCKET.get(img.file_key as string);
      if (file) {
        const arrayBuffer = await file.arrayBuffer();
        const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
        return {
          id: img.id,
          url: `data:${img.file_type};base64,${base64}`,
          file_name: img.file_name,
          file_type: img.file_type,
        };
      }
      return null;
    })
  ).then((results) => results.filter(Boolean));

  // Get videos
  const videosResult = await c.env.DB.prepare(
    "SELECT id, file_key, file_name, file_type FROM memorial_videos WHERE memorial_id = ?"
  )
    .bind(memorial.id)
    .all();

  const videos = await Promise.all(
    (videosResult.results || []).map(async (vid: any) => {
      const file = await c.env.R2_BUCKET.get(vid.file_key as string);
      if (file) {
        const arrayBuffer = await file.arrayBuffer();
        const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
        return {
          id: vid.id,
          url: `data:${vid.file_type};base64,${base64}`,
          file_name: vid.file_name,
          file_type: vid.file_type,
        };
      }
      return null;
    })
  ).then((results) => results.filter(Boolean));

  // Get audios
  const audiosResult = await c.env.DB.prepare(
    "SELECT id, file_key, file_name, file_type FROM memorial_audios WHERE memorial_id = ?"
  )
    .bind(memorial.id)
    .all();

  const audios = await Promise.all(
    (audiosResult.results || []).map(async (aud: any) => {
      const file = await c.env.R2_BUCKET.get(aud.file_key as string);
      if (file) {
        const arrayBuffer = await file.arrayBuffer();
        const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
        return {
          id: aud.id,
          url: `data:${aud.file_type};base64,${base64}`,
          file_name: aud.file_name,
          file_type: aud.file_type,
        };
      }
      return null;
    })
  ).then((results) => results.filter(Boolean));

  return c.json({
    memorial: {
      id: memorial.id,
      title: memorial.title,
      description: memorial.description,
      profile_image_url,
      created_at: memorial.created_at,
    },
    images,
    videos,
    audios,
  });
});

export default app;
