# Complete API Endpoint Documentation

Base URL: `https://api.fastlinepay.com/api/v1`

All endpoints require `POST` method unless specified otherwise.
Authentication token sent via `X-Authorization` header.

## Authentication

### Login
```
POST /admin/auth/login
Body: {
  username: string,
  password: string
}
Response: {
  status: "success",
  data: {
    token: string,
    role: { value: string, label: string },
    name: string,
    surname: string,
    username: string,
    // ... other user data
  }
}
```

## Payment Management

### Get Waiting Room Transactions
```
POST /admin/payment/list/wait-room
Body: {}
Response: {
  status: "success",
  data: [
    {
      transaction_id: string,
      client_username: string,
      amount: number,
      currency: { value: string, label: string },
      status: string,
      creation_date: string,
      table_view: [
        { label: string, value: string }
      ],
      // ... other transaction data
    }
  ]
}
```

### Get Processing Room Transactions
```
POST /admin/payment/list/on-process
Body: {}
Response: {
  status: "success",
  data: [/* same structure as waiting room */]
}
```

### Get Transaction Details
```
POST /admin/payment/{transaction_id}/view
Body: {}
Response: {
  status: "success",
  data: {
    transaction_id: string,
    // ... full transaction details
  }
}
```

### Update Transaction Status
```
POST /admin/payment/{transaction_id}/status/update
Body: {
  status: "payment_on_process" | "payment_completed" | "payment_declined"
}
Response: {
  status: "success",
  message: string
}
```

### Update Transaction Price
```
POST /admin/payment/{transaction_id}/price/update
Body: {
  price: number
}
Response: {
  status: "success",
  message: string
}
```

### Get Agent Dashboard Stats
```
POST /admin/payment/agent/dashboard
Body: {}
Response: {
  status: "success",
  result: [
    {
      method: string,
      title: string,
      values: {
        count: {
          success: number,
          failed: number,
          total: number
        },
        sum: {
          success: number,
          failed: number,
          total: number
        }
      }
    }
  ]
}
```

### Search Transaction History
```
POST /admin/payment/history/search
Body: {
  start: string, // "YYYY-MM-DD HH:mm:ss"
  finish: string,
  method: string, // "all" or method value
  status: string, // "all" or status value
  search: string, // optional search term
  page: number,
  limit: number
}
Response: {
  status: "success",
  data: {
    records: [/* transaction array */],
    total: number,
    page: number,
    limit: number
  }
}
```

### Get Transaction Timelapse
```
POST /admin/payment/history/timelapse
Body: {
  transaction_id: string
}
Response: {
  status: "success",
  data: [
    {
      status: string,
      timestamp: string,
      agent: string,
      // ... status change history
    }
  ]
}
```

### Get Dashboard Charts
```
POST /admin/payment/dashboard/charts
Body: {}
Response: {
  status: "success",
  data: {
    // chart data
  }
}
```

### Get History Charts
```
POST /admin/payment/history/charts
Body: {
  start: string,
  finish: string
}
Response: {
  status: "success",
  data: {
    // chart data
  }
}
```

## Finance/Reports

### Get Daily Report
```
POST /admin/payment/report/daily
Body: {
  date: string // "YYYY-MM-DD"
}
Response: {
  status: "success",
  data: {
    // daily report data
  }
}
```

### Get Agent Report
```
POST /admin/payment/report/agent
Body: {
  start: string,
  finish: string,
  agent_id: string // optional
}
Response: {
  status: "success",
  data: [
    {
      agent_name: string,
      total_transactions: number,
      successful: number,
      failed: number,
      total_amount: number,
      // ... agent stats
    }
  ]
}
```

### Get System Report
```
POST /admin/payment/report/system
Body: {
  start: string,
  finish: string
}
Response: {
  status: "success",
  data: {
    // system-wide statistics
  }
}
```

### Get Banks Report
```
POST /admin/payment/report/banks
Body: {
  start: string,
  finish: string
}
Response: {
  status: "success",
  data: [
    {
      bank_name: string,
      transaction_count: number,
      total_amount: number,
      // ... bank stats
    }
  ]
}
```

### Get General Report
```
POST /admin/payment/report/general
Body: {
  start: string,
  finish: string
}
Response: {
  status: "success",
  data: {
    // general statistics
  }
}
```

### Get Daily System Report
```
POST /admin/payment/report/daily/system
Body: {
  date: string
}
Response: {
  status: "success",
  data: {
    // daily system report
  }
}
```

## Team Management

### Get Teams List
```
POST /admin/teams
Body: {}
Response: {
  status: "success",
  data: [
    {
      id: string,
      name: string,
      surname: string,
      username: string,
      role: { value: string, label: string },
      status: string,
      // ... team member data
    }
  ]
}
```

### Create Team Member
```
POST /admin/team/create
Body: {
  name: string,
  surname: string,
  username: string,
  password: string,
  role: string,
  permissions: object,
  // ... other fields
}
Response: {
  status: "success",
  message: string,
  data: { id: string }
}
```

### Get Team Member Details
```
POST /admin/team/{team_id}/view
Body: {}
Response: {
  status: "success",
  data: {
    // team member details
  }
}
```

### Update Team Member
```
POST /admin/team/{team_id}/update
Body: {
  name: string,
  surname: string,
  role: string,
  permissions: object,
  // ... other fields
}
Response: {
  status: "success",
  message: string
}
```

### Update Team Member Password
```
POST /admin/team/{team_id}/update/password
Body: {
  password: string
}
Response: {
  status: "success",
  message: string
}
```

### Get Team Member Transaction History
```
POST /admin/team/{team_id}/payment/history/search
Body: {
  start: string,
  finish: string,
  // ... search params
}
Response: {
  status: "success",
  data: {
    records: [],
    total: number
  }
}
```

## Transfer Method Management

### Get Transfer Methods
```
POST /admin/transfer/methods
Body: {}
Response: {
  status: "success",
  data: [
    {
      id: string,
      name: string,
      type: string,
      status: string,
      // ... method data
    }
  ]
}
```

### Create Transfer Method
```
POST /admin/transfer/method/create
Body: {
  name: string,
  type: string,
  config: object,
  // ... method config
}
Response: {
  status: "success",
  message: string,
  data: { id: string }
}
```

### Get Transfer Method Details
```
POST /admin/transfer/method/{method_id}/view
Body: {}
Response: {
  status: "success",
  data: {
    // method details
  }
}
```

### Update Transfer Method
```
POST /admin/transfer/method/{method_id}/update
Body: {
  name: string,
  config: object,
  // ... method config
}
Response: {
  status: "success",
  message: string
}
```

## Havale Method Management

### Get Havale Methods
```
POST /admin/havale/methods
Body: {}
Response: {
  status: "success",
  data: [
    {
      id: string,
      name: string,
      iban: string,
      bank_name: string,
      status: string,
      // ... havale data
    }
  ]
}
```

### Create Havale Method
```
POST /admin/havale/method/create
Body: {
  name: string,
  iban: string,
  bank_name: string,
  // ... havale config
}
Response: {
  status: "success",
  message: string,
  data: { id: string }
}
```

### Get Havale Method Details
```
POST /admin/havale/method/{method_id}/view
Body: {}
Response: {
  status: "success",
  data: {
    // havale details
  }
}
```

### Update Havale Method
```
POST /admin/havale/method/{method_id}/update
Body: {
  name: string,
  iban: string,
  // ... havale config
}
Response: {
  status: "success",
  message: string
}
```

### Get Havale Prefix
```
POST /admin/havale/prefix
Body: {}
Response: {
  status: "success",
  data: {
    prefix: string
  }
}
```

## Merchant Management (Root/Merchant Role Only)

### Get Merchants List
```
POST /admin/merchants
Body: {}
Response: {
  status: "success",
  data: [
    {
      id: string,
      name: string,
      domain: string,
      status: string,
      // ... merchant data
    }
  ]
}
```

### Create Merchant
```
POST /admin/merchant/create
Body: {
  name: string,
  domain: string,
  config: object,
  // ... merchant config
}
Response: {
  status: "success",
  message: string,
  data: { id: string }
}
```

### Get Merchant Details
```
POST /admin/merchant/{merchant_id}/view
Body: {}
Response: {
  status: "success",
  data: {
    // merchant details
  }
}
```

### Update Merchant
```
POST /admin/merchant/{merchant_id}/update
Body: {
  name: string,
  config: object,
  // ... merchant config
}
Response: {
  status: "success",
  message: string
}
```

### Update Merchant Logo
```
POST /admin/merchant/{merchant_id}/update/logo
Body: {
  logo: string // base64 or URL
}
Response: {
  status: "success",
  message: string
}
```

### Get Merchant History
```
POST /admin/merchant/{merchant_id}/history
Body: {
  start: string,
  finish: string
}
Response: {
  status: "success",
  data: {
    records: [],
    total: number
  }
}
```

### Search Merchant History
```
POST /admin/merchant/{merchant_id}/history/search
Body: {
  start: string,
  finish: string,
  search: string
}
Response: {
  status: "success",
  data: {
    records: [],
    total: number
  }
}
```

### Check Merchant Branding
```
POST /admin/merchant/{merchant_id}/check/branding
Body: {}
Response: {
  status: "success",
  data: {
    has_branding: boolean,
    logo_url: string,
    // ... branding data
  }
}
```

### Get Merchant Teams
```
POST /admin/merchant/{merchant_id}/teams
Body: {}
Response: {
  status: "success",
  data: [
    // team members
  ]
}
```

### Get Merchant Sub-Merchants
```
POST /admin/merchant/{merchant_id}/sub/merchants
Body: {}
Response: {
  status: "success",
  data: [
    // sub-merchants
  ]
}
```

### Create Merchant Team Member
```
POST /admin/merchant/{merchant_id}/team/create
Body: {
  name: string,
  username: string,
  password: string,
  // ... team member data
}
Response: {
  status: "success",
  message: string,
  data: { id: string }
}
```

### Get Merchant Team Member
```
POST /admin/merchant/{merchant_id}/team/{team_id}/view
Body: {}
Response: {
  status: "success",
  data: {
    // team member details
  }
}
```

### Update Merchant Team Member
```
POST /admin/merchant/{merchant_id}/team/{team_id}/update
Body: {
  name: string,
  // ... team member data
}
Response: {
  status: "success",
  message: string
}
```

### Update Merchant Team Member Password
```
POST /admin/merchant/{merchant_id}/team/{team_id}/update/password
Body: {
  password: string
}
Response: {
  status: "success",
  message: string
}
```

## User Profile

### Get My Profile
```
POST /admin/profile/my/profile
Body: {}
Response: {
  status: "success",
  data: {
    name: string,
    surname: string,
    username: string,
    role: object,
    permissions: object,
    // ... profile data
  }
}
```

### Change My Password
```
POST /admin/profile/my/password/change
Body: {
  old_password: string,
  new_password: string
}
Response: {
  status: "success",
  message: string
}
```

### Change 2FA Settings
```
POST /admin/profile/my/2fa/change
Body: {
  enabled: boolean,
  code: string // if enabling
}
Response: {
  status: "success",
  message: string
}
```

### Update Notification Settings
```
POST /admin/profile/my/notification/update
Body: {
  audio_enabled: boolean,
  push_enabled: boolean,
  // ... notification settings
}
Response: {
  status: "success",
  message: string
}
```

### Get Merchant Access
```
POST /admin/profile/access/merchant
Body: {}
Response: {
  status: "success",
  data: [
    {
      merchant_id: string,
      merchant_name: string,
      access_level: string,
      // ... access data
    }
  ]
}
```

### Update Agent Merchant Access
```
POST /admin/profile/access/merchant/agent/{agent_id}/update
Body: {
  merchant_id: string,
  access_level: string
}
Response: {
  status: "success",
  message: string
}
```

## Merchant Configuration

### View Merchant
```
POST /admin/merchant/view
Body: {}
Response: {
  status: "success",
  data: {
    // current merchant data
  }
}
```

### Get Payment Methods
```
POST /admin/merchant/payment/method
Body: {}
Response: {
  status: "success",
  result: [
    {
      key: string,
      label: string,
      value: string
    }
  ]
}
```

### Get Merchant Access Assignment
```
POST /admin/merchant/access/assigment
Body: {}
Response: {
  status: "success",
  data: [
    // access assignments
  ]
}
```

### Get Agents
```
POST /admin/merchant/agents
Body: {}
Response: {
  status: "success",
  data: [
    {
      id: string,
      name: string,
      username: string,
      // ... agent data
    }
  ]
}
```

### Get Merchant Payment Methods
```
POST /admin/merchant/assigment/method
Body: {}
Response: {
  status: "success",
  data: [
    // payment methods
  ]
}
```

### Get Payment Operators
```
POST /admin/merchant/payment/operators
Body: {}
Response: {
  status: "success",
  data: [
    // operators
  ]
}
```

### Get Operator Payments
```
POST /admin/merchant/payment/operators/payments
Body: {
  operator_id: string
}
Response: {
  status: "success",
  data: [
    // payments
  ]
}
```

### Get Payment Merchants
```
POST /admin/merchant/payment/merchants
Body: {}
Response: {
  status: "success",
  data: [
    // merchants
  ]
}
```

### Get Transfer Apps
```
POST /admin/merchant/apps/transfer
Body: {}
Response: {
  status: "success",
  data: [
    // transfer apps
  ]
}
```

### Get Payment Status Options
```
POST /admin/merchant/payment/status
Body: {}
Response: {
  status: "success",
  result: {
    "payment_wait_room": "Bekleyen",
    "payment_on_process": "İşlemde",
    "payment_completed": "Tamamlandı",
    "payment_declined": "Reddedildi"
  }
}
```

### Get Currency Options
```
POST /admin/merchant/payment/currency
Body: {}
Response: {
  status: "success",
  data: [
    {
      value: "TRY",
      label: "Türk Lirası"
    }
  ]
}
```

### Get Method Status
```
POST /admin/merchant/payment/method/status
Body: {}
Response: {
  status: "success",
  data: {
    // method status
  }
}
```

## Callback Monitoring

### Search Callback History
```
POST /admin/merchant/callback/history/search
Body: {
  start: string,
  finish: string,
  search: string,
  page: number,
  limit: number
}
Response: {
  status: "success",
  data: {
    records: [
      {
        id: string,
        transaction_id: string,
        url: string,
        method: string,
        status_code: number,
        request_body: object,
        response_body: object,
        timestamp: string,
        // ... callback data
      }
    ],
    total: number
  }
}
```

## Utility Endpoints

### Get Banks List
```
POST /api/v1/banks
Body: {}
Response: {
  status: "success",
  data: [
    {
      code: string,
      name: string,
      logo: string
    }
  ]
}
```

### Get Withdraw Banks
```
POST /api/v1/withdraw/banks
Body: {}
Response: {
  status: "success",
  data: [
    {
      title: string,
      value: string,
      logo: string
    }
  ]
}
```

### Get Timezones
```
POST /api/v1/timezones
Body: {}
Response: {
  status: "success",
  data: [
    {
      value: string,
      label: string
    }
  ]
}
```

### Get Language File
```
GET /api/v1/language/{lang}
Response: {
  // language translations
}
```

### Get Block Messages
```
GET /api/v1/admin/messages/blocks
Response: {
  status: "success",
  data: [
    {
      id: string,
      message: string,
      type: string
    }
  ]
}
```

## Error Responses

All endpoints may return error responses:

```json
{
  "status": "error",
  "message": "Error description",
  "code": "ERROR_CODE"
}
```

Common error codes:
- `UNAUTHORIZED` - Invalid or missing token
- `FORBIDDEN` - Insufficient permissions
- `NOT_FOUND` - Resource not found
- `VALIDATION_ERROR` - Invalid input data
- `SERVER_ERROR` - Internal server error
