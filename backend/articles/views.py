from rest_framework import generics, mixins, permissions

from .models import Article
from .serializers import ArticleSerializer


SEED_ARTICLES = [
    {
        "title": "Growing Rice in the Terai",
        "title_nepali": "तराईमा धान खेती",
        "category": "Crop Guide",
        "description": "A comprehensive guide on soil preparation, seed selection, and water management for high-yield rice farming in Nepal's southern plains.",
        "badge": "Featured",
        "published_label": "June 2024",
        "featured": True,
    },
    {
        "title": "Natural Compost Secret",
        "category": "Organic Methods",
        "description": "Learn how to turn kitchen waste into nutrient-rich soil for your vegetable garden.",
        "read_time": "5 min read",
    },
    {
        "title": "Seasonal Pest Guide",
        "category": "Pest Control",
        "description": "Identifying common monsoon pests and using neem-based solutions for eco-friendly protection.",
        "read_time": "8 min read",
    },
    {
        "title": "Market Price Trends",
        "category": "Business",
        "description": "Understanding the best time to sell your produce in Kathmandu and major local markets.",
        "read_time": "12 min read",
    },
]
class ArticleListCreateView(mixins.ListModelMixin, mixins.CreateModelMixin, generics.GenericAPIView):
    queryset = Article.objects.order_by("id")
    serializer_class = ArticleSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        if not Article.objects.exists():
            Article.objects.bulk_create(Article(**item) for item in SEED_ARTICLES)
        return super().get_queryset()


    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)


class ArticleDetailView(mixins.RetrieveModelMixin, mixins.UpdateModelMixin, mixins.DestroyModelMixin, generics.GenericAPIView):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer
    permission_classes = [permissions.AllowAny]

    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)

    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)

    def patch(self, request, *args, **kwargs):
        return self.partial_update(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)


