🚂 Transportizy
A modern, responsive transportation booking platform offering seamless booking experiences for railway, airways, roadways, and cargo services.

✨ Features:
Multi-Modal Transport Booking: Book tickets for trains, flights, buses, and cargo shipments all in one place
Responsive Design: Fully optimized for desktop, tablet, and mobile devices
User Authentication: Login and signup functionality with modal-based forms
Interactive UI: Smooth animations, parallax effects, and dynamic form validation
Service-Specific Forms: Customized booking forms based on transport type
Real-Time Validation: Email and phone number validation with instant feedback
Smooth Navigation: Active section highlighting and smooth scrolling 

Demo Link: https://keshav1903k.github.io/Transportizy/

📋 Prerequisites
No special prerequisites needed! This is a static website that runs in any modern web browser.
🔧 Installation

Clone the repository:

bashgit clone https://github.com/yourusername/transportizy.git

Navigate to the project directory:

bashcd transportizy

Open index.html in your web browser:

bash# On macOS
open index.html

# On Linux
xdg-open index.html

# On Windows
start index.html
Or simply drag and drop index.html into your browser.
📁 Project Structure
transportizy/
│
├── index.html          # Main HTML file
├── styles.css          # Stylesheet with all styling
├── script.js           # JavaScript functionality
└── README.md          # Project documentation
🎯 Usage
Booking a Ticket

Navigate to the Services section
Click "Book Now" on your desired transport service
Fill in the booking form with:

Origin and destination
Travel date
Number of passengers (or cargo weight)
Class/type selection
Contact information


Submit the form

User Authentication

Click the "Login" button in the navigation bar
Choose between Login or Signup tabs
Enter your credentials
Submit the form

Contact Us

Scroll to the Contact section
Fill in your details and message
Submit the form to reach out to the team

🎨 Customization
Colors
The color scheme uses CSS custom properties defined in styles.css:
css:root {
    --primary-color: #4F46E5;      /* Indigo */
    --secondary-color: #10B981;    /* Green */
    --accent-color: #F59E0B;       /* Amber */
    --dark-color: #1F2937;         /* Dark Gray */
    --light-color: #F9FAFB;        /* Light Gray */
}
Modify these values to change the overall color scheme.
Adding New Services
To add a new transport service:

Add a new service card in the #services section of index.html
Update the openBookingForm() function in script.js to handle the new service
Add corresponding styling in styles.css if needed

🔒 Security Note
This is a frontend-only demonstration. For production use:

Implement backend authentication and authorization
Add server-side validation for all forms
Use HTTPS for secure data transmission
Implement proper database storage
Add payment gateway integration
Include booking confirmation emails

🤝 Contributing
Contributions are welcome! Please follow these steps:

Fork the repository
Create a new branch (git checkout -b feature/AmazingFeature)
Commit your changes (git commit -m 'Add some AmazingFeature')
Push to the branch (git push origin feature/AmazingFeature)
Open a Pull Request
