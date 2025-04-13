# Scrapel

**The No-Code Web Scraping Platform**  
A powerful, no-code web scraping platform that allows users to easily create, execute, and manage web scrapers through an intuitive drag-and-drop workflow builder.

---

## 🚀 Overview

**Scrapel** is a no-code platform designed to simplify the process of web scraping. Users can create customized web scrapers using a drag-and-drop workflow builder, with AI-powered data extraction, automated workflow execution, and a secure credential management system. Scrapel ensures accurate data extraction with real-time monitoring, workflow validation, and credit-based billing management.

---

## 🛠️ Features

- **Drag-and-Drop Workflow Builder**: Allows users to visually design web scrapers by dragging and connecting different components, making the process simple and intuitive.
- **AI-Powered Data Extraction**: Automatically extracts relevant data from web pages and ensures correctness before saving to prevent errors.
- **Manual and Scheduled Execution**: Users can execute workflows manually or schedule them using a BFS algorithm, with real-time monitoring of progress and output.
- **Detailed Execution History**: Provides insights into past executions with detailed execution history tracking, helping users understand workflow performance and results.
- **Credential Management**: Ensures safe and seamless integration of credentials into workflows, protecting sensitive information.
- **Dashboard for Workflow Stats**: Visualizes workflow performance, credit consumption, and execution data, helping users track their usage.
- **Credit-Based Billing System**: Integrated with Razorpay for payment management, allowing users to purchase credits and manage payments efficiently.

---

## 🧰 Tech Stack

- **Fullstack Framework**: Next.js  
- **Database**: PostgreSQL (with Prisma ORM)  
- **Authentication**: Clerk  
- **UI Libraries**: CSS, Tailwind CSS, Shadcn UI  
- **Workflow Editor**: React Flow  
- **Web Scraping**: Puppeteer  
- **Serverless Functions**: Vercel Serverless Functions  
- **Payment Integration**: Razorpay  
- **Deployment**: Vercel  
- **Scheduling**: API is created but cloud service is needed (not used due to cost constraints)  
- **Forms**: Zod, React Hook Form  



---

## 📦 Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Ujjwal2327/Scrapel.git
   cd Scrapel
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**

   Create a `.env` file in the root directory and add the necessary environment variables.

    ```env
    # Node.js environment mode
    NODE_ENV=development                         # Set to "development" or "production"
    
    # Clerk authentication URLs
    NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in       # Sign-in page URL for Clerk
    NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up       # Sign-up page URL for Clerk
    NEXT_PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL=/workflows    # Redirect URL after sign-in
    NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL=/setup        # Redirect URL after sign-up
    
    # Clerk API keys
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY           # Public API key for Clerk
    CLERK_SECRET_KEY                            # Secret API key for Clerk
    
    # Database connection URL
    DATABASE_URL=                               # PostgreSQL connection string (with Prisma)
    
    # Application base URL
    NEXT_PUBLIC_APP_URL=http://localhost:3000   # Base URL of the application (use for local and production environments)
    
    # Secret keys for API and encryption
    API_SECRET                                  # Secret key for API
    ENCRYPTION_KEY                              # Encryption key used for securing sensitive data
    
    # Demo user credentials (for testing purposes)
    DEMO_USER_EMAIL=demouse2327@gmail.com       # Demo user email
    DEMO_USER_PASSWORD=demo_2327                # Demo user password
    
    # Razorpay payment gateway keys
    NEXT_PUBLIC_RAZORPAY_KEY_ID                 # Public Razorpay Key ID
    RAZORPAY_KEY_ID                             # Secret Razorpay Key ID
    RAZORPAY_KEY_SECRET                         # Razorpay Key Secret
    
    # Development mode toggle
    NEXT_PUBLIC_DEV_MODE=true                   # Set to true for development mode, false for production

    ```

4. **Run the development server:**

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

---

## ⏰ Time Spent on This Project

[![Wakatime](https://wakatime.com/badge/user/df6917f7-6186-4bb8-8288-531f1bfab139/project/078d5669-70d1-434a-8509-7da2b4007420.svg)](https://wakatime.com/@ujjwal2327/projects/jtizhapihy)

---

## 🤝 Contributing

Contributions are welcome! If you have suggestions or improvements, feel free to fork the repository and submit a pull request.
