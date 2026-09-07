(function () {
    "use strict";

    function loadRazorpay() {
        if (window.Razorpay) return Promise.resolve();

        return new Promise((resolve, reject) => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = resolve;
            script.onerror = () => reject(new Error("Unable to load payment gateway."));
            document.head.appendChild(script);
        });
    }

    window.PawPalPayments = {
        async start({ amount, description, purpose, onSuccess, onError }) {
            try {
                const orderResponse = await fetch("/api/payments/order", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ amount, description, purpose })
                });
                const order = await orderResponse.json();

                if (!orderResponse.ok || !order.success) {
                    throw new Error(order.message || "Unable to start payment.");
                }

                await loadRazorpay();

                const checkout = new Razorpay({
                    key: order.keyId,
                    amount: order.amount,
                    currency: order.currency,
                    name: "PawPal",
                    description: description || "PawPal payment",
                    order_id: order.orderId,
                    theme: { color: "#d86b45" },
                    handler: async (response) => {
                        const verifyResponse = await fetch("/api/payments/verify", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                orderId: response.razorpay_order_id,
                                paymentId: response.razorpay_payment_id,
                                signature: response.razorpay_signature
                            })
                        });
                        const verification = await verifyResponse.json();
                        if (!verifyResponse.ok || !verification.success) {
                            throw new Error(verification.message || "Payment verification failed.");
                        }
                        onSuccess?.(response);
                    },
                    modal: { ondismiss: () => onError?.(new Error("Payment cancelled.")) }
                });

                checkout.open();
            } catch (error) {
                onError?.(error);
            }
        }
    };
})();