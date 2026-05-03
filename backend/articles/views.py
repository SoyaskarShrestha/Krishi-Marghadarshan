from django.db.models import Q
from rest_framework import generics, mixins, permissions, status
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

from accounts.models import log_admin_action

from .models import Article, SavedArticle
from .serializers import ArticleSerializer, SavedArticleSerializer


class IsSuperUser(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.is_superuser)


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
    def get_permissions(self):
        if self.request.method in permissions.SAFE_METHODS:
            return [permissions.AllowAny()]
        return [IsSuperUser()]

    def get_queryset(self):
        if not Article.objects.exists():
            Article.objects.bulk_create(Article(**item) for item in SEED_ARTICLES)

        queryset = super().get_queryset()

        query = (self.request.query_params.get("q") or "").strip()
        category = (self.request.query_params.get("category") or "").strip()
        language = (self.request.query_params.get("language") or "all").strip().lower()

        if query:
            queryset = queryset.filter(
                Q(title__icontains=query)
                | Q(title_nepali__icontains=query)
                | Q(category__icontains=query)
                | Q(description__icontains=query)
            )

        if category:
            queryset = queryset.filter(category__iexact=category)

        if language == "ne":
            queryset = queryset.exclude(title_nepali="")
        elif language == "en":
            queryset = queryset

        return queryset


    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        response = self.create(request, *args, **kwargs)
        if response.status_code == 201:
            log_admin_action(
                actor=request.user,
                action="create",
                target_type="article",
                target_label=response.data.get("title", "Article"),
                target_id=response.data.get("id", ""),
                summary=f'Created article "{response.data.get("title", "Article")}"',
                metadata={"category": response.data.get("category", "")},
            )
        return response


class ArticleDetailView(mixins.RetrieveModelMixin, mixins.UpdateModelMixin, mixins.DestroyModelMixin, generics.GenericAPIView):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer
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
                target_type="article",
                target_label=response.data.get("title", "Article"),
                target_id=response.data.get("id", ""),
                summary=f'Updated article "{response.data.get("title", "Article")}"',
                metadata={"category": response.data.get("category", "")},
            )
        return response

    def delete(self, request, *args, **kwargs):
        article = self.get_object()
        title = article.title or "Article"
        article_id = article.id
        category = article.category or ""
        response = self.destroy(request, *args, **kwargs)
        if response.status_code == 204:
            log_admin_action(
                actor=request.user,
                action="delete",
                target_type="article",
                target_label=title,
                target_id=article_id,
                summary=f'Deleted article "{title}"',
                metadata={"category": category},
            )
        return response


class SavedArticleListCreateView(mixins.ListModelMixin, mixins.CreateModelMixin, generics.GenericAPIView):
    serializer_class = SavedArticleSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return SavedArticle.objects.filter(user=self.request.user).select_related("article")

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        article = serializer.validated_data["article"]

        saved, created = SavedArticle.objects.get_or_create(user=request.user, article=article)
        output = self.get_serializer(saved)
        return Response(
            {
                "message": "Article saved." if created else "Article already saved.",
                "saved": output.data,
            },
            status=status.HTTP_201_CREATED if created else status.HTTP_200_OK,
        )


class SavedArticleDetailView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, article_id):
        saved = get_object_or_404(SavedArticle, user=request.user, article_id=article_id)
        saved.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


