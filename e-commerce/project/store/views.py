from re import X
from django.core.serializers import serialize
from django.db.models.query import QuerySet

from rest_framework import serializers
from rest_framework import permissions
from store.models import *
from django.shortcuts import render


from django.http import *

from rest_framework.renderers import JSONRenderer
from rest_framework.parsers import JSONParser
from rest_framework.decorators import api_view,permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .serializers import CategorySerializer, PurchaseSerializer, StuffListSerializer, StuffSerializer, UserSerializer, ReceiptSerializer, us
from rest_framework.authtoken.models import Token
import ast

@api_view(['POST'])
def register(request):
    serializer = UserSerializer(data=request.data)
    print(serializer.is_valid())
    if serializer.is_valid():
        serializer.save()
        token = Token.objects.get(user=user.objects.get(user_name=serializer.data["user_name"])).key
        data = {}
        data["token"] = token
        return HttpResponse(data)
    return Response("registeration failed")


@api_view(['POST'])
def login(request):
    
    serializer = UserSerializer(data=request.data)
    print(serializer.initial_data)
    print(serializer.is_valid())
    token = Token.objects.get(user=user.objects.get(user_name=serializer.data["user_name"])).key
    data = {}
    data["token"] = token
    return Response(data)

# after editing you have to login again.
@api_view(['POST'])
@permission_classes((IsAuthenticated,))
def edit_info(request, pk):
    usr = user.objects.get(user_name=pk)
    serializer = UserSerializer(instance=usr, data=request.data)
    usr.delete()
    if serializer.is_valid():
        serializer.save()
        return Response("edited succesfully")
    return Response("you don't have premission")


@api_view(['POST'])
@permission_classes((IsAuthenticated,))
def add_category(request):
    user = request.user
    if user.is_admin:
        serializer = CategorySerializer(data=request.data)
        print(serializer.is_valid())
        if serializer.is_valid():
            serializer.save()
        return Response("category added")
    return Response("you don't have premission")



@api_view(['POST'])
@permission_classes((IsAuthenticated,))
def update_category(request, pk):
    if request.user.is_admin:
        cat = category.objects.get(category_name=pk)
        serializer = CategorySerializer(instance=cat, data=request.data)
        if serializer.is_valid():
            cat.delete()
            serializer.save()
        return Response("category updated")
    return Response("you don't have premission")


@api_view(['PUT'])
@permission_classes((IsAuthenticated,))
def delete_category(request):
    if request.user.is_admin:
        serializer = CategorySerializer(data=request.data)
        cat = category.objects.get(category_name=serializer.initial_data["category_name"])
        cat.delete()
        return Response("category update")
    return Response("you don't have premission")


@api_view(['GET'])
def get_cat(request):
    cat = category.objects.all()
    serializer = CategorySerializer(cat, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes((IsAuthenticated,))
def receipts(request):
    if request.user.is_admin:
        rec = receipt.objects.all()
        serializer = ReceiptSerializer(rec, many=True)
        return Response(serializer.data)
    else:
        rec = receipt.objects.filter(user_name=request.user.user_name)
        serializer = ReceiptSerializer(rec, many=True)
        return Response(serializer.data)    


@api_view(['GET'])
@permission_classes((IsAuthenticated,))
def filtered_receipt(request, pk):
    if request.user.is_admin:
        rec = receipt.objects.filter(tracing_code=pk)
        serializer = ReceiptSerializer(rec, many=True)
        return Response(serializer.data)
    return Response("you don't have premission")


@api_view(["POST"])
def stuff_list(request):
    filter = StuffListSerializer(data=request.data)
    print(filter.is_valid())

    stuff_list = QuerySet()
    cat_name = list(category.objects.filter(category_name__in=filter["category_name"].value))
    stuff_list = stuff.objects.filter(category_name__in=cat_name)
    if filter["sold_count"].value == 'desc':
        stuff_list = stuff.objects.order_by("-sold_count").filter(category_name__in=cat_name)
    else:
        stuff_list = stuff.objects.filter(category_name__in=cat_name)

    
    if filter["search_box"].value != 'none':
        stuff_list = [x for x in stuff_list if filter["search_box"].value in x.stuff_name]
    print(stuff_list)

    if filter["price"].value == "asc":
        stuff_list = stuff_list.order_by("price")
    elif filter["price"].value == "desc":
        stuff_list = stuff_list.order_by("-price")

    if filter["date"].value == "asc":
        stuff_list = stuff_list.order_by("creation_date")
    elif filter["date"].value == "desc":
        stuff_list = stuff_list.order_by("-creation_date")


    if filter["lbp"].value != -1:
        stuff_list = [x for x in stuff_list if x.price>filter["lbp"].value]
    if filter["ubp"].value != -1:
        stuff_list = [x for x in stuff_list if x.price< filter["ubp"].value]

    serializer = StuffSerializer(stuff_list, many=True)
    return Response(serializer.data)


@api_view(["POST"])
@permission_classes((IsAuthenticated,))
def add_stuff(request):
    serializer = StuffSerializer(data=request.data)
    print(serializer.is_valid())
    if serializer.is_valid():
        serializer.save()
    return Response(serializer.data)


@api_view(["POST"])
@permission_classes((IsAuthenticated,))
def purchase(request):
    serializer = PurchaseSerializer(data=request.data)
    if serializer.is_valid():
        stf = stuff.objects.get(stuff_name=serializer.initial_data["stuff_name"])
        usr = request.user
        if serializer.initial_data["items"] < stf.stock:
            if serializer.initial_data["items"]*stf.price < usr.charge:
                usr.charge = usr.charge - (serializer.initial_data["items"]*stf.price)
                usr.save()
                stf.stock = stf.stock - serializer.initial_data["items"]
                stf.sold_count = stf.sold_count + serializer.initial_data["items"]
                stf.save()
                return Response("succesfful purchase")
            else:
                return Response("you don't have enough money")
        else:
            return Response("there is not enough stuff")
        
    
@api_view(["POST"])
@permission_classes((IsAuthenticated,))
def increase_charge(request):
    serializer = PurchaseSerializer(data=request.data)
    request.user.charge = request.user.charge + serializer.initial_data["charge"]
    request.user.save()
    return Response("successfull")



@api_view(["POST"])
@permission_classes((IsAuthenticated,))
def increase_charge(request):
    serializer = PurchaseSerializer(data=request.data)
    request.user.charge = request.user.charge + serializer.initial_data["charge"]
    request.user.save()
    return Response("successfull")



@api_view(["GET"])
@permission_classes((IsAuthenticated,))
def user_info(request):
    serializer = us(request.user)
    print(serializer.data)
    return Response(serializer.data)



@api_view(["GET"])
def main_page(request):
    return render(request, "home.html")

@api_view(["GET"])
def enter_form(request):
    return render(request, "enter_form.html")


@api_view(["GET"])
def register_form(request):
    return render(request, "register_form.html")


@api_view(["GET"])
@permission_classes((IsAuthenticated,))
def profile(request):
    if request.user.is_admin:
        return render(request, "admin_profile")
    return render(request, "profile.html")


