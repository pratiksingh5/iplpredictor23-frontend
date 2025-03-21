# IPL Predictor 2024

## Live Demo 🎯
🔗 **[IPL Predictor 2024](https://iplpredictor2024.netlify.app/)**

## Overview 📌
IPL Predictor 2024 is a web-based application that allows users to predict match winners, track their voting history, and view match statistics. The app includes user authentication, dynamic match data, and an intuitive interface for predictions.

## Features ✨
- **User Authentication:** Login and track personal match predictions.
- **Match Prediction:** Select the winner for each match and compete with others.
- **Voting History:** View past match predictions and their accuracy.
- **Dynamic Data:** Matches and votes update dynamically based on the selected year.
- **Admin Panel (If applicable):** Admins can manage matches and users.

## Tech Stack 🛠
- **Frontend:** React.js, React Router, Redux Toolkit, ShadCN UI
- **Backend:** Node.js, Express.js, MongoDB
- **State Management:** Redux Toolkit
- **Deployment:** Netlify (Frontend), Vercel (Backend)
- **Storage:** Cloudinary


## Installation & Setup 🚀
### Prerequisites
Ensure you have **Node.js** installed on your system.

### Clone the Repository
```sh
 git clone https://github.com/yourusername/ipl-predictor-2024.git
 cd ipl-predictor-2024
```

### Install Dependencies
```sh
npm install
```

### Environment Variables
Create a `.env` file in the root directory and add:
```
REACT_APP_API_URL=<your-backend-url>
```

### Run the Application
```sh
npm start
```

## Sample Credentials 📝
- **Email:** `pratikrajaryan@gmail.com`
- **Password:** `thehumorbro`

## API Endpoints ⚡
| Method | Endpoint                 | Description |
|--------|--------------------------|-------------|
| GET    | `/users/:userId?year=YYYY` | Fetch user data with voting stats |
| GET    | `/matches?year=YYYY`       | Fetch match history for the given year |
| POST   | `/auth/login`              | User login |
| POST   | `/votes`                    | Submit a match prediction |

## Contribution 🤝
Feel free to contribute by creating a pull request or reporting issues.

## License 📜
Self Developed By Me

---
🎉 Enjoy predicting IPL matches and competing with others!