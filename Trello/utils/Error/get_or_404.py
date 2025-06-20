from django.core.exceptions import ObjectDoesNotExist, MultipleObjectsReturned
from rest_framework.exceptions import APIException

class Response_get_or_404(APIException):
    status_code = 404
    default_detail = {
        "mesage":"Object isn't exist",
        "status":404,
        "code":"ERROR"
    }
    default_code = "ERROR"
    
def Base_get_or_404(queryset, **filter_kwargs):
    try:
        return queryset.get(**filter_kwargs)
    except (ObjectDoesNotExist, MultipleObjectsReturned):
        raise Response_get_or_404()