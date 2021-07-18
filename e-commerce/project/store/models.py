from django.db import models
from django.db.models.fields.related import ForeignKey
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager

from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver
from rest_framework.authtoken.models import Token


class MyAccountManager(BaseUserManager):
    def create_user(self, user_name, password=None):
        if not user_name:
            raise ValueError('Users must have a username')

        user = self.model(
            user_name=self.normalize_email(user_name),
        )

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, user_name, password):
        user = self.create_user(
            password=password,
            user_name=user_name,
        )
        user.is_admin = True
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user


class user(AbstractBaseUser):
    user_name = models.EmailField(unique=True, max_length=254)
    password = models.CharField(max_length=100)
    first_name = models.CharField(max_length=30, null=True)
    last_name = models.CharField(max_length=30, null=True)
    address = models.TextField(max_length=100, null=True)
    charge = models.IntegerField(default=0)
    last_login = models.DateTimeField(verbose_name='last login', auto_now=True)
    is_admin = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    USERNAME_FIELD = "user_name"
    REQUIRED_FIELDS = ["password"]

    objects = MyAccountManager()

	# For checking permissions. to keep it simple all admin have ALL permissons
    def has_perm(self, perm, obj=None):
        return self.is_admin

	# Does this user have permission to view this app? (ALWAYS YES FOR SIMPLICITY)
    def has_module_perms(self, app_label):
        return True


class admin(models.Model):
    user_name = models.EmailField(primary_key=True, max_length=254)
    password = models.CharField(max_length=30)


class category(models.Model):
    category_name = models.CharField(max_length=30, primary_key=True)


class stuff(models.Model):
    stuff_name = models.CharField(max_length=40, primary_key=True)
    category_name = models.ForeignKey(category, on_delete=models.CASCADE, default="دسته بندی نشده")
    price = models.IntegerField()
    stock = models.IntegerField()
    sold_count = models.IntegerField()
    creation_date = models.DateField(auto_now_add=True)


class receipt(models.Model):
    tracing_code = models.CharField(max_length=20, primary_key=True)
    stuff_name = models.CharField(max_length=40)# there is no need to be ForeignKey
    user_name = models.EmailField(max_length=240)
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    address = models.TextField(max_length=100)
    creation_date = models.DateField(auto_now_add=True)
    state_choices = [
        ("انجام شده","انجام شده"),
        ("در حال انجام","در حال انجام"),
        ("لغو شده","لغو شده")
    ]
    state = models.CharField(max_length=30, choices=state_choices)


@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_auth_token(sender, instance=None, created=False, **kwargs):
    if created:
        Token.objects.create(user=instance)


