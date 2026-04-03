# 🖋️ Ink & Graphite Atelier: Productivity Dashboard

Welcome to the **Ink & Graphite Atelier**, a beautifully crafted productivity, habit, and file tracking dashboard designed to invoke the feeling of an architect's slate desk. The entire layout operates purely inside your local browser storage—providing offline-first, lightning-fast rendering without any risk of data loss on refresh!

### 🌟 Key Features
- **True Calendar Github-Style Heatmap:** The Habit system doesn't just do "Monday-Sunday". It maps mathematically across a precise 365-day calendar grid, rendering your precise streaks identically to the Github contribution graph.
- **Persistent Data Layers:** Refreshed the page? Opened a new tab? Don't worry, your tasks are securely committed to an IndexedDB backend cache automatically.
- **Chalk & Slate Dark Mode:** Toggling the mode completely reworks the visual theme utilizing high-contrast, sketch-oriented borders mapped to custom Tailwind utilities.
- **Rhythm & Date Tracking:** Specify exact starting dates for new habits. 

---

## 🚀 Running Your Atelier Locally

**Prerequisites:** You will need [Node.js](https://nodejs.org/en) installed on your PC or Laptop.

1. **Clone the Repository**
   Download this codebase onto your computer. Open your terminal/command prompt and navigate into the folder:
   ```bash
   cd DashBoard
   ```

2. **Install Dependencies**
   Run the following command to download all the local packages (Vite, React, Tailwind, Lucide Icons, etc):
   ```bash
   npm install
   ```

3. **Start the Development Server**
   To boot up the application, simply run:
   ```bash
   npm run dev
   ```
   *Your terminal will present a local link (e.g., `http://localhost:5173/`). Hold `Ctrl` (or `Cmd`) and click it to open your Atelier in your browser!*

## 🛠️ Usage Instructions
- **Start Rhythms:** Navigate to the `Habit Tracker`, click "Add Habit", supply a name and *Start Date*. Proceed to check off active blocks. Watch the heatmap populate dynamically!
- **Manage Files:** Drop reference materials into the File system; everything mimics visual drafting boards.
- **Goals Tracking:** Add explicit goals with deadlines in the Goal module. 

Everything operates privately in your local browser cache (`IndexedDB`). No servers, no sign-ups!

---
*Built intricately with React, Vite, and Tailwind v4.*
