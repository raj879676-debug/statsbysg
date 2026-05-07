# Security Specification: Statistics By SG

## Data Invariants
1. `users/{userId}`: Only the owner can read/write their own profile. `updatedAt` must be `request.time`.
2. `chats/{userId}`: Only the owner can read/write their chat history.
3. `reviews/{reviewId}`: Anyone can read approved reviews. Anyone can create a review (default `approved: false`). Only admins can update or delete reviews.
4. `assetOverrides`: Publicly readable. Only admins can write.
5. `announcements`: Publicly readable. Only admins can write.
6. `contacts`: Anyone can create. Only admins can read/update/delete.

## The Dirty Dozen (Attacker Payloads)

1. **Identity Spoofing (Users)**: Try to write to `users/target-user-id` while authenticated as `attacker-id`.
2. **Preference Hijacking**: Try to update `users/victim-id`'s preferences.
3. **Ghost Review**: Create a review with `approved: true` directly.
4. **Outcome Manipulation**: Update an existing review to change `approved` from `false` to `true`.
5. **PII Scraping**: List `users` collection as a standard user.
6. **Chat Snooping**: Read `chats/other-user-id`.
7. **Resource Poisoning**: Create a review with a 1MB string for `name`.
8. **ID Injection**: Create a document at `reviews/../../../target-path`.
9. **Timestamp Fraud**: Create a review with `createdAt` set to 1 month in the future.
10. **State Shortcut (Contacts)**: Create a contact with `status: 'resolved'`.
11. **Admin Escalation**: Attempt to create a document in `admins/my-uid`.
12. **Asset Hijacking**: Attempt to update `assetOverrides/hero-video`.

## Test Runner Logic
I will implement `firestore.rules` to reject all these cases.
