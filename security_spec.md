# Security Specification: Personal Gemini Journal

## 1. Trust Boundaries & Threat Model
- **Client Application (Untrusted)**: The browser frontend authenticates users with Firebase Auth. It is never trusted with server secrets, master keys, or privileged credentials.
- **Server API Layer (Privileged)**: Express server routes (`/api/gemini/*`) interface with the Gemini GenAI SDK using `process.env.GEMINI_API_KEY`. The frontend never accesses or receives this key.
- **Cloud Firestore (Isolated by Design)**: Data is strictly organized in subcollections partitioned by user UID (`/users/{userId}/entries/{entryId}` and `/users/{userId}/summaries/{summaryId}`).
- **Zero-Trust Rule Enforcement**: Every Firestore document read, list, create, update, and delete is enforced at the database level by Firestore Security Rules. Cross-user data snooping, query enumeration, or spoofed author IDs are rejected unconditionally.

## 2. Invariants
1. A user can only read, list, create, update, or delete entries and summaries inside their own `/users/{userId}/...` tree where `request.auth.uid == userId`.
2. Unauthenticated requests (`request.auth == null`) are completely denied.
3. User collection enumeration (`allow list: if false` on `/users`) is strictly forbidden to prevent scraping usernames or emails.
4. All IDs must adhere to regex `^[a-zA-Z0-9_\\-]+$` and size <= 128 to block ID poisoning and injection attacks.
5. In updates, `userId` and initial creation metadata remain immutable (`incoming().userId == existing().userId`).
6. Payloads are size-bounded (titles <= 200 chars, content <= 50,000 chars, tags <= 20 items, messages <= 100 items) to prevent denial-of-wallet resource attacks.
