# WooCommerce Categories Sync Service

This project provides a serverless solution for synchronizing WooCommerce product categories with AWS DynamoDB. It uses AWS Lambda functions to handle category imports, storage, and management through a REST API.


 # ✅ Architecture Diagram

 ![Diagram](https://github.com/TRoYHD/SyncMe-Coding-Challenge-ServerlessAPIforWooCommerce/blob/main/public/A%20high%20Level%20Architecture%20Diagram.png)

 AWS Serverless WooCommerce API consists of:

API Gateway → Handles HTTP requests and routes them to Lambda functions.

Lambda Functions → Process requests and interact with WooCommerce & DynamoDB.

SQS (Simple Queue Service) → Manages import tasks asynchronously.

DynamoDB → Stores category imports and import statuses.

SSM Parameter Store → 
Securely stores WooCommerce API credentials.

Architecture & Design Evaluation

 ![Diagram](https://github.com/TRoYHD/SyncMe-Coding-Challenge-ServerlessAPIforWooCommerce/blob/main/public/Flow%20of%20servleses%20api%20for%20Wecommerce.png)



# ✅ Strengths of the Design
Scalability 🚀

API Gateway handles high traffic loads automatically.
Lambda scales automatically based on requests.
SQS ensures asynchronous processing, preventing system overload.
Resilience & Fault Tolerance 🛡️

SQS decouples services, so failed import tasks can be retried.
DynamoDB is highly available with built-in replication.
Security Best Practices 🔒

SSM Parameter Store securely manages credentials.
IAM policies restrict access to AWS services.
Cost-Effectiveness 💰

Serverless pricing model (pay-per-use) reduces costs.
No need to manage servers (fully managed services).

# ✅ S🛠 Serverless WooCommerce FLOW Architecture
https://app.eraser.io/workspace/lSInPYkqTuopqJlrhOfM?origin=share

# ✅ S🛠 Serverless WooCommerce API Architecture (Text-Based)

 ![Diagram](https://github.com/TRoYHD/SyncMe-Coding-Challenge-ServerlessAPIforWooCommerce/blob/main/public/Flow%20of%20AWS%20Artc.png)


## Table of Contents
- [Prerequisites](#prerequisites)
- [AWS Setup](#aws-setup)
- [Installation](#installation)
- [Deployment](#deployment)
- [API Reference](#api-reference)
- [Development](#development)
- [Monitoring](#monitoring)


## Prerequisites

Before starting, ensure you have:

1. A WooCommerce store with admin access
   - Consumer and secret key so you access and fetch from wooCommerce
   - WooCommerce REST API enabled
2. An AWS account with appropriate permissions

3-Before deploying, ensure you have the following installed:

✅ AWS CLI (Download & Install)

✅ AWS SAM CLI (Download & Install)

✅ Node.js (for Lambda development)

✅ Postman (to test API endpoints)

✅ AWS Account (configured with an IAM user having permissions for Lambda, API Gateway, SQS, and DynamoDB)

✅  GIT
## AWS Setup

### 1. IAM User Setup

Create an IAM user with these permissions:
- AWSLambdaFullAccess
- AmazonDynamoDBFullAccess
- AmazonAPIGatewayAdministrator
- AWSCloudFormationFullAccess
- IAMFullAccess
- AmazonSQSFullAccess
- AmazonSSMFullAccess

### 2. Configure AWS CLI

```bash
aws configure
```

Required information:
- AWS Access Key ID
- AWS Secret Access Key
- Default region (e.g., us-east-1)
- Output format (json)
- - If u are using Accese portal with SSO login then you need also session token  !

### 3. Store WooCommerce Credentials
AWS SSM (Systems Manager Parameter Store) is a secure and scalable service that allows you to centrally store, manage, and retrieve configuration data and sensitive information, such as database credentials, API keys, and other secrets.

Key Features of AWS SSM Parameter Store:
Secure Storage – Supports encryption with AWS KMS (Key Management Service) to protect sensitive data.
Versioning – Tracks and stores multiple versions of parameters.
Access Control – Uses IAM policies to restrict access.
Integration with AWS Services – Works with Lambda, EC2, ECS, API Gateway, and more.
### Benefits of Using SSM
Decoupling: Services communicate without direct dependencies.

✅ Removes Hardcoded Secrets: No need to store credentials in code.

✅ REnhances Security: Fine-grained access control via IAM.

✅ Easier Configuration Management: Parameters can be updated dynamically.
```bash
# Store WooCommerce parameters


aws ssm put-parameter \
    --name "/WooConsumerKey" \
    --value "your-consumer-key" \
    


```
### Benefits of Using SQS in AWS
Amazon SQS (Simple Queue Service) is a fully managed message queuing service that helps decouple and scale microservices, distributed systems, and serverless applications. It allows you to send, store, and receive messages between software components asynchronously.

✅ Decoupling: Services communicate without direct dependencies.

✅ Scalability: Handles high message volumes automatically.

✅ Reliability: Ensures messages are delivered even if a service is temporarily unavailable.

✅ Security: Supports IAM-based access control and encryption with AWS KMS.
## Installation

### 1. Clone Repository

```bash
git clone [repository-url]
cd [repository-name]
```

### 2. Install Dependencies

```bash
# Install Lambda layer dependencies
cd layer/nodejs
npm install
cd ../..
```

## Deployment

### Development Environment

```bash
# Build the application
sam build

# Deploy with guided setup
sam deploy --guided 
```

### Verify Deployment
1. Note the API Gateway endpoint URL
2. Update WooCommerce webhook URLs if needed
3. Verify CloudWatch Logs
4. Check Deployed Resources: aws cloudformation describe-stacks --stack-name WooCommerceAPI
5. Check API Gateway Endpoints : aws apigateway get-rest-apis
6. Check Lambda Functions:aws lambda list-functions
7. Check DynamoDB Tables:aws dynamodb list-tables

## API Reference
## Testing APi that have a public access with POSTMAN 

## POSTMAN DOUMENTATION FOR API : https://documenter.getpostman.com/view/27333474/2sAYXEFJfw
## Includes on how to use Postman and add auth to access the weocmmerce and with pre-defined Requests (GET , DELETE)  examples and response and the backend server is up to try !

### Import Categories
- **Endpoint**: GET `/import-categories`
- **Purpose**: Start asynchronous category import from WooCommerce
- **Auth**: None (uses SSM parameters)
- **Example**:
  ```bash
  curl -X GET https://[your-api-url]/import-categories
  curl -X GET https://gy93s86f8e.execute-api.eu-north-1.amazonaws.com/import-categories ** Live Example **
  ```

### Check Import Status
- **Endpoint**: GET `/import-status`
- **Purpose**: Monitor the progress of category import
- **Auth**: None
- **Example**:
  ```bash
  curl https://[your-api-url]/import-status
  curl -X GET https://gy93s86f8e.execute-api.eu-north-1.amazonaws.com/import-status ** Live Example **
  ```

### Get StoredCategories
- **Endpoint**: GET `/stored-categories`
- **Purpose**: Retrieve all synchronized categories that stored in DataBase
- **Auth**: None
- **Example**:
  ```bash
  curl https://[your-api-url]/stored-categories
  curl -X GET https://gy93s86f8e.execute-api.eu-north-1.amazonaws.com/stored-categories
  ```

### Delete Category
- **Endpoint**: DELETE `/categories/{categoryId}`
- **Purpose**: Remove a category from sync storage
- **Auth**: Required
- **Example**:
  ```bash
  curl -X DELETE https://[your-api-url]/categories/123 \
  curl -X DELETE https://gy93s86f8e.execute-api.eu-north-1.amazonaws.com/categories/id
      -
  ```

## Development

### Local Testing Setup

1. Start local DynamoDB:
```bash
docker-compose up dynamodb-local
```

2. Start local API:
```bash
sam local start-api
```

3. Run tests:
```bash
npm test
npm run test:integration
```

### Environment Variables
There is no need for this since you have all of this on SAM TEMPLATE ALREADY CONFIGED 

## Monitoring

### CloudWatch Logs
- Lambda function logs
- Log retention: 30 days
- Common error patterns

### Metrics to Monitor
- API Gateway requests
- DynamoDB throughput
- Lambda execution times
- SQS queue depth

### Troubleshooting
1. Import failures
   - Check WooCommerce credentials
   - Verify network connectivity
   - Review Lambda timeouts

2. Performance issues
   - Monitor DynamoDB capacity
   - Check API throttling
   - Review Lambda memory






