from rest_framework import generics, mixins, permissions, status
from rest_framework.response import Response

from .models import CartItem, Product
from .serializers import CartItemSerializer, ProductSerializer


SEED_PRODUCTS = [
    {
        "name": "Organic Rice Seeds",
        "category": "Organic Seeds",
        "price": "500.00",
        "description": "High-yield basmati variety optimized for Himalayan mid-hill conditions.",
        "badge": "Organic Certified",
        "badge_tone": "light",
    },
    {
        "name": "Precision Trowel",
        "category": "Modern Tools",
        "price": "1250.00",
        "description": "Rust-resistant stainless steel with bamboo ergonomic handle.",
        "badge": "Best Seller",
        "badge_tone": "brown",
    },
    {
        "name": "Bio-Root Nutrient",
        "category": "Bio Fertilizers",
        "price": "890.00",
        "description": "Enriched with mycorrhiza for strong root growth and healthier soil.",
    },
    {
        "name": "Heirloom Tomato",
        "category": "Organic Seeds",
        "price": "350.00",
        "description": "Non-GMO seeds for sweet, fleshy Himalayan varieties. 50 seeds.",
    },
    {
        "name": "Heavy-Duty Spade",
        "category": "Modern Tools",
        "price": "2400.00",
        "description": "Forged steel blade for breaking tough mountain soil.",
    },
    {
        "name": "Vermicompost Gold",
        "category": "Bio Fertilizers",
        "price": "450.00",
        "description": "Pure organic worm castings for rich soil aeration and nutrition.",
    },
]


class ProductListView(mixins.ListModelMixin, mixins.CreateModelMixin, generics.GenericAPIView):
    queryset = Product.objects.order_by("id")
    serializer_class = ProductSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        if not Product.objects.exists():
            Product.objects.bulk_create(Product(**item) for item in SEED_PRODUCTS)
        return super().get_queryset()

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)
    
    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)
    
class ProductDetailView(mixins.RetrieveModelMixin, mixins.UpdateModelMixin, mixins.DestroyModelMixin, generics.GenericAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [permissions.AllowAny]

    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)

    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)

    def patch(self, request, *args, **kwargs):
        return self.partial_update(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)


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