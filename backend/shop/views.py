from rest_framework import generics, mixins, permissions, status
from rest_framework.response import Response

from accounts.models import log_admin_action

from .models import CartItem, Product
from .serializers import CartItemSerializer, ProductSerializer



class IsSuperUser(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.is_superuser)


class ProductListView(mixins.ListModelMixin, mixins.CreateModelMixin, generics.GenericAPIView):
    queryset = Product.objects.order_by("id")
    serializer_class = ProductSerializer
    def get_permissions(self):
        if self.request.method in permissions.SAFE_METHODS:
            return [permissions.AllowAny()]
        return [IsSuperUser()]


    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)
    
    def post(self, request, *args, **kwargs):
        response = self.create(request, *args, **kwargs)
        if response.status_code == 201:
            log_admin_action(
                actor=request.user,
                action="create",
                target_type="product",
                target_label=response.data.get("name", "Product"),
                target_id=response.data.get("id", ""),
                summary=f'Created product "{response.data.get("name", "Product")}"',
                metadata={"category": response.data.get("category", "")},
            )
        return response
    
class ProductDetailView(mixins.RetrieveModelMixin, mixins.UpdateModelMixin, mixins.DestroyModelMixin, generics.GenericAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    def get_permissions(self):
        if self.request.method in permissions.SAFE_METHODS:
            return [permissions.AllowAny()]
        return [IsSuperUser()]

    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)

    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)

    def patch(self, request, *args, **kwargs):
        response = self.partial_update(request, *args, **kwargs)
        if response.status_code == 200:
            log_admin_action(
                actor=request.user,
                action="update",
                target_type="product",
                target_label=response.data.get("name", "Product"),
                target_id=response.data.get("id", ""),
                summary=f'Updated product "{response.data.get("name", "Product")}"',
                metadata={"category": response.data.get("category", "")},
            )
        return response

    def delete(self, request, *args, **kwargs):
        product = self.get_object()
        summary = f'Deleted product "{product.name}"'
        product_id = product.id
        response = self.destroy(request, *args, **kwargs)
        if response.status_code == 204:
            log_admin_action(
                actor=request.user,
                action="delete",
                target_type="product",
                target_label=product.name,
                target_id=product_id,
                summary=summary,
                metadata={"category": product.category},
            )
        return response


class CartItemListCreateView(mixins.ListModelMixin, mixins.CreateModelMixin, generics.GenericAPIView):
    serializer_class = CartItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return CartItem.objects.filter(user=self.request.user).select_related("product")

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        product = serializer.validated_data["product"]
        quantity = serializer.validated_data.get("quantity", 1)

        item, created = CartItem.objects.get_or_create(
            user=request.user,
            product=product,
            defaults={"quantity": quantity},
        )

        if not created:
            item.quantity += quantity
            item.save(update_fields=["quantity", "updated_at"])

        output = self.get_serializer(item)
        return Response(output.data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)


class CartItemDetailView(mixins.RetrieveModelMixin, mixins.UpdateModelMixin, mixins.DestroyModelMixin, generics.GenericAPIView):
    serializer_class = CartItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return CartItem.objects.filter(user=self.request.user).select_related("product")

    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)

    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)

    def patch(self, request, *args, **kwargs):
        return self.partial_update(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)