from rest_framework.filters import BaseFilterBackend
from django.db.models import Q
class SearchInWorkspaceFilter(BaseFilterBackend):
    def filter_queryset(self, request, queryset, view):
        key = request.query_params.get("keySearch", "").strip()
        if not key:
            return queryset
        return queryset.filter(
            Q(boards__name__icontains=key) |
            Q(boards__boardlists__listcard__name__icontains=key)
        ).distinct()