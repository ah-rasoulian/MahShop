# Generated by Django 3.2.5 on 2021-07-18 11:54

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='user',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('user_name', models.EmailField(max_length=254, unique=True)),
                ('password', models.CharField(max_length=30)),
                ('first_name', models.CharField(max_length=30, null=True)),
                ('last_name', models.CharField(max_length=30, null=True)),
                ('address', models.TextField(max_length=100, null=True)),
                ('charge', models.IntegerField(default=0)),
                ('last_login', models.DateTimeField(auto_now=True, verbose_name='last login')),
                ('is_admin', models.BooleanField(default=False)),
                ('is_active', models.BooleanField(default=True)),
                ('is_staff', models.BooleanField(default=False)),
                ('is_superuser', models.BooleanField(default=False)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='admin',
            fields=[
                ('user_name', models.EmailField(max_length=254, primary_key=True, serialize=False)),
                ('password', models.CharField(max_length=30)),
            ],
        ),
        migrations.CreateModel(
            name='category',
            fields=[
                ('category_name', models.CharField(max_length=30, primary_key=True, serialize=False)),
            ],
        ),
        migrations.CreateModel(
            name='receipt',
            fields=[
                ('tracing_code', models.CharField(max_length=20, primary_key=True, serialize=False)),
                ('stuff_name', models.CharField(max_length=40)),
                ('user_name', models.EmailField(max_length=240)),
                ('first_name', models.CharField(max_length=30)),
                ('last_name', models.CharField(max_length=30)),
                ('address', models.TextField(max_length=100)),
                ('creation_date', models.DateField(auto_now_add=True)),
                ('state', models.CharField(choices=[('انجام شده', 'انجام شده'), ('در حال انجام', 'در حال انجام'), ('لغو شده', 'لغو شده')], max_length=30)),
            ],
        ),
        migrations.CreateModel(
            name='stuff',
            fields=[
                ('stuff_name', models.CharField(max_length=40, primary_key=True, serialize=False)),
                ('price', models.IntegerField()),
                ('stock', models.IntegerField()),
                ('sold_count', models.IntegerField()),
                ('creation_date', models.DateField(auto_now_add=True)),
                ('category_name', models.ForeignKey(default='دسته بندی نشده', on_delete=django.db.models.deletion.CASCADE, to='store.category')),
            ],
        ),
    ]