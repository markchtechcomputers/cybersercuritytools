# Security Notes

## What's implemented

| Control | Where |
|---|---|
| CSRF protection | `config/security.php` (`csrf_token()`, `csrf_field()`, `csrf_verify()`), applied to contact, login, and registration forms |
| XSS protection | All dynamic output passed through `e()` (an `htmlspecialchars` wrapper); strict Content-Security-Policy header |
| SQL injection protection | All queries use PDO prepared statements with bound parameters (`auth/auth-functions.php`) |
| Password security | `password_hash()` / `password_verify()`, with transparent rehash on algorithm/cost upgrade |
| Secure sessions | `httponly`, `secure` (when on HTTPS), `SameSite=Lax` cookies; periodic session ID regeneration |
| Rate limiting | `rate_limit()` helper applied to login, registration, contact form, and the AI support endpoint |
| Security headers | `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, `Strict-Transport-Security`, CSP — set in `config/security.php` and reinforced in `.htaccess` |
| HTTPS enforcement | Redirect in `config/security.php` and `.htaccess` |
| Input validation | Server-side validation on every form (`contact.php`, `auth/register.php`, `auth/login.php`) — never relies on client-side JS alone |
| Bot mitigation | Honeypot field on the contact form; rate limiting on all POST endpoints |
| Error handling | Verbose errors only in `APP_ENV=development`; production errors are logged to `logs/php-error.log`, never echoed |
| Directory protection | `.htaccess` denies direct access to `config/`, `includes/`, `database/`, `logs/` |

## AI support widget

- The browser never receives an API key, model name, or system prompt —
  all of that lives server-side in `api/ai-support.php`.
- Every incoming message is classified by keyword before any reply is
  generated. Messages that read as requesting help attacking a system
  without authorization are refused immediately by a fixed message and
  never reach a model call.
- If `MERIDIAN_AI_API_KEY` is not set, the endpoint uses a deterministic,
  rule-based responder — no external network call is made, and the widget
  still functions.
- If a model call fails for any reason, the endpoint falls back to the
  rule-based responder rather than surfacing an error to the visitor.
- Requests are rate-limited per session (20 messages / 5 minutes) and
  checked for same-origin `Origin` headers.

## Secrets management

No credentials are hard-coded anywhere in this codebase. `config/config.php`
reads exclusively from environment variables (`getenv()`), so the same
code can move between environments by changing environment configuration
only.

## Reporting a vulnerability

If you find a security issue in this codebase, contact the maintainers
directly rather than filing a public issue, and allow time for a fix
before disclosure.
