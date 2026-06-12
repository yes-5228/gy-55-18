from .models import PickupNotification


def send_pickup_notification(parcel, channel=PickupNotification.Channel.SMS):
    message = (
        f"您的快件 {parcel.tracking_no} 已入柜，柜格 {parcel.locker_cell.code}，"
        f"取件码 {parcel.pickup_code}。"
    )
    return PickupNotification.objects.create(
        parcel=parcel,
        channel=channel,
        recipient=parcel.receiver_phone,
        message=message,
        status=PickupNotification.Status.SENT,
    )


def resend_notifications_by_phone(phone, channel=PickupNotification.Channel.SMS):
    from apps.parcels.models import Parcel

    parcels = Parcel.objects.filter(
        receiver_phone=phone,
        status=Parcel.Status.STORED,
    ).select_related("locker_cell")
    notifications = []
    for parcel in parcels:
        notification = send_pickup_notification(parcel, channel=channel)
        notifications.append(notification)
    return notifications
