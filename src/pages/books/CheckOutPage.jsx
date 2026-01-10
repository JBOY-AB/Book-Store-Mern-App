import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Swal from "sweetalert2";

const CheckoutPage = () => {
  /* ================= REDUX & AUTH ================= */
  const cartItems = useSelector((state) => state.cart.cartItems);
  const totalPrice = cartItems
    .reduce((acc, item) => acc + item.newPrice, 0)
    .toFixed(2);

  const { currentUser } = useAuth();
  const navigate = useNavigate();

  /* ================= FORM ================= */
  const { register, watch } = useForm();
  const [isChecked, setIsChecked] = useState(false);

  /* ================= PAYSTACK PAYMENT ================= */
  const handlePaystackPayment = () => {
    if (!currentUser?.email) {
      Swal.fire("Error", "Please login to continue", "error");
      return;
    }

    if (!isChecked) {
      Swal.fire("Error", "Please accept Terms & Conditions", "error");
      return;
    }

    const paystackKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;

    if (!paystackKey) {
      Swal.fire("Error", "Paystack key not found", "error");
      return;
    }

    const handler = window.PaystackPop.setup({
      key: paystackKey,
      email: currentUser.email,
      amount: Number(totalPrice) * 100, // Kobo
      currency: "NGN",

      callback: function (response) {
        handlePaymentSuccess(response.reference);
      },

      onClose: function () {
        Swal.fire("Payment cancelled", "", "info");
      },
    });

    handler.openIframe();
  };

  /* ================= VERIFY PAYMENT & CREATE ORDER ================= */
  const handlePaymentSuccess = async (reference) => {
    const orderData = {
      name: watch("name"),
      email: currentUser.email,
      phone: watch("phone"),
      address: {
        city: watch("city"),
        country: watch("country"),
        state: watch("state"),
        zipcode: watch("zipcode"),
      },
      productIds: cartItems.map((item) => item._id),
      totalPrice,
    };

    try {
      const response = await fetch(
        "http://localhost:5000/api/payments/verify",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            reference,
            orderData,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        Swal.fire("Error", data.message || "Payment verification failed", "error");
        return;
      }

      Swal.fire("Success", "Payment verified & order placed!", "success");
      navigate("/orders");
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Server error during verification", "error");
    }
  };

  /* ================= UI ================= */
  return (
    <section>
      <div className="min-h-screen p-6 bg-gray-100 flex items-center justify-center">
        <div className="container max-w-screen-lg mx-auto">
          <h2 className="font-semibold text-xl text-gray-600 mb-2">
            Secure Online Payment
          </h2>

          <p className="text-gray-500 mb-2">Total Price: ₦{totalPrice}</p>
          <p className="text-gray-500 mb-6">Items: {cartItems.length}</p>

          <div className="bg-white rounded shadow-lg p-6">
            <form className="grid gap-4 grid-cols-1 md:grid-cols-2">
              <input
                {...register("name", { required: true })}
                placeholder="Full Name"
                className="border p-2 rounded"
              />

              <input
                disabled
                value={currentUser?.email || ""}
                className="border p-2 rounded bg-gray-100"
              />

              <input
                {...register("phone", { required: true })}
                placeholder="Phone Number"
                className="border p-2 rounded"
              />

              <input
                {...register("city", { required: true })}
                placeholder="City"
                className="border p-2 rounded"
              />

              <input
                {...register("state", { required: true })}
                placeholder="State"
                className="border p-2 rounded"
              />

              <input
                {...register("country", { required: true })}
                placeholder="Country"
                className="border p-2 rounded"
              />

              <input
                {...register("zipcode", { required: true })}
                placeholder="Zip Code"
                className="border p-2 rounded"
              />

              <div className="col-span-2">
                <input
                  type="checkbox"
                  onChange={(e) => setIsChecked(e.target.checked)}
                />{" "}
                I agree to the{" "}
                <Link className="underline text-blue-600">
                  Terms & Conditions
                </Link>
              </div>

              <button
                type="button"
                onClick={handlePaystackPayment}
                disabled={!isChecked}
                className="col-span-2 bg-green-600 hover:bg-green-700 text-white py-2 rounded"
              >
                Pay Now
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CheckoutPage;
