# **Technical Architecture & Stack: Manas Bandhan**

| Version | 2.0 (Comprehensive) |
| :---- | :---- |
| **Architectural Style** | Offline-First, Event-Driven Microservices |
| **Primary Constraints** | Low Bandwidth (2G/3G), High Privacy (Widow Identity), Low Literacy |
| **Compliance** | DPDP Act 2023 (India), OWASP MASVS L2 |

## ---

**1\. High-Level System Architecture**

The system operates on a **Hybrid Cloud** model. We use **Firebase** for "Live" user interactions (Chat, Real-time Sync) to minimize latency, and a dedicated **Node.js** cluster for heavy computation (Matchmaking, Image Processing, Admin Logic).

### **The "Geeknik" Influence: Security & Optimization**

* **Adversarial Defense:** The CI/CD pipeline integrates **Nuclei** (referenced from the profile) to scan every API endpoint for vulnerabilities before deployment.  
* **Kernel-Level Efficiency:** The mobile app uses **Flutter** to compile directly to ARM machine code, bypassing the JavaScript bridge used by React Native. This ensures smooth scrolling even on low-end devices found in tribal belts.

## ---

**2\. Frontend Architecture**

### **2.1 Mobile Application (User Facing)**

* **Framework:** **Flutter (Dart 3.0+)**  
  * *Why:* Single codebase for Android/iOS. Superior performance on older Android versions (5.0+) still prevalent in rural India.  
* **Architecture Pattern:** **Clean Architecture with BLoC** (Business Logic Component).  
  * *Benefit:* Strictly separates UI from Logic. This allows us to unit-test the "Matchmaking Rules" without needing a physical device.  
* **Offline Persistence:** **Isar Database** (NoSQL).  
  * *Why:* Unlike SQLite, Isar is written in Rust and is incredibly fast. It supports full-text search on Marathi text, allowing users to search profiles even when offline in a village.  
* **Image Optimization:** **OctoImage** with blurhash.  
  * *Logic:* Instead of a white loading spinner, users see a blurred color placeholder immediately (bytes size \< 50B). Actual images are compressed to WebP format to save data.

### **2.2 Web Admin Panel (Staff Facing)**

* **Framework:** **Next.js 14** (React).  
  * *Hosting:* **Vercel** (Edge Network).  
* **Component Library:** **Shadcn/UI** \+ **Tailwind CSS**.  
  * *Why:* Lightweight, accessible components that load instantly on office computers with slow internet.  
* **Digitization Engine:** **Tesseract.js (WASM)**.  
  * *Feature:* Runs Optical Character Recognition (OCR) *inside the browser*. Staff can scan a paper form, and the browser extracts text (Name, Age, Caste) before sending it to the server, reducing server load.

## ---

**3\. Backend Infrastructure**

### **3.1 The "Interaction Layer" (Firebase)**

* **Authentication:** **Firebase Auth**.  
  * *Flow:* Phone Number \+ OTP.  
  * *Custom Claims:* We add an admin: true or verified\_widow: true tag to the user's JWT token to enforce security rules at the database level.  
* **Real-time Database:** **Cloud Firestore**.  
  * *Usage:* Stores active chats, notification triggers, and user online status.  
  * *Security Rules:*  
    JavaScript  
    match /chats/{chatId} {  
      allow read, write: if request.auth.uid in resource.data.participants;  
    }

### **3.2 The "Logic Layer" (Dedicated Server)**

* **Runtime:** **Node.js** with **NestJS Framework**.  
  * *Why NestJS:* It forces a structured architecture (Modules, Controllers, Services), preventing the "Spaghetti Code" common in Express.js apps.  
* **Hosting:** **AWS Lambda** (Serverless) or **Google Cloud Run**.  
* **Key Microservices:**  
  1. **Matchmaking Service:** Runs the weighted algorithm every night or on-demand.  
  2. **Sanitization Service:** Checks bios for banned words (abusive Marathi slang) using a Bloom Filter.  
  3. **PDF Generator:** Creates the "Biodata PDF" for users to download/share on WhatsApp.

## ---

**4\. The "Satyashodhak" Matchmaking Engine**

Unlike commercial apps that use simple filters, this engine uses a **Vector Scoring System** to prioritize social compatibility.

**Algorithm Logic:**

**![][image1]**

* **AgeGap:** Higher score if age difference is 2-5 years. Negative score if difference \> 10 years (predatory prevention).  
* **GeoDist:** Higher score if candidates are from the same *Taluka* (hyper-local).  
* **ChildAcceptance (Critical):** Boolean Multiplier. If User A has a child and User B says "No Children", the score becomes 0 immediately.

## ---

**5\. Data & Storage Strategy**

| Type | Technology | Purpose |
| :---- | :---- | :---- |
| **Primary (Relational)** | **PostgreSQL** (Supabase/AWS RDS) | Storing structured user profiles, caste/sub-caste hierarchies, and transaction logs. ACID compliance is mandatory for donation records. |
| **Hot (NoSQL)** | **Firestore** | Chat messages, "Online" status, Live Match feeds. |
| **Cache** | **Redis** | Caching "Daily Recommendations" and API responses to reduce database costs. |
| **Object Storage** | **AWS S3** | **Buckets:** 1\. public-profiles: Watermarked, low-res images (WebP). 2\. secure-docs: **AES-256 Encrypted** bucket for sensitive proofs (Death Certificates). Access restricted to Admin IP addresses. |

## ---

**6\. Voice & Vernacular Stack (Bhashini Integration)**

To support illiterate users ("Savitri" persona), we integrate the **Bhashini API** (Govt of India).

* **Pipeline ID:** 64392f96daac500b55c543cd (Generic ASR+NMT+TTS)  
* **Workflow:**  
  1. **Input:** User taps "Mic" and speaks in Marathi (*"Mala Shegaon madhe mulga pahije"*).  
  2. **ASR (Speech-to-Text):** Converts audio to Marathi text.  
  3. **NLU (Intent)**: Extracts entities \-\> Location: Shegaon, Gender: Male.  
  4. **Action:** App automatically applies filters and shows results.  
  5. **Output (TTS):** App reads out the first match: *"Ramesh, vay 35, shetkari..."*

## ---

**7\. Security Architecture (The "Geeknik" Standard)**

### **7.1 Privacy & Anonymity**

* **Phone Masking:** Integration with **Exotel** or **Twilio**.  
  * *Feature:* "Safe Call". When a user clicks Call, the server dials both parties and bridges them. Neither party sees the other's real number.  
* **Screenshot Block:**  
  * Android: window.setFlags(WindowManager.LayoutParams.FLAG\_SECURE) prevents the OS from capturing the screen on Profile pages.

### **7.2 DevSecOps (Pipeline Security)**

* **Static Analysis (SAST):** SonarQube runs on every commit to check for code quality.  
* **Dynamic Analysis (DAST):** **Nuclei** runs against the staging API to check for:  
  * Exposed Firebase Keys.  
  * Missing Security Headers.  
  * IDOR (Insecure Direct Object References) \- e.g., User A accessing User B's photo by changing the ID in the URL.

## ---

**8\. Integrations & Third-Party Services**

1. **Payment Gateway:** **Razorpay**.  
   * *Configuration:* "Payment Pages" for Donations. Enabled **Automated 80G Receipt** webhook.  
2. **SMS/WhatsApp:** **Gupshup** or **Interakt**.  
   * *Usage:* Sending "New Interest" alerts via WhatsApp (higher open rate than Push Notifications in rural India).  
3. **Maps:** **MapmyIndia (Mappls)**.  
   * *Why:* Better rural village data in Maharashtra compared to Google Maps.

## ---

**9\. Implementation Roadmap**

### **Phase 1: The Foundation (Weeks 1-4)**

* Setup **Monorepo** (Nx or Turborepo) containing apps/mobile, apps/web, and backend.  
* Deploy **Next.js Admin Panel** to Vercel.  
* Setup **Firebase Project** (Auth \+ Firestore).

### **Phase 2: The Core (Weeks 5-8)**

* Build Flutter App Shell (Login, Profile Form).  
* Implement **Offline Sync** using Isar \+ WorkManager.  
* Staff begins digitizing paper forms via Admin Panel.

### **Phase 3: The Intelligence (Weeks 9-12)**

* Deploy **NestJS Backend** to Cloud Run.  
* Implement **Matchmaking Algorithm**.  
* Integrate **Bhashini Voice API**.

### **Phase 4: Security Audit (Week 13\)**

* Run **Nuclei** scans.  
* Manual Penetration Testing on "Widow Identity" protection features.

[image1]: <data:image/png;base64,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>