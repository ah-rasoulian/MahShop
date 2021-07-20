from django.core.serializers import serialize
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
    # category_name = serializers.CharField(max_length=30, required=False, default="دسته بندی نشده")
    category_name = serializers.ListField(required=False, default=["دسته بندی نشده"])
    search_box = serializers.CharField(max_length=20, required=False, default="none")
    price = serializers.CharField(max_length=10, required=False, default="none")
    date = serializers.CharField(max_length=10, required=False, default="none")
    sold_count = serializers.CharField(max_length=10, required=False, default="desc")
    lbp = serializers.IntegerField(required=False, default=-1)
    ubp = serializers.IntegerField(required=False, default=-1)
    page = serializers.IntegerField(required=False, default=1)



class PurchaseSerializer(serializers.Serializer):
    stuff_name= serializers.CharField(max_length=30,required=True)
    itmes = serializers.IntegerField(default = 1)




class IncreaseSerializer(serializers.Serializer):
    charge = serializers.IntegerField(default=True)


class us(serializers.ModelSerializer):
    class Meta:
        model = user
        fields ='__all__'
