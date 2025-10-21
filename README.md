# CPUT Marketplace and Exchange

A modern, responsive marketplace platform designed for CPUT students to buy, sell, and exchange products safely and efficiently.

## 🚀 Features

- **User Authentication**: Secure registration and login system
- **Product Management**: Post, browse, and search products by category
- **Real-time Chat**: Direct messaging between buyers and sellers
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Category System**: Organized product browsing by categories
- **Rating System**: Rate and review your marketplace experience
- **Reporting System**: Report users or issues to maintain platform safety
- **Notifications**: Stay updated with platform news and FAQs

## 📋 Prerequisites

Before running the application, ensure you have:

- Node.js (v16 or higher)
- MySQL (v8.0 or higher)
- A web browser (Chrome, Firefox, Safari, etc.)

## 🛠️ Setup Instructions

### 1. Database Setup

1. Start your MySQL server
2. Open a terminal/command prompt
3. Run the following commands:

```bash
# Navigate to the project directory
cd "path/to/CPUT-Marketplace-and-Exchange"

# Create and setup the database
mysql -u root -p < server/db/schema.sql
```

### 2. Install Dependencies

```bash
# Navigate to the server directory
cd server

# Install required Node.js packages
npm install
```

### 3. Configure Database Connection

Update the database credentials in `server/models/db.js`:

```javascript
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'YOUR_MYSQL_PASSWORD',  // Update this
  database: 'cput',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
```

### 4. Start the Application

```bash
# From the project root directory
node server/server.js
```

The server will start on `http://localhost:3000`

## 🎯 How to Use

### Getting Started

1. **Visit the Homepage**: Open `http://localhost:3000` in your browser
2. **Create Account**: Click the user icon → Register with username and password
3. **Login**: Use your credentials to access full functionality

### Key Features

#### 🛒 **Browse Products**
- View featured products on the homepage
- Browse by categories in the sidebar
- Use the search function to find specific items

#### 📝 **Post Products**
- Click "Post product" in the sidebar
- Fill in product details (name, price, category)
- Upload an image
- Submit to list your product

#### 💬 **Chat with Sellers**
- Click on any product to view details
- Click "Message Seller" to start a conversation
- Access chat history from the messenger icon

#### 🔍 **Search & Filter**
- Use the search bar to find products
- Filter by categories
- Browse the dedicated search page for advanced options

#### 🔔 **Stay Informed**
- Click the notification bell for platform updates
- Read FAQs and safety guidelines
- Check developer announcements

### Navigation

- **🏠 Home Icon**: Return to homepage
- **💬 Messenger Icon**: Access chat functionality  
- **🔔 Notifications Icon**: View updates and FAQs
- **👤 User Icon**: Login/logout and account management

## 🏗️ Project Structure

```
CPUT-Marketplace-and-Exchange/
├── server/                 # Backend application
│   ├── models/            # Database models
│   ├── routes/            # API endpoints
│   ├── db/               # Database schema
│   └── server.js         # Main server file
├── home/                 # Homepage files
├── chat/                 # Chat functionality
├── search/               # Search page
├── login/                # Authentication pages
├── img/                  # Images and uploads
└── README.md            # This file
```

## 🔧 Troubleshooting

### Database Issues
- Ensure MySQL is running
- Check database credentials in `db.js`
- Verify the 'cput' database exists

### Server Won't Start
- Check if port 3000 is available
- Ensure all npm dependencies are installed
- Verify Node.js version compatibility

### Images Not Loading
- Check if `img/uploads/` directory exists
- Ensure proper file permissions
- Verify image paths in database

## 🔒 Security Features

- Password hashing with bcrypt
- Session-based authentication
- SQL injection protection
- File upload validation
- CORS protection

## 🎨 Customization

The application uses modular CSS files:
- `home/homestyle.css` - Main styling
- `search/search.css` - Search page styling  
- `chat/chatstyle.css` - Chat interface styling

## 📱 Responsive Design

Optimized breakpoints:
- Desktop: 1024px+
- Tablet: 768px - 1023px
- Mobile: 480px - 767px
- Small Mobile: < 480px

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For technical issues or feature requests, use the reporting system within the application or contact the development team.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Happy trading! 🛍️**
