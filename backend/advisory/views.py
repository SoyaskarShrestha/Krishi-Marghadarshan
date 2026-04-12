from rest_framework import generics, mixins, permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import AdvisoryQuestion
from .serializers import AdvisoryQuestionSerializer


ADVISORY_META = {
    "categories": {
        "en": ["Crops", "Soil Testing", "Livestock"],
        "ne": ["बालीनाली (Crops)", "माटो परीक्षण", "पशुपालन"],
    },
    "faqs": {
        "en": [
            {
                "title": "How do I control crop pests naturally?",
                "body": "Use organic pesticides or neem-based sprays. For severe infestations, contact your nearest agricultural support office.",
            },
            {
                "title": "Where can I get soil testing done?",
                "body": "You can submit soil samples at your district agriculture knowledge center or nearby mobile testing camps.",
            },
            {
                "title": "Which fertilizer is best during planting?",
                "body": "Apply compost before planting and nitrogen-rich fertilizers during crop growth for better productivity.",
            },
            {
                "title": "What to check while selecting seeds?",
                "body": "Use only certified seeds and always verify expiry date and purity percentage before purchase.",
            },
        ],
        "ne": [
            {
                "title": "बालीमा लाग्ने कीरा कसरी नियन्त्रण गर्ने?",
                "body": "प्राङ्गारिक विषादीको प्रयोग गर्नुहोस् वा निमको झोल छर्कनुहोस्। कीरा धेरै लागेमा कृषि कार्यालयमा सम्पर्क गर्नुहोस्।",
            },
            {
                "title": "माटो परीक्षण कहाँ गर्न सकिन्छ?",
                "body": "तपाईंको नजिकको जिल्ला कृषि ज्ञान केन्द्रमा वा घुम्ती शिविरहरूमा माटोको नमुना बुझाउन सक्नुहुन्छ।",
            },
            {
                "title": "उर्वर समयमा कुन मल प्रयोग गर्ने?",
                "body": "बाली रोप्नु अघि गोठेमल र बाली बढ्ने बेलामा नाइट्रोजनयुक्त मलको प्रयोग गर्दा उत्पादन राम्रो हुन्छ।",
            },
            {
                "title": "बीउ छनोट गर्दा के कुरामा ध्यान दिने?",
                "body": "प्रमाणित बीउ मात्र प्रयोग गर्नुहोस्। बीउ खरिद गर्दा म्याद र शुद्धता प्रतिशत अनिवार्य जाँच गर्नुहोस्।",
            },
        ],
    },
    "centers": {
        "en": [
            {"title": "Bagmati Province Center", "detail": "Hetauda, Phone: 057-520123"},
            {"title": "Gandaki Province Center", "detail": "Pokhara, Phone: 061-460456"},
            {"title": "Koshi Province Center", "detail": "Biratnagar, Phone: 021-550789"},
            {"title": "Lumbini Province Center", "detail": "Butwal, Phone: 071-540321"},
        ],
        "ne": [
            {"title": "बागमती प्रदेश केन्द्र", "detail": "हेटौँडा, फोन: ०५७-५२०१२३"},
            {"title": "गण्डकी प्रदेश केन्द्र", "detail": "पोखरा, फोन: ०६१-४६०४५६"},
            {"title": "कोशी प्रदेश केन्द्र", "detail": "विराटनगर, फोन: ०२१-५५०७८९"},
            {"title": "लुम्बिनी प्रदेश केन्द्र", "detail": "बुटवल, फोन: ०७१-५४०३२१"},
        ],
    },
}


class AdvisoryMetaView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        return Response(ADVISORY_META)


class AdvisoryQuestionCreateView(mixins.CreateModelMixin, generics.GenericAPIView):
    queryset = AdvisoryQuestion.objects.all()
    serializer_class = AdvisoryQuestionSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(user=request.user if request.user.is_authenticated else None)
        return Response(
            {
                "message": "Your question has been submitted. Our experts will reply soon.",
                "question": serializer.data,
            },
            status=201,
        )
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset().order_by("-created_at")
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    

class AdvisoryQuestionDetailView(
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
    generics.GenericAPIView,
):
    queryset = AdvisoryQuestion.objects.all().order_by("-created_at")
    serializer_class = AdvisoryQuestionSerializer
    permission_classes = [permissions.AllowAny]

    def delete(self, request, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)

    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)

    def patch(self, request, *args, **kwargs):
        return self.partial_update(request, *args, **kwargs)

    def get(self, request, *args, **kwargs):    
        return self.retrieve(request, *args, **kwargs)   
