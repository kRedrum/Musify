def formatBodyError(template: str, *args: str) -> str:
    error_text = template.format(*args)
    return {
        "message": error_text
    }
