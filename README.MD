## blog app

## Requirements

- use can post and publish a blog
- use can see
- authentication system
- user can see their own profile

## Table

- post

  - id
  - title
  - content
  - authorId
  - createdAt
  - updatedAt
  - published

- user

  - id
  - name
  - email
  - password
  - createdAt
  - updatedAt
  - profile

- profile

  - id
  - bio
  - createdAt
  - updatedAt
  - userId

- Technology Stack:
  - graphql
  - typescript
  - postgresql
  - prisma
