# God Mode Mobile (spec)

A mobile app that's deliberately not a full mobile re-implementation of the CLI — it's the surface that does what mobile does best.

## What mobile does that desktop doesn't

1. **Voice intake** — record a brainstorm in the elevator, get a roadmap when you sit down
2. **Approval gates** — approve external actions from the lock screen
3. **Notification surface** — verifier verdicts, watchers firing, session completions
4. **Status glance** — current roadmap state without opening a laptop
5. **Photo intake** — code, error, screenshot, wireframe — paste with the camera
6. **Quick query** — ask the system a one-liner without a keyboard

## What mobile does NOT do

- Full multi-task session orchestration (do that on desktop)
- Long editing sessions (typing on phone is the wrong tool)
- File-tree navigation
- Heavy code inspection

## Architecture

```
[Mobile app] ←─ HTTPS ──→ [User's webhook ingress server OR managed cloud]
                                ↕
                          [Local God Mode runtime — CLI / desktop instance]
```

The mobile app is a thin client. The work happens on the user's desktop/server. Mobile is the interface, not the brain.

## Core screens (v1.0 mobile)

### 1. Home — current session glance
- Active session goal (1 line)
- Phase: <name>, % complete
- Latest verifier verdict (color-coded)
- Latest cost
- Big action: "View on desktop" / "Open handoff"

### 2. Voice intake
- Hold-to-record button (60s max per recording, can chain)
- Auto-uploads to user's server, returns roadmap when ready
- Push notification when roadmap is ready

### 3. Inbox — pending approvals
- List of external-actions awaiting approval
- Tap to see payload (redacted)
- Approve / deny / send to desktop
- Touch ID / Face ID required for money / external email

### 4. Notifications
- Verifier verdicts
- Watcher fires
- Standup briefs (from reflection-journal day)
- Session completions

### 5. Settings
- Server URL + auth token
- Push notification preferences
- Default pack
- Quiet hours (no notifications)

## Auth

OAuth-style pairing with the user's God Mode server:
1. On desktop: `god-mode mobile-pair` → generates QR code
2. On mobile: scan QR → store token securely (Keychain / Keystore)
3. All API calls use the token

## Tech stack (suggested for the actual build)

- React Native + Expo (cross-platform, fast iteration)
- Tamagui / NativeBase for UI
- React Query for server state
- expo-av for audio recording
- expo-camera for photo intake
- expo-notifications for push
- WatermelonDB or AsyncStorage for offline-first local cache

## Privacy

- No data stored on Apple/Google servers beyond push tokens
- All session data lives on the user's server
- Voice recordings auto-deleted from device after upload
- Lock-screen approvals require Touch/Face ID

## What v1.4 ships

- This spec (the artifact)
- Reference wireframes (text-only here)
- API contract (what the mobile app expects from the ingress server)

## What v1.5 ships

- Reference React Native implementation (Expo go runnable)
- TestFlight / Play Store internal testing build

## What v1.6 ships

- Public release
- App Store / Play Store listings
- Marketing site integration

## Why mobile, why now

The founder-content + customer-call + voice-intake skills are the most-natural-on-mobile features. Building those skills first (v1.3) before the mobile surface (v1.5) means when the app ships, it's not a "look we made a mobile app too" — it's "this is the surface those skills were designed for."
