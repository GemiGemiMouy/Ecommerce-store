# 🛍️ Ecommerce Store

A modern, full-featured ecommerce application built with React, TypeScript, and Tailwind CSS. This project showcases a complete online shopping experience with advanced features like dark mode, profile management, shopping cart, wishlist, and comprehensive debugging tools.

## ✨ Features

### 🎨 **Modern UI/UX**
- **Dark/Light Mode**: Seamless theme switching with persistent preferences
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Modern Animations**: Smooth transitions and hover effects
- **Glass-morphism Design**: Contemporary UI with backdrop blur effects

### 👤 **User Management**
- **User Authentication**: Secure login and registration system
- **Profile Management**: Complete user profile with avatar upload
- **Profile Picture Upload**: Modern drag-and-drop image upload with Base64 storage
- **Account Settings**: Comprehensive settings management
- **User Dashboard**: Personalized user experience

### 🛒 **Shopping Experience**
- **Product Catalog**: Browse products with advanced filtering
- **Product Details**: Detailed product pages with image galleries
- **Shopping Cart**: Full cart functionality with quantity management
- **Wishlist**: Save favorite products for later
- **Search Functionality**: Advanced product search with real-time results

### 🔧 **Advanced Features**
- **Profile Tools**: Comprehensive debugging and testing tools
- **Data Export**: Export user profile data as JSON
- **Local Storage**: Persistent data storage
- **Context Management**: Efficient state management with React Context
- **TypeScript**: Full type safety and better development experience

## 🚀 Tech Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom components
- **State Management**: React Context API
- **Routing**: React Router v6
- **Icons**: Heroicons (SVG)
- **Build Tool**: Create React App
- **Package Manager**: npm

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Navbar.tsx      # Navigation component
│   ├── CartItem.tsx    # Shopping cart item component
│   ├── Input.tsx       # Custom input component
│   └── ImageUpload.tsx # Image upload component
├── pages/              # Main application pages
│   ├── Profile.tsx     # User profile page
│   ├── Cart.tsx        # Shopping cart page
│   ├── ProductDetail.tsx # Product details page
│   └── About.tsx       # About page
├── context/            # React Context providers
│   ├── AuthContext.tsx # Authentication context
│   ├── CartContext.tsx # Shopping cart context
│   ├── WishlistContext.tsx # Wishlist context
│   ├── SearchContext.tsx # Search context
│   └── ThemeContext.tsx # Theme management context
├── types/              # TypeScript type definitions
└── App.tsx            # Main application component
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <your-repository-url>
   cd ecommerce-store
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

## 🎯 Key Components

### Profile Page
- **Modern Design**: Glass-morphism UI with gradient backgrounds
- **Avatar Management**: Upload, test, and manage profile pictures
- **Debug Tools**: Comprehensive testing and debugging utilities
- **Data Export**: Export user profile data as JSON
- **Settings Management**: Complete account settings interface

### Shopping Cart
- **Advanced Features**: Coupon codes, shipping options, recommendations
- **Modern UI**: Clean, intuitive cart interface
- **Quantity Management**: Easy quantity adjustment
- **Product Recommendations**: Smart product suggestions

### Navigation
- **Responsive**: Works on all device sizes
- **User Integration**: Shows user avatar and profile info
- **Search Integration**: Built-in search functionality
- **Theme Toggle**: Easy dark/light mode switching

## 🔧 Development Features

### Profile Tools (Debug Mode)
- **Avatar Testing**: Test different avatar types and formats
- **LocalStorage Testing**: Verify browser storage functionality
- **System Information**: Display browser capabilities and system info
- **Data Management**: Export and clear user data
- **Profile Refresh**: Force UI refresh and state updates

### Context Management
- **AuthContext**: User authentication and profile management
- **CartContext**: Shopping cart state and operations
- **WishlistContext**: Wishlist management
- **SearchContext**: Search functionality and filters
- **ThemeContext**: Dark/light mode theme management

## 🎨 Design System

### Color Palette
- **Primary**: Modern grays with gradient accents
- **Dark Mode**: Deep grays with blue accents
- **Light Mode**: Clean whites with subtle shadows
- **Accent Colors**: Blue, green, purple, red for different actions

### Typography
- **Headings**: Bold, modern font weights
- **Body Text**: Clean, readable typography
- **Responsive**: Scales appropriately across devices

### Components
- **Buttons**: Modern rounded buttons with hover effects
- **Cards**: Glass-morphism cards with subtle shadows
- **Modals**: Centered modals with backdrop blur
- **Forms**: Clean form inputs with proper validation

## 📱 Responsive Design

- **Mobile First**: Designed for mobile devices first
- **Tablet Optimized**: Perfect experience on tablets
- **Desktop Enhanced**: Additional features for desktop users
- **Touch Friendly**: Optimized for touch interactions

## 🔒 Security Features

- **Type Safety**: Full TypeScript implementation
- **Input Validation**: Proper form validation
- **Secure Storage**: Safe local storage implementation
- **Error Handling**: Comprehensive error management

## 🚀 Performance

- **Optimized Builds**: Create React App for fast development and builds
- **Code Splitting**: Efficient bundle splitting
- **Lazy Loading**: Components loaded as needed
- **Image Optimization**: Optimized image handling

## 📝 Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React Team** - For the amazing React framework
- **Tailwind CSS** - For the utility-first CSS framework
- **Heroicons** - For the beautiful SVG icons
- **Create React App** - For the development setup

## 📞 Support

If you have any questions or need help with this project, please:
- Open an issue on GitHub
- Contact the development team
- Check the documentation

---

**Built with ❤️ using React, TypeScript, and Tailwind CSS**
