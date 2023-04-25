
import React, { useState } from "react";

function Esewa() {
    const [amount] = useState(1000);

    const handleEsewaPayment = () => {
        // Initialize eSewa payment
        const payment = new window.eSewaPayment({
            productId: "1234567890",
            productName: "Dragon",
            productAmount: "1000",
            taxAmount: "0",
            totalAmount: "1000",
            merchantName: "Game of Thrones",
            merchantId: "merchantId",
            callbackUrl: "http://localhost:3000/payment/success",
            failureUrl: "http://localhost:3000/payment/failure",
            cancelUrl: "http://localhost:3000/payment/cancel",
        });

        // Open eSewa payment popup
        payment.showPaymentUI();
    };

    return (
        <div>

            <div className="form-group">
                <label htmlFor="paymentMethod">Pay:</label>
            </div>

            <button type="button" onClick={handleEsewaPayment}>
                Pay with Esewa
            </button>

        </div>
    );
}

export default Esewa;

