# Endpoints

## Things

**GET /api/things**

- Response:
``` json
  {
    "things": [
        {
            "id": 1,
            "name": "thing 1",
            "created_at": "2019-03-08T18:14:19.751Z",
            "updated_at": "2019-03-08T18:14:19.751Z"
        },
        {
            "id": 2,
            "name": "thing 2",
            "created_at": "2019-03-08T18:14:19.751Z",
            "updated_at": "2019-03-08T18:14:19.751Z"
        }
    ]
  }
```


**POST /api/things**

- Payload:
``` json
  {
    "thing": {
      "name": "thing 1"
    }
  }
```

- Response:
``` json
  {
    "thing": {
        "id": 2,
        "name": "prasd",
        "created_at": "2019-03-08T18:15:58.284Z",
        "updated_at": "2019-03-08T18:15:58.284Z"
    }
  }
```
