
# ChoreoLoop - Dance Practice Revolutionized

ChoreoLoop is a web application designed to transform how dancers learn and practice choreography. By breaking down YouTube dance tutorials into manageable, loopable sections, ChoreoLoop helps dancers practice more efficiently and effectively.

## 🌟 Features

### 🎬 Routine Creation
- Create practice routines from any YouTube dance tutorial
- Break down choreography into manageable sections
- Set custom repetition counts for each section
- Track progress and practice history

### 🔁 Smart Practice Mode
- Loop specific sections of choreography
- Control playback speed (0.5x, 0.75x, 1x)
- Automated repetition counting
- Progressive difficulty increase

### 📊 Progress Tracking
- Visual progress bars for each routine
- Last practiced date tracking
- Session summaries with achievements

## 💻 Technical Stack

This project is built with:
- **React** with **TypeScript** for a robust frontend experience
- **Vite** as the build tool for fast development
- **Tailwind CSS** for responsive, utility-first styling
- **shadcn/ui** for beautiful, accessible UI components
- **React Router** for navigation
- **LocalStorage** for persistent data management

## 🚀 Getting Started

### Prerequisites
- Node.js (v16.0.0 or later)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone [your-repo-url]

# Navigate to the project directory
cd choreo-loop

# Install dependencies
npm install

# Start the development server
npm run dev
```

## 📱 Application Structure

- **Home Page**: Introduction to ChoreoLoop with key features
- **My Routines**: View, manage, and practice your saved routines
- **Create Routine**: Set up a new practice routine from a YouTube tutorial
- **Practice Mode**: Focused environment for practicing your routine sections
- **About**: Learn more about the philosophy behind ChoreoLoop
- **How It Works**: Step-by-step guide on using the application

## 👨‍💻 Development

### Adding a New Section to a Routine
1. Navigate to Edit Routine
2. Specify section name, start time, end time, and desired repetitions
3. Save the section to add it to your routine

### Practice Flow
1. Select a routine from your dashboard
2. Begin with the first unpracticed section
3. Complete the required repetitions at each speed level
4. Progress through each section until the entire routine is mastered

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

- YouTube API for video integration
- The dance community for inspiration and feedback
- All contributors to the open-source libraries used in this project

