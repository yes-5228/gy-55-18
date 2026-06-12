import { DoorOpen, Send } from "lucide-react";
import React, { useState } from "react";

import { notificationsApi, parcelsApi } from "../api/modules";
import MessageBox from "../components/MessageBox";
import PageHeader from "../components/PageHeader";

export default function PickupPage() {
  const [pickupCode, setPickupCode] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  const [phone, setPhone] = useState("");
  const [resendResult, setResendResult] = useState("");
  const [resendError, setResendError] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    setResult("");
    setError("");
    try {
      const data = await parcelsApi.open(pickupCode);
      setResult(`${data.message} 运单号 ${data.parcel.tracking_no} 已标记取件。`);
      setPickupCode("");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleResend = async (event) => {
    event.preventDefault();
    setResendResult("");
    setResendError("");
    try {
      const data = await notificationsApi.resend(phone);
      setResendResult(`已为 ${data.count} 个未取件包裹重新发送取件码通知。`);
      setPhone("");
    } catch (err) {
      setResendError(err.message);
    }
  };

  return (
    <>
      <PageHeader title="取件码开箱" description="输入用户取件码，系统校验后打开对应柜格并更新快件状态；也可按手机号重发取件码通知。" />
      <section className="pickup-panel">
        <form className="panel code-form" onSubmit={submit}>
          <label>
            取件码
            <input value={pickupCode} onChange={(event) => setPickupCode(event.target.value)} maxLength={12} required />
          </label>
          <button type="submit"><DoorOpen size={18} />开箱取件</button>
          <MessageBox type="success">{result}</MessageBox>
          <MessageBox type="error">{error}</MessageBox>
        </form>
        <form className="panel code-form" onSubmit={handleResend}>
          <label>
            手机号（重发取件码）
            <input value={phone} onChange={(event) => setPhone(event.target.value)} maxLength={30} required placeholder="输入收件人手机号" />
          </label>
          <button type="submit"><Send size={18} />重发通知</button>
          <MessageBox type="success">{resendResult}</MessageBox>
          <MessageBox type="error">{resendError}</MessageBox>
        </form>
      </section>
    </>
  );
}
