# For using Python image
FROM python:3.10

# Defining the repo of work to the container
WORKDIR /app

# Copy files from Backend
COPY . /app

# Installing the dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Exposing on The port
EXPOSE 9000

# Lunching FastApi application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "9000"]
