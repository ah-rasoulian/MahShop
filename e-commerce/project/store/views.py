from re import X

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
from .serializers import CategorySerializer, StuffListSerializer, StuffSerializer, UserSerializer, ReceiptSerializer
from rest_framework.authtoken.models import Token
import ast


@api_view(['POST'])
def register(request):
    request.data = ast.literal_eval(request.body.decode("UTF-8"))
    serializer = UserSerializer(data=request.data)
    print(serializer.is_valid())
    if serializer.is_valid():
        serializer.save()
        token = Token.objects.get(user=user.objects.get(user_name=serializer.data["user_name"])).key
        data = {}
        data["token"] = token
        return Response(data)
    return Response("registeration failed")


@api_view(['POST'])
def login(request):
    request.data = ast.literal_eval(request.body.decode("UTF-8"))
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
    request.data = ast.literal_eval(request.body.decode("UTF-8"))
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
    request.data = ast.literal_eval(request.body.decode("UTF-8"))
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
    request.data = ast.literal_eval(request.body.decode("UTF-8"))
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
    request.data = ast.literal_eval(request.body.decode("UTF-8"))
    if request.user.is_admin:
        serializer = CategorySerializer(data=request.data)
        cat = category.objects.get(category_name=serializer.initial_data["category_name"])
        cat.delete()
        return Response("category update")
    return Response("you don't have premission")


@api_view(['GET'])
def get_cat(request):
    request.data = ast.literal_eval(request.body.decode("UTF-8"))
    cat = category.objects.all()
    serializer = CategorySerializer(cat, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes((IsAuthenticated,))
def receipts(request):
    request.data = ast.literal_eval(request.body.decode("UTF-8"))
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
    request.data = ast.literal_eval(request.body.decode("UTF-8"))
    if request.user.is_admin:
        rec = receipt.objects.filter(tracing_code=pk)
        serializer = ReceiptSerializer(rec, many=True)
        return Response(serializer.data)
    return Response("you don't have premission")


@api_view(["POST"])
def stuff_list(request):
    request.data = ast.literal_eval(request.body.decode("UTF-8"))
    filter = StuffListSerializer(request.data)
    stuff_list = stuff.objects.order_by("-sold_count").filter(category_name=filter["category_name"].value)
    if filter["price"].value == "asc":
        stuff_list = stuff_list.order_by("price")
    elif filter["price"].value == "desc":
        stuff_list = stuff_list.order_by("-price")


    if filter["date"].value == "asc":
        stuff_list = stuff_list.order_by("creation_date")
    elif filter["date"].value == "desc":
        stuff_list = stuff_list.order_by("-creation_date")


    if filter["lbp"].value != "none":
        stuff_list = [x for x in stuff_list if x.price>filter["lbp"].value]
    if filter["ubp"].value != "none":
        stuff_list = [x for x in stuff_list if x.price< filter["ubp"].value]
    serializer = StuffSerializer(stuff_list, many=True)
    return Response(serializer.data)


@api_view(["POST"])
@permission_classes((IsAuthenticated,))
def add_stuff(request):
    request.data = ast.literal_eval(request.body.decode("UTF-8"))
    serializer = StuffSerializer(data=request.data)
    print(serializer.is_valid())
    if serializer.is_valid():
        serializer.save()
    return Response(serializer.data)


