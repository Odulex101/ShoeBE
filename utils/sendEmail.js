import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

/**
 * 🔐 Verification email (existing logic)
 */
export const sendVerificationEmail = async (to, code) => {
    await transporter.sendMail({
        from: `"Shop Login" <${process.env.EMAIL_USER}>`,
        to,
        subject: "Your verification code",
        html: `
      <h2>${code}</h2>
      <p>This code expires in 10 minutes.</p>
    `,
    });
};

/**
 * 📦 Order confirmation email (NEW)
 */
export const orderConfirmationEmail = ({
    pickupStation,
    totalAmount,
}) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Order Confirmed</title>
</head>
<body style="margin:0; padding:0; background-color:#f5f7fa; font-family:Arial, Helvetica, sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f7fa; padding:20px;">
    <tr>
      <td align="center">

        <!-- Card -->
        <table width="100%" max-width="520" cellpadding="0" cellspacing="0"
          style="background:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.1);">

          <!-- Header -->
          <tr>
            <td style="background:#000000; padding:16px; text-align:center;">
              <h1 style="color:#ffffff; margin:0; font-size:20px; letter-spacing:1px;">
                TEMORAH <span style="color:#38bdf8;">DESIGNS</span>
              </h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px; color:#000000;">
              <h2 style="margin-top:0; text-align:center; font-size:22px;">
                🎉 Thank you for your order!
              </h2>

              <p style="text-align:center; font-size:14px; color:#555;">
                Your order has been successfully placed and is being processed.
              </p>

              <!-- Order Summary -->
              <table width="100%" cellpadding="0" cellspacing="0"
                style="margin-top:25px; border-collapse:collapse;">
                <tr>
                  <td style="padding:12px 0; font-size:14px;">
                    <strong>Pickup Station</strong>
                  </td>
                  <td style="padding:12px 0; font-size:14px; text-align:right;">
                    ${pickupStation}
                  </td>
                </tr>

                <tr>
                  <td style="padding:12px 0; font-size:14px;">
                    <strong>Total Amount</strong>
                  </td>
                  <td style="padding:12px 0; font-size:16px; font-weight:bold; text-align:right; color:#dc2626;">
                    ₦${totalAmount.toLocaleString()}
                  </td>
                </tr>
              </table>

              <!-- Divider -->
              <div style="height:1px; background:#e5e7eb; margin:25px 0;"></div>

              <p style="font-size:14px; color:#444; text-align:center;">
                We’ll notify you as soon as your order is ready for pickup.
              </p>

              <p style="font-size:13px; color:#666; text-align:center;">
                Thank you for shopping with us 💙
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f8fafc; padding:15px; text-align:center; font-size:12px; color:#666;">
              Need help? Contact our support team anytime.
              <br />
              <span style="color:#38bdf8;">
                © ${new Date().getFullYear()} Temorah Designs
              </span>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
`;

export const sendOrderConfirmationEmail = async ({
    to,
    pickupStation,
    totalAmount,
}) => {
    await transporter.sendMail({
        from: `"Shoe Store" <${process.env.EMAIL_USER}>`,
        to,
        subject: "Order Confirmed 🎉",
        html: orderConfirmationEmail({
            pickupStation,
            totalAmount
        })
    });
};
