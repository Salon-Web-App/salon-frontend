"use client";

import { useState } from "react";
import {
  getBookingStatus,
  requestModifyOtp,
  verifyOtp,
  modifyBooking,
  cancelBooking,
} from "../../lib/api";

export default function StatusPage() {
  const [applicationId, setApplicationId] = useState("");
  const [booking, setBooking] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Edit/cancel requires an OTP sent to the contact used at booking.
  const [action, setAction] = useState(null); // null | "edit" | "cancel"
  const [channel, setChannel] = useState("email");
  const [contact, setContact] = useState("");
  const [otpStage, setOtpStage] = useState("idle"); // idle | sent | verified
  const [code, setCode] = useState("");
  const [verificationToken, setVerificationToken] = useState("");
  const [newStartTime, setNewStartTime] = useState("");
  const [contactError, setContactError] = useState("");

  async function lookup() {
    setError("");
    setBooking(null);
    setLoading(true);
    try {
      const result = await getBookingStatus(applicationId.trim());
      setBooking(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function startAction(kind) {
    setAction(kind);
    setOtpStage("idle");
    setCode("");
    setVerificationToken("");
  }

  async function sendModifyOtp() {
    setError("");
    setLoading(true);
    try {
      await requestModifyOtp(applicationId.trim(), channel, contact);
      setOtpStage("sent");
    } catch (err) {
      setContactError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function verifyModifyOtp() {
    setError("");
    setLoading(true);
    try {
      const { verificationToken: token } = await verifyOtp(contact.trim(), code, "booking_modify");
      setVerificationToken(token);
      setOtpStage("verified");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function submitEdit() {
    setError("");
    setLoading(true);
    try {
      await modifyBooking(applicationId.trim(), {
        startTime: newStartTime,
        verificationToken,
        verifiedContact: contact.trim(),
      });
      await lookup();
      startAction(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function submitCancel() {
    setError("");
    setLoading(true);
    try {
      await cancelBooking(applicationId.trim(), {
        verificationToken,
        verifiedContact: contact.trim(),
      });
      await lookup();
      startAction(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container-app space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">My Booking</h1>

      <div className="flex flex-col sm:flex-row gap-3">
        <input
          className="input-field"
          placeholder="Enter your Application ID (e.g. APP-7F3A2)"
          value={applicationId}
          onChange={(e) => setApplicationId(e.target.value.toUpperCase())}
        />
        <button className="btn-primary" onClick={lookup} disabled={!applicationId || loading}>
          {loading ? "Looking up…" : "Check Status"}
        </button>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {booking && (
        <div className="card space-y-2">
          <p className="font-mono font-semibold text-brand-700">{booking.applicationId}</p>
          <p>
            Status:{" "}
            <span className="font-medium capitalize">{booking.status.replace("_", " ")}</span>
          </p>
          <p>Service: {booking.service}</p>
          {booking.staff && <p>Staff: {booking.staff}</p>}
          <p>When: {new Date(booking.startTime).toLocaleString()}</p>

          {booking.status !== "cancelled" && booking.status !== "completed" && !action && (
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button className="btn-secondary" onClick={() => startAction("edit")}>
                Reschedule
              </button>
              <button className="btn-secondary" onClick={() => startAction("cancel")}>
                Cancel Booking
              </button>
            </div>
          )}
        </div>
      )}

      {action && (
        <div className="card space-y-4">
          <p className="font-medium text-gray-900">
            {action === "edit" ? "Reschedule" : "Cancel"} — verify it&apos;s you first
          </p>

          {otpStage !== "verified" && (
            <>
              <div className="flex gap-3 text-sm">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="channel"
                    checked={channel === "sms"}
                    onChange={() => {
                      setChannel("sms");
                      setContact("");
                    }}
                  />
                  SMS
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="channel"
                    checked={channel === "email"}
                    onChange={() => {
                      setChannel("email");
                      setContact("");
                    }}
                  />
                  Email
                </label>
              </div>

              {otpStage === "idle" && (
                <div className="space-y-3">
                  <label className="block">
                    <span className="text-sm font-medium text-gray-700">
                      {channel === "sms" ? "Phone number used at booking" : "Email used at booking"}
                    </span>

                    <input
                      className="input-field mt-1"
                      type={channel === "sms" ? "tel" : "email"}
                      inputMode={channel === "sms" ? "tel" : "email"}
                      placeholder={channel === "sms" ? "Enter phone number" : "Enter email address"}
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                    />
                  </label>

                  {contactError && <p className="text-sm text-red-600">{contactError}</p>}
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={sendModifyOtp}
                    disabled={!contact || loading}
                  >
                    {loading ? "Sending code…" : "Send verification code"}
                  </button>
                </div>
              )}

              {otpStage === "sent" && (
                <div className="space-y-3">
                  <p className="text-sm text-gray-600">
                    A verification code has been sent to your{" "}
                    {channel === "sms" ? "phone" : "email"}.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      className="input-field sm:max-w-[160px]"
                      inputMode="numeric"
                      maxLength={6}
                      placeholder="6-digit code"
                      value={code}
                      onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                    />

                    <button
                      className="btn-primary"
                      onClick={verifyModifyOtp}
                      disabled={loading || code.length !== 6}
                    >
                      {loading ? "Verifying…" : "Verify"}
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {otpStage === "verified" && action === "edit" && (
            <div className="space-y-3">
              <label className="block">
                <span className="text-sm font-medium text-gray-700">New date &amp; time</span>

                <input
                  type="datetime-local"
                  className="input-field mt-1"
                  value={newStartTime}
                  onChange={(e) => setNewStartTime(e.target.value)}
                />
              </label>

              <button
                className="btn-primary"
                onClick={submitEdit}
                disabled={!newStartTime || loading}
              >
                {loading ? "Saving…" : "Save New Time"}
              </button>
            </div>
          )}

          {otpStage === "verified" && action === "cancel" && (
            <div className="space-y-3">
              <p className="text-sm text-gray-600">This cannot be undone.</p>

              <button
                className="btn-primary bg-red-600 hover:bg-red-700"
                onClick={submitCancel}
                disabled={loading}
              >
                {loading ? "Cancelling…" : "Confirm Cancellation"}
              </button>
            </div>
          )}

          <button className="text-sm text-gray-500 underline" onClick={() => startAction(null)}>
            Never mind
          </button>
        </div>
      )}
    </div>
  );
}
