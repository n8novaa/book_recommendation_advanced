from django.shortcuts import render


from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import InteractionSerializer
from rest_framework.permissions import IsAuthenticated

class InteractionView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = InteractionSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save(user=request.user)  # 🔥 core logic
            return Response(serializer.data, status=201)

        print("ERRORS:", serializer.errors)
        return Response(serializer.errors, status=400)