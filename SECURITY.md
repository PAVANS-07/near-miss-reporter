# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

If you discover a security vulnerability within this project, please send an e-mail to security@nearmissreporter.local.

We consider the following to be critical vulnerabilities:
- SQL Injection
- Cross-Site Scripting (XSS)
- Authentication Bypass (e.g., 401 without token)
- Unauthorized Data Access

## Security Features Implemented
- **Authentication**: JWT/Token-based session management.
- **Headers**: Strict-Transport-Security, X-Frame-Options, X-Content-Type-Options, XSS-Protection applied in the Flask app.
- **Input Validation**: Prepared statements (JPA) prevent SQL injection.
