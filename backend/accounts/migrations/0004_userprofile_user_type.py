from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("accounts", "0003_userprofile_profile_photo"),
    ]

    operations = [
        migrations.AddField(
            model_name="userprofile",
            name="user_type",
            field=models.CharField(
                choices=[
                    ("farmer", "Farmer"),
                    ("advisor", "Advisor"),
                    ("buyer", "Buyer"),
                ],
                default="buyer",
                max_length=20,
            ),
        ),
    ]
