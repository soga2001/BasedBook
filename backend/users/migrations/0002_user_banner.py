# Generated by Django 4.0.6 on 2023-06-05 12:13

from django.db import migrations, models
import users.models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='banner',
            field=models.FileField(blank=True, null=True, upload_to=users.models.rename_banner),
        ),
    ]