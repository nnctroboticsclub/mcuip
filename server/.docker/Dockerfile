FROM python:3.12.0

WORKDIR /app
ADD requirements.txt requirements.txt
RUN pip install -r requirements.txt


WORKDIR /mnt
ENTRYPOINT [ "python3", "-m", "app" ]