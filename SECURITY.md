# Security Policy

## Supported Versions

The latest release is always recommended. Currently supported:

| Version | Supported |
| --- | --- |
| v1.0.x | ✅ |

## Reporting a Vulnerability

If you discover a security vulnerability, please report it responsibly:

1. Open a [new issue](https://github.com/ElijahZhao/seedream-HuiBenShengCHENG/issues/new) with the title starting with `[SECURITY]`.
2. Do NOT disclose the vulnerability publicly until it has been fixed.
3. Include enough detail for the maintainer to reproduce and fix the issue.

The maintainer will acknowledge receipt within 48 hours and aim to resolve the issue promptly.

## Security Measures

This project implements the following security practices:

- **Local-first architecture**: All user data stays on-device (SQLite). No cloud database.
- **Local authentication**: Passwords hashed with bcryptjs. No credentials leave the device.
- **API key storage**: Stored in browser localStorage, never transmitted to third parties.
- **Static export**: No server-side rendering, reducing the attack surface.
- **CI/CD security**: Signed Android APK with keystore. GitHub Secrets for sensitive data.
