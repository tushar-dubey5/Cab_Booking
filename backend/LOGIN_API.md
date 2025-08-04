# User Login Endpoint Documentation

## Endpoint

`POST /user/login`

## Description
Authenticates a user with email and password. If the credentials are valid, returns a JWT token for authenticated requests.

## Request Body
The request body must be a JSON object with the following structure:

```
{
  "email": "<string, valid email>",
  "password": "<string, min 6 chars>"
}
```

### Example
```
{
  "email": "john.doe@example.com",
  "password": "secret123"
}
```

## Validation Rules
- `email`: Required, must be a valid email address
- `password`: Required, minimum 6 characters

## Responses

### Success
- **Status Code:** `201 Created`
- **Body:**
  ```json
  {
    "statusCode": 201,
    "data": "<JWT token>",
    "message": "User Loggedin Successfully",
    "success": true
  }
  ```

### Validation Error
- **Status Code:** `422 Unprocessable Entity`
- **Body:**
  ```json
  {
    "statusCode": 422,
    "data": null,
    "message": "Validation failed",
    "success": false,
    "errors": [
      {
        "field": "email",
        "message": "Invalid Email"
      },
      {
        "field": "password",
        "message": "Password must be at least 6 characters long"
      }
      // ...other errors
    ]
  }
  ```

### Authentication Error
- **Status Code:** `401 Unauthorized`
- **Body:**
  ```json
  {
    "statusCode": 401,
    "data": null,
    "message": "User not found!" // or "Invalid password"
    "success": false
  }
  ```

### Other Errors
- **Status Code:** `500 Internal Server Error` (or other appropriate error codes)
- **Body:**
  ```json
  {
    "error": "Internal Server Error"
  }
  ```

## Notes
- The returned JWT token can be used for authenticated requests.
- Password is never returned in the response.
