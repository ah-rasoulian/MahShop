from django.urls import path


from . import views

urlpatterns = [
    path("register", views.register, name="register"),
    path("login", views.login, name="login"),
    path("edit-info/<str:pk>", views.edit_info, name="edit-info"),
    path("add-category", views.add_category, name="add-category"),
    path("update-category/<str:pk>", views.update_category, name="update-category"),
    # path("get-cat", views.print_cat, name="print"),
    path("delete-category", views.delete_category, name="delete-category"),
    path("receipts", views.receipts, name="receipts"),
    path("receipt/<str:pk>", views.filtered_receipt, name="receipt"),
    path("stuff-list", views.stuff_list, name="stuff-list"),
    path("add-stuff", views.add_stuff, name="add-stuff"),

]
