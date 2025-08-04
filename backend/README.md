# User Registration Endpoint Documentation

## Endpoint

`POST /user/register`

## Description
Registers a new user in the system. This endpoint validates the input, hashes the password, creates a user, and returns an authentication token along with the user data (excluding the password).

## Request Body
The request body must be a JSON object with the following structure:

```
{
  "fullname": {
    "firstname": "<string, min 3 chars>",
    "lastname": "<string, optional, min 3 chars>"
  },
  "email": "<string, valid email>",
  "password": "<string, min 6 chars>"
}
```

### Example
```
{
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "john.doe@example.com",
  "password": "secret123"
}
```

## Validation Rules
- `fullname.firstname`: Required, minimum 3 characters
- `fullname.lastname`: Optional, minimum 3 characters if provided
- `email`: Required, must be a valid email address
- `password`: Required, minimum 6 characters

## Responses

### Success
- **Status Code:** `201 Created`
- **Body:**
  ```json
  {
    "statusCode": 200,
    "data": {
      "token": "<JWT token>",
      "user": {
        "_id": "<user id>",
        "fullname": {
          "firstname": "John",
          "lastname": "Doe"
        },
        "email": "john.doe@example.com"
        // ...other user fields (excluding password)
      }
    },
    "message": "User registered Successfully",
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

### Other Errors
- **Status Code:** `500 Internal Server Error` (or other appropriate error codes)
- **Body:**
  ```json
  {
    "error": "Internal Server Error"
  }
  ```

## Notes
- The password is securely hashed before storage.
- The returned JWT token can be used for authenticated requests.
- The password field is never returned in the response.

---

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

---

# User Logout Endpoint Documentation

## Endpoint

`POST /user/logout`

## Description
Logs out the currently authenticated user by clearing the authentication cookie and blacklisting the JWT token. The blacklisted token will expire automatically after a set period (e.g., 1 hour), after which the same token value can be reused if reissued.

## Request
- No request body is required. The endpoint expects the authentication cookie (`Token`) to be present.

## Responses

### Success
- **Status Code:** `200 OK`
- **Body:**
  ```json
  {
    "statusCode": 200,
    "data": null,
    "message": "User logged out successfully",
    "success": true
  }
  ```

### Not Authenticated
- **Status Code:** `401 Unauthorized`
- **Body:**
  ```json
  {
    "statusCode": 401,
    "data": null,
    "message": "Authentication required",
    "success": false
  }
  ```

### Other Errors
- **Status Code:** `500 Internal Server Error`
- **Body:**
  ```json
  {
    "error": "Internal Server Error"
  }
  ```

## Notes
- The JWT token is blacklisted and will be rejected for future requests until it expires from the blacklist.
- The cookie is cleared from the client, so the user is logged out in the browser.
- No request body is needed; the endpoint works based on the authentication cookie.
