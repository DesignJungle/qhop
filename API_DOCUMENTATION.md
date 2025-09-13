# 📚 QHop API Documentation

## 🌐 **Base URL**
```
Development: http://localhost:3001/api
Production: https://api.qhop.app
```

## 🔐 **Authentication**

QHop uses JWT (JSON Web Tokens) for authentication with different flows for customers and business owners.

### **Headers**
```http
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

## 📱 **Customer Authentication**

### **Send OTP**
```http
POST /auth/customer/send-otp
```

**Request Body:**
```json
{
  "phone": "+1234567890"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP sent successfully",
  "requestId": "req_123456789"
}
```

### **Verify OTP**
```http
POST /auth/customer/verify-otp
```

**Request Body:**
```json
{
  "phone": "+1234567890",
  "otp": "123456",
  "requestId": "req_123456789"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Authentication successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_123",
    "phone": "+1234567890",
    "name": "John Doe",
    "createdAt": "2024-01-15T10:00:00Z"
  }
}
```

## 🏢 **Business Authentication**

### **Business Login**
```http
POST /auth/business/login
```

**Request Body:**
```json
{
  "email": "sarah@example.com",
  "password": "demo123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "business_owner_123",
    "email": "sarah@example.com",
    "name": "Sarah Johnson",
    "businessId": "business_456",
    "role": "OWNER"
  }
}
```

## 🎯 **Queue Management**

### **Get Business Queues**
```http
GET /queues/business/:businessId
```

**Response:**
```json
{
  "success": true,
  "queues": [
    {
      "id": "queue_123",
      "name": "General Queue",
      "description": "Main service queue",
      "maxSize": 50,
      "currentSize": 12,
      "estimatedWaitTime": 25,
      "isActive": true,
      "services": [
        {
          "id": "service_456",
          "name": "Consultation",
          "duration": 30,
          "price": 50
        }
      ]
    }
  ]
}
```

### **Join Queue**
```http
POST /queues/:queueId/join
```

**Request Body:**
```json
{
  "serviceId": "service_456",
  "partySize": 1,
  "notes": "First time visit"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Successfully joined queue",
  "ticket": {
    "id": "ticket_789",
    "queueId": "queue_123",
    "position": 13,
    "estimatedWaitTime": 30,
    "ticketNumber": "A013",
    "status": "WAITING",
    "createdAt": "2024-01-15T14:30:00Z"
  }
}
```

### **Leave Queue**
```http
DELETE /queues/:queueId/leave
```

**Response:**
```json
{
  "success": true,
  "message": "Successfully left queue"
}
```

### **Call Next Customer**
```http
POST /queues/:queueId/call-next
```

**Response:**
```json
{
  "success": true,
  "message": "Next customer called",
  "ticket": {
    "id": "ticket_789",
    "ticketNumber": "A013",
    "customerPhone": "+1234567890",
    "status": "CALLED"
  }
}
```

## 📊 **Analytics**

### **Dashboard Analytics**
```http
GET /analytics/dashboard/:businessId?period=7d
```

**Query Parameters:**
- `period`: `1d`, `7d`, `30d`, `90d`, `1y`

**Response:**
```json
{
  "success": true,
  "analytics": {
    "overview": {
      "totalCustomers": 1247,
      "avgWaitTime": 12.5,
      "customerSatisfaction": 4.6,
      "noShowRate": 8.2,
      "period": "7d"
    },
    "peakHours": [
      {
        "hour": 14,
        "count": 89,
        "label": "14:00"
      }
    ],
    "dailyStats": [
      {
        "date": "2024-01-15",
        "customers": 156,
        "avgWaitTime": 18,
        "revenue": 7800,
        "satisfaction": 4.7
      }
    ]
  }
}
```

### **Revenue Analytics**
```http
GET /analytics/revenue/:businessId?period=30d&groupBy=day
```

**Response:**
```json
{
  "success": true,
  "revenue": {
    "totalRevenue": 45600,
    "dailyRevenue": [
      {
        "date": "2024-01-15",
        "revenue": 1520,
        "transactions": 38
      }
    ],
    "revenueByService": [
      {
        "serviceId": "service_456",
        "serviceName": "Consultation",
        "revenue": 17250,
        "bookings": 345
      }
    ]
  }
}
```

## 👥 **Staff Management**

### **Get Staff Members**
```http
GET /staff/business/:businessId?role=all&status=active
```

**Response:**
```json
{
  "success": true,
  "staff": [
    {
      "id": "staff_123",
      "name": "Sarah Johnson",
      "email": "sarah@example.com",
      "phone": "+1234567890",
      "role": "MANAGER",
      "permissions": {
        "manage_queue": true,
        "view_analytics": true
      },
      "isActive": true,
      "createdAt": "2024-01-15T10:00:00Z"
    }
  ],
  "total": 5
}
```

### **Add Staff Member**
```http
POST /staff
```

**Request Body:**
```json
{
  "name": "John Smith",
  "email": "john@example.com",
  "phone": "+1234567891",
  "role": "STAFF",
  "permissions": {
    "view_queue": true,
    "call_customers": true
  }
}
```

### **Update Staff Member**
```http
PUT /staff/:staffId
```

**Request Body:**
```json
{
  "name": "John Smith Jr.",
  "role": "MANAGER",
  "isActive": true
}
```

### **Staff Performance**
```http
GET /staff/:staffId/performance?period=30d
```

**Response:**
```json
{
  "success": true,
  "performance": {
    "staffId": "staff_123",
    "staffName": "Sarah Johnson",
    "customersServed": 156,
    "avgServiceTime": 18,
    "customerSatisfaction": 4.7,
    "punctuality": 95,
    "efficiency": 88,
    "performanceScore": 92,
    "period": "30d"
  }
}
```

## 🔄 **Real-Time WebSocket Events**

### **Connection**
```javascript
const socket = io('http://localhost:3001', {
  auth: {
    token: 'your_jwt_token'
  }
});
```

### **Customer Events**
```javascript
// Join queue room
socket.emit('join-queue', { queueId: 'queue_123' });

// Listen for position updates
socket.on('position-update', (data) => {
  console.log('New position:', data.position);
  console.log('Wait time:', data.estimatedWaitTime);
});

// Listen for being called
socket.on('customer-called', (data) => {
  console.log('You have been called!', data);
});
```

### **Business Events**
```javascript
// Join business room
socket.emit('join-business', { businessId: 'business_456' });

// Listen for new customers
socket.on('customer-joined', (data) => {
  console.log('New customer joined:', data);
});

// Listen for queue updates
socket.on('queue-update', (data) => {
  console.log('Queue updated:', data);
});
```

## ❌ **Error Responses**

### **Standard Error Format**
```json
{
  "success": false,
  "message": "Error description",
  "code": "ERROR_CODE",
  "details": {
    "field": "Specific field error"
  }
}
```

### **Common HTTP Status Codes**
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `422` - Validation Error
- `500` - Internal Server Error

### **Error Codes**
- `INVALID_OTP` - OTP verification failed
- `EXPIRED_OTP` - OTP has expired
- `QUEUE_FULL` - Queue has reached maximum capacity
- `ALREADY_IN_QUEUE` - Customer already in queue
- `BUSINESS_NOT_FOUND` - Business does not exist
- `INSUFFICIENT_PERMISSIONS` - User lacks required permissions

## 🔒 **Rate Limiting**

- **OTP Requests**: 5 per phone number per hour
- **API Calls**: 1000 per hour per authenticated user
- **WebSocket Connections**: 10 per user

## 📝 **Request/Response Examples**

### **Complete Queue Join Flow**
```bash
# 1. Send OTP
curl -X POST http://localhost:3001/api/auth/customer/send-otp \
  -H "Content-Type: application/json" \
  -d '{"phone": "+1234567890"}'

# 2. Verify OTP
curl -X POST http://localhost:3001/api/auth/customer/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"phone": "+1234567890", "otp": "123456", "requestId": "req_123"}'

# 3. Join Queue
curl -X POST http://localhost:3001/api/queues/queue_123/join \
  -H "Authorization: Bearer your_jwt_token" \
  -H "Content-Type: application/json" \
  -d '{"serviceId": "service_456", "partySize": 1}'
```

## 🧪 **Testing**

### **Postman Collection**
Import the QHop Postman collection for easy API testing:
```
https://api.qhop.app/postman/collection.json
```

### **Test Credentials**
- **Business Login**: `sarah@example.com` / `demo123`
- **Test Phone**: `+1234567890` (always receives OTP: `123456`)

---

For more detailed information, visit our [Developer Portal](https://developers.qhop.app) or contact our API support team.
