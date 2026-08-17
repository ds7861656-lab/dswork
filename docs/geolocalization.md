Here is the documentation file. You should add this to your project, typically under a `docs/` folder (e.g., `docs/GEOLOCATION.md`) or in your internal wiki.

***

# Geolocation Architecture & Strategy

## 1. Overview

Our application uses a **Strategy Pattern** to handle user geolocation. This allows us to abstract the complexity of determining a user's location (City, Country, Coordinates) behind a single `LocationService`.

The service attempts to retrieve the location using a prioritized list of strategies. If the primary strategy fails (e.g., user denies permission or API timeout), it automatically falls back to the next available strategy.

### Current File Structure
*   **`src/services/locationService.ts`**: Main controller logic and strategy implementations.
*   **`src/types/location.ts`**: TypeScript definitions for Location objects and Strategies.
*   **`src/components/Header.tsx`**: Main consumer of the location service (displays the location badge).

---

## 2. Current Strategies

As of today, the service implements the following strategies in this order:

### A. `BrowserGeolocationStrategy` (Priority 1)
1.  Uses the native HTML5 `navigator.geolocation` API.
2.  **Reverse Geocoding:**
    *   First, attempts to send coordinates to our Backend (`apiClient.getLocationInfo`).
    *   **Fallback:** If the backend fails, it queries **OpenStreetMap (Nominatim)** directly from the client.
3.  **Pros:** High accuracy (GPS level).
4.  **Cons:** Requires user permission; relies on external services (OSM) if our backend is unreachable.

### B. `IpLocationStrategy` (Priority 2 / Fallback)
1.  Used if the user denies GPS permission or if GPS services are unreachable.
2.  Calls a public IP-to-Location API (e.g., `ipapi.co`).
3.  **Pros:** No user permission required; works automatically.
4.  **Cons:** Low accuracy (City/Region level only).

---

## 3. Environment Configuration (`VITE_IS_CHINESE_VERSION`)

We maintain a specific build flag in our `.env` file to handle regional differences between our International users and Chinese users.

```bash
# .env

# Set to 'true' for builds deployed to China / WeChat Mini Programs / Chinese App Stores
# Set to 'false' for Global/Google Play builds
VITE_IS_CHINESE_VERSION=false
```

**Impact on Geolocation:**
Currently, this flag is not used to determine the **Preferred Strategy Order** in `LocationService`.
but there should be logic to choose the correct strategy based on the VITE_IS_CHINESE_VERSION flag. the chinese build should rely on a backend implementation of the Goade API which is more relyable and may not suffer restriction from China's regulations or from the Great Firewall.

---

## 4. ⚠️ The China Challenge & Future Roadmap

**Crucial Note for New Developers:**
The current `BrowserGeolocationStrategy` **may not work reliably in China**.

1.  **Google Services Blocked:** Android devices in China often strip Google Play Services. The native `navigator.geolocation` implementation on many Android browsers relies on Google's network location providers, which are blocked by the Great Firewall.
2.  **OpenStreetMap Latency:** OSM endpoints are often throttled or blocked, making client-side reverse geocoding unreliable.

### Required Implementation: Backend-Mediated Gaode (AMap) Service

To support Chinese users properly, we cannot rely on client-side API calls to Western services. We must implement a **Backend Location Endpoint** that utilizes **Gaode Map (AMap - 高德地图)**.

#### Why Backend?
1.  **Security:** Gaode API keys and Security Codes should not be exposed in the frontend code if we use the Web Service API.
2.  **Reliability:** The backend can perform IP-to-Location lookups on the server side, which is faster and bypasses client-side network restrictions.
3.  **Signature Signing:** Gaode's newer Web APIs require strict security configurations that are messy to handle purely client-side.

### 5. Implementation Guide: Gaode (AMap) Integration

When the time comes to implement the Chinese location strategy, follow these steps:

#### Step A: Gaode Configuration
1.  Register a developer account at [console.amap.com](https://console.amap.com).
2.  Create an application and generate a **Web Service API Key** (Key type: "Web Service").

#### Step B: Backend Endpoint Implementation
Create a new endpoint in our backend (e.g., `GET /api/v1/location/china`).

**Logic:**
1.  Receive the request.
2.  Extract the user's IP address from the request headers.
3.  Call Gaode's **IP Positioning API**:
    ```http
    GET https://restapi.amap.com/v3/ip?key={YOUR_BACKEND_KEY}&ip={USER_IP}
    ```
4.  Return the standardized `UserLocation` object (City, Province, Lat/Lon) to the frontend.

#### Step C: Frontend Strategy
Create a new strategy in `src/services/locationService.ts`:

```typescript
class ChinaBackendStrategy implements LocationStrategy {
  name: LocationStrategyType = 'backend_china';

  async getLocation(): Promise<UserLocation> {
    // Call our own backend, which talks to Gaode internally
    const response = await apiClient.get('/api/v1/location/china');
    return {
      city: response.data.city,
      country: 'China',
      // ... map other fields
    };
  }
}
```

#### Step D: Update Service Logic
Modify the `LocationService` constructor to use this strategy when the env flag is set:

```typescript
// src/services/locationService.ts

if (import.meta.env.VITE_IS_CHINESE_VERSION === 'true') {
  this.preferredOrder = ['backend_china', 'manual'];
} else {
  this.preferredOrder = ['gps', 'ip'];
}
```