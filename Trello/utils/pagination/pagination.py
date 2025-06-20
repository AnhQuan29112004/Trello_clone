from rest_framework.pagination import PageNumberPagination
from rest_framework.exceptions import NotFound
from django.core.paginator import InvalidPage
from rest_framework.response import Response

class PaginationProject(PageNumberPagination):
    page_size = 6
    page_size_query_param = 'pageSize'
    max_page_size = 1000
    
    def paginate_queryset(self, queryset, request, view=None):
        """
        Paginate a queryset if required, either returning a
        page object, or `None` if pagination is not configured for this view.
        """
        self.request = request
        page_size = self.get_page_size(request)
        if not page_size:
            return None

        paginator = self.django_paginator_class(queryset, page_size)
        page_number = self.get_page_number(request, paginator)

        try:
            self.page = paginator.page(page_number)
        except InvalidPage as exc:
            msg = self.invalid_page_message.format(
                page_number=page_number, message=str(exc)
            )
            raise NotFound(msg)

        if paginator.num_pages > 1 and self.template is not None:
            # The browsable API should display pagination controls.
            self.display_page_controls = True

        return list(self.page)
    def get_paginated_response(self, data):
        return {
            'totalItems': self.page.paginator.count,
            'pageIndex': self.page.number,
            'pageSize': self.page.paginator.per_page,
            'totalPage': self.page.paginator.num_pages,
            'next': self.get_next_link(),
            'previous': self.get_previous_link(),
            'data': data,
        }
    