from django.urls import path
# from rest_framework.authtoken.views import obtain_auth_token

from . import views

urlpatterns = [
    path("register", views.register, name="register"),
    path("login", views.login, name="login"),
    path("edit-info/<str:pk>", views.edit_info, name="edit-info"),
    path("add-category", views.add_category, name="add-category"),
    path("update-category/<str:pk>", views.update_category, name="update-category"),
    path("get-cat", views.get_cat, name="get-cat"),
    path("delete-category", views.delete_category, name="delete-category"),
    path("receipts", views.receipts, name="receipts"),
    path("receipt/<str:pk>", views.filtered_receipt, name="receipt"),
    path("stuff-list", views.stuff_list, name="stuff-list"),
    path("add-stuff", views.add_stuff, name="add-stuff"),
    path("purchase", views.purchase, name="purchase"),
    path("increase-charge", views.increase_charge, name="increase-charge"),
    path("user-info", views.user_info, name="user-info"),
    path("main", views.main_page, name="main-page"),
]
