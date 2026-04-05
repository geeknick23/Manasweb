# **Product Requirements Document (MVP): Manas Foundation & "Manas Bandhan" App**

## **1\. Executive Summary**

**Product Name:** Manas Bandhan (Working Title)

**Platform:** Android (Primary), iOS (Secondary), Web Admin Panel

**Target Audience:** Widows, divorcees, tribal women in the Vidarbha region, and prospective grooms seeking meaningful alliances.

**Primary Goal (MVP):** To launch a functional, user-friendly mobile application that digitizes the Manas Foundation's existing paper-based matchmaking operations and provides a digital storefront for their social work, without the friction of complex verification barriers at this stage.

## ---

**2\. Module A: NGO Information Hub (Website Content Replica)**

*This module replicates the informational structure of a standard NGO website, ensuring users understand the organization's legitimacy and mission.*

### **2.1 Screen: Home / Dashboard**

* **Hero Banner:** A carousel displaying images of recent *Punarvivah Melavas* (Remarriage Gatherings) and Ashram School activities.  
* **Welcome Message:** A note from **Prof. D.S. Lahane** (Founder/President) welcoming users to the digital platform.1  
* **Quick Action Buttons:**  
  * "Register for Marriage"  
  * "Donate"  
  * "Contact Us"

### **2.2 Screen: About Us**

* **Organization Profile:** "Manas Foundation is a social organization based in Khamgaon, Buldhana, dedicated to the empowerment of marginalized women. Our core mission is the rehabilitation of widows and divorcees through social reintegration and remarriage."3  
* **Mission Statement:** To eradicate the stigma associated with widowhood and facilitate dignified *Satyashodhak* (Truth-Seeker) marriages free from dowry and regressive customs.  
* **Leadership:** Profile of **Prof. D.S. Lahane** and the core committee.

### **2.3 Screen: Our Projects (Activity Feed)**

* **Widow Remarriage (*Punarvivah*):** Details about upcoming matchmaking events, success stories of couples reunited, and the foundation's "Zero Dowry" policy.  
* **Tribal Welfare (*Adivasi Vikas*):** Information on the Ashram Schools run for tribal children in the region, highlighting education and nutrition initiatives.  
* **Old Age Home:** Details regarding the proposed/active old age home facility for the destitute elderly.

### **2.4 Screen: Donate (Simple Integration)**

* **Direct Bank Transfer:** Display of the NGO's official bank account details (Account Name, Account Number, IFSC, Branch) for manual transfers.  
* **UPI Integration:** A static QR code or deep-link intent for payments via GPay/PhonePe.  
* **Call to Action:** "Support a Widow's Wedding" or "Sponsor a Tribal Child's Meal."

### **2.5 Screen: Contact Us**

* **Address:** Shiv Shilp, C/O S.S. Unhale, D P Road, Saoji Layout, Atali, Khamgaon \- 444303, Maharashtra.5  
* **Phone:** Direct "Click-to-Call" button for the office landline (07263-259292) and coordinator mobiles.5  
* **Map:** Google Maps integration pointing to the Khamgaon office.

## ---

**3\. Module B: Matchmaking Platform (MVP Features)**

*Designed to function like a simplified "Shaadi.com" tailored for the specific demographics of Vidarbha (Rural/Semi-Urban).*

### **3.1 User Registration & Login**

* **Phone Number Login:** Users sign up using their mobile number.  
* **OTP Verification:** A simple 4-digit OTP via SMS (using Firebase Auth or similar) to validate the phone number. *No email requirement to keep entry barriers low.*

### **3.2 Profile Creation (The Biodata)**

* **Basic Details:** Name, Date of Birth (Auto-calculate Age), Height, Blood Group.  
* **Marital Status (Crucial):**  
  * Dropdown: Never Married / Widowed / Divorced / Separated.  
  * *If Widowed/Divorced:* A simplified text field for "Details of Past Marriage" (Optional in MVP).  
* **Children:**  
  * Radio Button: No Children / Yes, living with me / Yes, not living with me.  
* **Socio-Cultural:**  
  * Caste/Community (Includes "Caste No Bar" option for Satyashodhak matches).  
  * Education (10th, 12th, Graduate, etc.).  
  * Occupation (Farmer, Business, Service, Labour).  
* **Photos:** Upload up to 3 photos from the phone gallery.

### **3.3 Search & Discovery (Home Feed)**

* **Profile Cards:** Users see a scrollable list of potential matches.  
  * *Card Front:* Photo, Name, Age, Marital Status, Location (Village/Taluka).  
* **Basic Filters:**  
  * Filter by Age Range (e.g., 30-40).  
  * Filter by Marital Status (e.g., Show only Widows).  
  * Filter by District (Buldhana, Akola, Amravati).

### **3.4 Connection & Communication**

* **"Send Interest" Button:** A simple "Heart" or "Connect" button on a profile.  
* **"Interest Received" Tab:** Users can see who has liked their profile.  
* **Accept/Reject:** The user can Accept or Reject an incoming interest.  
* **Reveal Contact:** Once an interest is **Accepted**, the phone number of the other party becomes visible. Users can then call each other directly via their phone's dialer. *Note: In-app chat is excluded from MVP to reduce development cost and server complexity.*

## ---

**4\. Technical Specifications (MVP)**

### **4.1 Technology Stack**

* **Frontend:** **Flutter** (Dart) \- Allows generating both Android and iOS apps from a single codebase, ideal for a quick MVP launch.  
* **Backend:** **Firebase** (Google) \-  
  * **Authentication:** For Phone OTP.  
  * **Firestore:** For storing user profiles and match data (NoSQL is faster for flexible profile fields).  
  * **Storage:** For storing profile photos.  
* **Hosting:** Firebase Hosting (for the basic admin panel).

### **4.2 Non-Functional Requirements**

* **Language:** The app interface must be available in **Marathi** (Primary) and English (Secondary).  
* **Offline Mode:** Basic viewing of previously loaded profiles should work without internet (caching).  
* **Image Optimization:** Photos must be auto-compressed upon upload to save data for rural users.

## ---

**5\. User Flow Diagram (Simplified)**

1. **Splash Screen:** Manas Foundation Logo.  
2. **Language Select:** Marathi / English.  
3. **Login:** Enter Phone \-\> Enter OTP.  
4. **Onboarding:** Fill Biodata Form \-\> Upload Photo.  
5. **Main Tabs:**  
   * **Home:** List of Matches (Scrollable).  
   * **Search:** Filter options.  
   * **NGO Info:** About Us, Projects, Donate.  
   * **Profile:** Edit my biodata, View "Interests Received."

#### **Works cited**

1. manas foundation, accessed January 24, 2026, [https://manasfoundation.org/](https://manasfoundation.org/)  
2. AI-Powered Voice Assistant for Farmers \- AIKosh, accessed January 24, 2026, [https://aikosh.indiaai.gov.in/home/use-cases/details/ai\_powered\_voice\_assistant\_for\_farmers.html](https://aikosh.indiaai.gov.in/home/use-cases/details/ai_powered_voice_assistant_for_farmers.html)  
3. ANNUAL REPORT \- of Planning Commission, accessed January 24, 2026, [http://164.100.161.239/reports/genrep/ar\_eng0910.pdf](http://164.100.161.239/reports/genrep/ar_eng0910.pdf)  
4. Enhancing Water Project Sustainability through the Well Beyond App, accessed January 24, 2026, [https://wellawareworld.org/blog-sustainability-well-beyond-app/](https://wellawareworld.org/blog-sustainability-well-beyond-app/)  
5. Manas Foundation in Atali,Khamgaon \- NGOS \- Justdial, accessed January 24, 2026, [https://www.justdial.com/Khamgaon/Manas-Foundation-D-P-Road-Saoji-Layout-Atali/9999P7262-7262-140712111640-R7S2\_BZDET](https://www.justdial.com/Khamgaon/Manas-Foundation-D-P-Road-Saoji-Layout-Atali/9999P7262-7262-140712111640-R7S2_BZDET)  
6. 