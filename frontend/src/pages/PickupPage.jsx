import { DoorOpen, Loader2, Send } from "lucide-react";
import React, { useState } from "react";

import { notificationsApi, parcelsApi } from "../api/modules";
import MessageBox from "../components/MessageBox";
import PageHeader from "../components/PageHeader";
import eventBus from "../utils/eventBus";

export default function PickupPage() {
  const [pickupCode, setPickupCode] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [openLoading, setOpenLoading] = useState(false);

  const [phone, setPhone] = useState("");
  const [resendItems, setResendItems] = useState([]);
  const [resendError, setResendError] = useState("");
  const [resendLoading, setResendLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setResult("");
    setError("");
    if (openLoading) return;
    setOpenLoading(true);
    try {
      const data = await parcelsApi.open(pickupCode);
      setResult(`${data.message} 运单号 ${data.parcel.tracking_no} 已标记取件。`);
      setPickupCode("");
    } catch (err) {
      setError(err.message);
    } finally {
      setOpenLoading(false);
    }
  };

  const handleResend = async (event) => {
    event.preventDefault();
    setResendItems([]);
    setResendError("");
    if (resendLoading) return;
    setResendLoading(true);
    try {
      const data = await notificationsApi.resend(phone);
      setResendItems(data.notifications || []);
      setPhone("");
      eventBus.emit("notifications:updated");
    } catch (err) {
      setResendError(err.message);
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <>
      <PageHeader title="取件码开箱" description="输入用户取件码，系统校验后打开对应柜格并更新快件状态；也可按手机号重发取件码通知。" />
      <section className="pickup-panel">
        <form className="panel code-form" onSubmit={submit}>
          <label>
            取件码
            <input value={pickupCode} onChange={(event) => setPickupCode(event.target.value)} maxLength={12} required disabled={openLoading} />
          </label>
          <button type="submit" disabled={openLoading}>
            {openLoading ? <Loader2 size={18} className="spin" /> : <DoorOpen size={18} />}
            {openLoading ? "处理中..." : "开箱取件"}
          </button>
          <MessageBox type="success">{result}</MessageBox>
          <MessageBox type="error">{error}</MessageBox>
        </form>
        <form className="panel code-form" onSubmit={handleResend}>
          <label>
            手机号（重发取件码）
            <input value={phone} onChange={(event) => setPhone(event.target.value)} maxLength={30} required placeholder="输入收件人手机号" disabled={resendLoading} />
          </label>
          <button type="submit" disabled={resendLoading}>
            {resendLoading ? <Loader2 size={18} className="spin" /> : <Send size={18} />}
            {resendLoading ? "发送中..." : "重发通知"}
          </button>
          {resendItems.length > 0 && (
            <div className="resend-result">
              <p className="resend-title">已为 {resendItems.length} 个未取件包裹重新发送取件码通知：</p>
              <ul className="resend-list">
                {resendItems.map((item) => (
                  <li key={item.id}>
                    运单号：<strong>{item.tracking_no}</strong>，取件码：<strong>{item.pickup_code}</strong>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <MessageBox type="error">{resendError}</MessageBox>
        </form>
      </section>
    </>
  );
}
