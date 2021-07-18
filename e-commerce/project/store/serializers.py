from django.db.models import fields
from rest_framework import serializers
from .models import category, receipt, stuff, user

class UserSerializer(serializers.ModelSerializer):
	class Meta:
		model = user
		fields =["user_name", "password", "first_name", "last_name", "address"]


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = category
        fields ='__all__'


class ReceiptSerializer(serializers.ModelSerializer):
    class Meta:
        model = receipt
        fields = '__all__'


class StuffSerializer(serializers.ModelSerializer):
    class Meta:
        model = stuff
        fields = '__all__'


class StuffListSerializer(serializers.Serializer):
    category_name = serializers.CharField(max_length=30, required=False, default="دسته بندی نشده")
    price = serializers.CharField(max_length=10, required=False, default="none")
    date = serializers.CharField(max_length=10, required=False, default="none")
    lbp = serializers.IntegerField(required=False, default=-1)
    ubp = serializers.IntegerField(required=False, default=-1)
    page = serializers.IntegerField(required=False, default=1)