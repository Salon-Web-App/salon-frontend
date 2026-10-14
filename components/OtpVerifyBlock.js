'use client';

import { useState } from 'react';
import { sendOtp, verifyOtp } from '../lib/api';

// Encapsulates the whole "request code -> enter code -> verified" flow.
// On success calls onVerified(verificationToken) with the token the parent
// needs to pass to the booking create/modify/cancel endpoints.
export default function OtpVerifyBlock({ contact, channel, purpose, onVerified }) {
  const [stage, setStage] = useState('idle'); // idle | sent | verified
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSend() {
    setError('');
    setLoading(true);
    try {
      await sendOtp(contact, channel, purpose);
      setStage('sent');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleVerify() {
    setError('');
    setLoading(true);
    try {
      const { verificationToken } = await verifyOtp(contact, code, purpose);
      setStage('verified');
      onVerified(verificationToken);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (stage === 'verified') {
    return <p className="text-sm text-green-700 font-medium">✓ Verified</p>;
  }

  return (
    <div className="space-y-3">
      {stage === 'idle' && (
        <button type="button" className="btn-secondary" onClick={handleSend} disabled={loading || !contact}>
          {loading ? 'Sending code…' : `Send code to ${contact || '...'}`}
        </button>
      )}

      {stage === 'sent' && (
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            className="input-field sm:max-w-[160px]"
            inputMode="numeric"
            maxLength={6}
            placeholder="6-digit code"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
          />
          <button type="button" className="btn-primary" onClick={handleVerify} disabled={loading || code.length !== 6}>
            {loading ? 'Verifying…' : 'Verify'}
          </button>
          <button type="button" className="text-sm text-brand-600 underline" onClick={handleSend} disabled={loading}>
            Resend
          </button>
        </div>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
