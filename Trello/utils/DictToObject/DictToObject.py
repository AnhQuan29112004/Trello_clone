class DictToObj:
    def __init__(self, dict_):
        for k, v in dict_.items():
            setattr(self, k, v)