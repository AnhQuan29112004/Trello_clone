def set_attrs(obj, **kwargs):
    for key, value in kwargs.items():
        setattr(obj, key, value)
    return obj
