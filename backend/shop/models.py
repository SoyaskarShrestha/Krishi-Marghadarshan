from django.db import models
from django.conf import settings


class Product(models.Model):
    name = models.CharField(max_length=255)
    category = models.CharField(max_length=120)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField()
    badge = models.CharField(max_length=50, blank=True)
    badge_tone = models.CharField(max_length=20, blank=True)
    photo = models.ImageField(upload_to="product_photos/", blank=True, null=True)

    def __str__(self):
        return self.name


class CartItem(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="cart_items")
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="cart_items")
    quantity = models.PositiveIntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["user", "product"], name="unique_cart_item_per_user_product"),
        ]
        ordering = ["-updated_at"]

    def __str__(self):
        return f"{self.user.email} - {self.product.name} x{self.quantity}"
