import { Router } from "express";
import { Resend } from "resend";

const router = Router();

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  image?: string;
}

interface NotifyOrderBody {
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    address: string;
    postalCode: string;
    city: string;
    country: string;
  };
  items: OrderItem[];
  shippingMethod: { name: string; price: number };
  subtotal: number;
  total: number;
  paypalOrderId?: string;
}

router.post("/notify-order", async (req, res) => {
  const apiKey = process.env["RESEND_API_KEY"];
  if (!apiKey) {
    res.status(500).json({ error: "RESEND_API_KEY non configurée" });
    return;
  }

  const body = req.body as NotifyOrderBody;
  const { customer, items, shippingMethod, subtotal, total, paypalOrderId } = body;

  const resend = new Resend(apiKey);

  const itemsHtml = items
    .map(
      (item) => `
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #f0e8e0;font-family:Georgia,serif;color:#5a3e3e;">${item.name}</td>
        <td style="padding:10px 0;border-bottom:1px solid #f0e8e0;text-align:center;color:#5a3e3e;">${item.quantity}</td>
        <td style="padding:10px 0;border-bottom:1px solid #f0e8e0;text-align:right;color:#5a3e3e;">${(item.price * item.quantity).toFixed(2).replace(".", ",")}€</td>
      </tr>`
    )
    .join("");

  const html = `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#fdfaf7;font-family:Arial,sans-serif;">
  <div style="max-width:600px;margin:40px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 2px 20px rgba(90,62,62,0.1);">
    
    <!-- Header -->
    <div style="background:linear-gradient(135deg,#7d3c5a,#a8607a);padding:32px 40px;text-align:center;">
      <h1 style="margin:0;color:#fff;font-family:Georgia,serif;font-size:28px;letter-spacing:1px;">Créations du Monde</h1>
      <p style="margin:8px 0 0;color:rgba(255,255,255,0.85);font-size:14px;">✨ Nouvelle commande reçue !</p>
    </div>

    <div style="padding:32px 40px;">

      <!-- Résumé rapide -->
      <div style="background:#fdf4ee;border-left:4px solid #a8607a;border-radius:8px;padding:16px 20px;margin-bottom:28px;">
        <p style="margin:0;font-size:15px;color:#5a3e3e;">
          <strong>${customer.firstName} ${customer.lastName}</strong> vient de passer une commande de <strong>${total.toFixed(2).replace(".", ",")}€</strong>
          ${paypalOrderId ? `<br><span style="font-size:12px;color:#888;">Ref. PayPal : ${paypalOrderId}</span>` : ""}
        </p>
      </div>

      <!-- Articles commandés -->
      <h2 style="font-family:Georgia,serif;color:#7d3c5a;font-size:18px;margin:0 0 12px;border-bottom:2px solid #f0e8e0;padding-bottom:8px;">🛍️ Articles commandés</h2>
      <table style="width:100%;border-collapse:collapse;margin-bottom:28px;">
        <thead>
          <tr style="background:#fdf4ee;">
            <th style="padding:10px;text-align:left;font-size:12px;color:#888;font-weight:normal;">Article</th>
            <th style="padding:10px;text-align:center;font-size:12px;color:#888;font-weight:normal;">Qté</th>
            <th style="padding:10px;text-align:right;font-size:12px;color:#888;font-weight:normal;">Prix</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="2" style="padding:10px 0;color:#888;font-size:13px;">Sous-total</td>
            <td style="padding:10px 0;text-align:right;color:#5a3e3e;">${subtotal.toFixed(2).replace(".", ",")}€</td>
          </tr>
          <tr>
            <td colspan="2" style="padding:10px 0;color:#888;font-size:13px;">Livraison (${shippingMethod.name})</td>
            <td style="padding:10px 0;text-align:right;color:#5a3e3e;">${shippingMethod.price.toFixed(2).replace(".", ",")}€</td>
          </tr>
          <tr style="background:#fdf4ee;border-radius:8px;">
            <td colspan="2" style="padding:12px 10px;font-family:Georgia,serif;font-weight:bold;color:#7d3c5a;font-size:16px;">TOTAL</td>
            <td style="padding:12px 10px;text-align:right;font-family:Georgia,serif;font-weight:bold;color:#7d3c5a;font-size:18px;">${total.toFixed(2).replace(".", ",")}€</td>
          </tr>
        </tfoot>
      </table>

      <!-- Adresse de livraison -->
      <h2 style="font-family:Georgia,serif;color:#7d3c5a;font-size:18px;margin:0 0 12px;border-bottom:2px solid #f0e8e0;padding-bottom:8px;">📦 Adresse de livraison — Bon d'envoi Mondial Relay</h2>
      <div style="background:#f9f5f0;border:2px dashed #c9a080;border-radius:12px;padding:20px 24px;margin-bottom:28px;font-size:15px;line-height:1.9;color:#3a2a2a;">
        <strong style="font-size:16px;">${customer.firstName.toUpperCase()} ${customer.lastName.toUpperCase()}</strong><br>
        ${customer.address}<br>
        ${customer.postalCode} ${customer.city}<br>
        ${customer.country}<br>
        <span style="font-size:13px;color:#888;">Email : ${customer.email}</span>
      </div>
      <p style="font-size:13px;color:#888;margin-top:-16px;margin-bottom:28px;">
        👉 Copiez cette adresse sur <a href="https://www.mondialrelay.fr/mes-envois/" style="color:#a8607a;">mondialrelay.fr → Mes envois</a> pour générer votre bon d'envoi.
      </p>

      <!-- Infos contact client -->
      <h2 style="font-family:Georgia,serif;color:#7d3c5a;font-size:18px;margin:0 0 12px;border-bottom:2px solid #f0e8e0;padding-bottom:8px;">👤 Contact client</h2>
      <table style="width:100%;font-size:14px;color:#5a3e3e;margin-bottom:28px;">
        <tr><td style="padding:6px 0;color:#888;width:120px;">Nom</td><td><strong>${customer.firstName} ${customer.lastName}</strong></td></tr>
        <tr><td style="padding:6px 0;color:#888;">Email</td><td><a href="mailto:${customer.email}" style="color:#a8607a;">${customer.email}</a></td></tr>
        <tr><td style="padding:6px 0;color:#888;">Adresse</td><td>${customer.address}, ${customer.postalCode} ${customer.city}</td></tr>
      </table>

    </div>

    <!-- Footer -->
    <div style="background:#fdf4ee;padding:20px 40px;text-align:center;border-top:1px solid #f0e8e0;">
      <p style="margin:0;font-size:12px;color:#aaa;">Créations du Monde • raphanoute.lecuyer94@gmail.com</p>
    </div>
  </div>
</body>
</html>`;

  try {
    const { error } = await resend.emails.send({
      from: "Créations du Monde <onboarding@resend.dev>",
      to: ["raphanoute.lecuyer94@gmail.com"],
      subject: `🛍️ Nouvelle commande — ${customer.firstName} ${customer.lastName} (${total.toFixed(2).replace(".", ",")}€)`,
      html,
    });

    if (error) {
      console.error("Resend error:", error);
      res.status(500).json({ error: error.message });
      return;
    }

    res.json({ success: true });
  } catch (err) {
    console.error("Email send failed:", err);
    res.status(500).json({ error: "Échec de l'envoi de l'email" });
  }
});

export default router;
