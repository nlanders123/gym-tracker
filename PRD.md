# NeilFit (Gym & Nutrition Tracker MVP)

## 1. Objective
Transform the existing static `gym-tracker` HTML prototype into a fully functional, cloud-synced workout and nutrition tracker designed specifically for Neil. It will serve as a direct replacement for MyFitnessPal (MFP) while retaining a focus on fast, frictionless logging.

## 2. Platform Strategy
*   **Web/PWA First:** This is the easiest and fastest path to market. It works immediately across Neil's desktop, laptop, and iPhone (via Safari 'Add to Home Screen').
*   **Data Sync:** Supabase (PostgreSQL + Auth). This provides robust, real-time sync across devices so Neil can log breakfast on his phone and see it on his Mac.

## 3. Core Modules

### Module A: Workouts (Refinement of Existing Prototype)
*   Retain the core functionality of the existing app: `Templates` and `Sessions`.
*   Users can create a session from a template or start an empty one.
*   Exercises log `Sets` (Weight x Reps).
*   *Enhancement:* Progressive Overload History (view previous weight/reps for a specific exercise while logging today's session).

### Module B: Nutrition (The MFP Replacement)
*   **Daily Log:** Split by Breakfast, Lunch, Dinner, Snacks.
*   **Macro Targets:** Global daily targets for Protein (P), Fat (F), and Carbs (C), generating a total Calorie count.
*   **Logging Modes:**
    *   *Quick Add Macros:* Easiest friction path. E.g., just enter "30g P, 10g F, 40g C".
    *   *Saved Foods:* A personal database of common foods Neil eats.
    *   *Saved Meals:* E.g., "Standard Morning Oats" (pre-loads the macros for all ingredients).
    *   *Repeat Yesterday:* One-click copy of a meal from the previous day.

## 4. Tech Stack
*   **Frontend:** React 18, Tailwind CSS, Vite (migrating away from the single `index.html` CDN approach for better scalability).
*   **Backend / DB:** Supabase.
*   **Hosting:** Vercel.

## 5. Phase 1 Implementation Steps
1.  **Repository Setup:** Convert the existing CDN-based `index.html` into a proper Vite + React project.
2.  **Supabase Integration:** Set up the database schema (Users, Workouts, Nutrition Logs) and wire up basic authentication.
3.  **Workout Migration:** Port the existing local-storage workout logic to read/write from Supabase.
4.  **Nutrition UI:** Build the macro logging interface (Daily view, Quick Add, Targets).
5.  **Deployment:** Push to Vercel and test as a PWA on Neil's iPhone.

*Future Phases (Not in MVP): OpenFoodFacts integration, Barcode scanning, Apple Health sync.*
