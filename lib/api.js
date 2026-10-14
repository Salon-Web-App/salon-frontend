// Same-origin by default: the load balancer (or nginx / next.config.js
// rewrites locally) routes /api to the backend.
const API_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

async function request(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    // Backend errors come as { error }, { message } or validation { errors: [] }.
    const message = data.error || data.message || data.errors?.[0]?.msg || "Something went wrong";
    const err = new Error(message);
    err.status = res.status;
    err.requestId = data.requestId || res.headers.get("X-Request-Id");
    throw err;
  }

  return data;
}

export const getTransformations = () => request("/transformations");
export const getPackages = () => request("/packages");
export const getServices = () => request("/services");
export const getServiceDetail = (id) => request(`/services/${id}`);
export const getStaff = () => request("/staff");
export const getStaffDetail = (id) => request(`/staff/${id}`);

export const getAvailability = (date, offering) =>
  request(`/availability?${new URLSearchParams({ date, ...offering }).toString()}`);

export const sendOtp = (contact, channel, purpose) =>
  request("/otp/send", {
    method: "POST",
    body: JSON.stringify({ contact, channel, purpose }),
  });

export const verifyOtp = (contact, otp, purpose) =>
  request("/otp/verify", {
    method: "POST",
    body: JSON.stringify({ contact, otp, purpose }),
  });

export const createBooking = (payload) =>
  request("/bookings", { method: "POST", body: JSON.stringify(payload) });

export const getBookingStatus = (applicationId) =>
  request(`/bookings/${encodeURIComponent(applicationId)}`);

export const requestModifyOtp = (applicationId, channel, contact) =>
  request(`/bookings/${encodeURIComponent(applicationId)}/request-otp`, {
    method: "POST",
    body: JSON.stringify({ channel, contact }),
  });

export const modifyBooking = (applicationId, payload) =>
  request(`/bookings/${encodeURIComponent(applicationId)}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });

export const cancelBooking = (applicationId, payload) =>
  request(`/bookings/${encodeURIComponent(applicationId)}`, {
    method: "DELETE",
    body: JSON.stringify(payload),
  });

export const getReviews = () => request("/reviews");
export const submitReview = (payload) =>
  request("/reviews", { method: "POST", body: JSON.stringify(payload) });
