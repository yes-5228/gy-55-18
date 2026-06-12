from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import PickupNotification
from .serializers import PickupNotificationSerializer, ResendSerializer
from .services import resend_notifications_by_phone


class PickupNotificationViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = PickupNotification.objects.select_related("parcel").all()
    serializer_class = PickupNotificationSerializer

    @action(detail=False, methods=["post"])
    def resend(self, request):
        serializer = ResendSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        notifications = resend_notifications_by_phone(serializer.validated_data["phone"])
        if not notifications:
            return Response(
                {"detail": "该手机号没有未取件的包裹。"},
                status=status.HTTP_404_NOT_FOUND,
            )
        return Response(
            {
                "count": len(notifications),
                "notifications": PickupNotificationSerializer(notifications, many=True).data,
            },
            status=status.HTTP_201_CREATED,
        )
