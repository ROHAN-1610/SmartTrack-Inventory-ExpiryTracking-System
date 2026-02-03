# SmartTrack Inventory & Expiry Management System

## Overview
SmartTrack is an enterprise-grade inventory and expiry tracking system built with Java Spring Boot, React, and MySQL. It provides comprehensive batch tracking, expiry management, and real-time analytics.

## Features
- ✅ Real-time Dashboard with Analytics
- ✅ Batch/Lot Number Tracking
- ✅ Expiry Date Management (FEFO/FIFO)
- ✅ Automated Expiry Alerts
- ✅ Multi-Category Inventory Management
- ✅ Wastage Reduction Tracking
- ✅ Role-Based Access Control
- ✅ Comprehensive Reporting
- ✅ RESTful API Architecture
- ✅ Responsive Modern UI

## Technology Stack
- **Backend**: Java 17, Spring Boot 3.2.0
- **Frontend**: React 18, Material-UI, Chart.js
- **Database**: MySQL 8.0
- **Security**: Spring Security with JWT
- **Build Tools**: Maven (Backend), npm (Frontend)

## Project Structure
```
smarttrack-inventory/
├── backend/                  # Spring Boot Application
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/smarttrack/
│   │   │   │   ├── config/
│   │   │   │   ├── controller/
│   │   │   │   ├── dto/
│   │   │   │   ├── entity/
│   │   │   │   ├── repository/
│   │   │   │   ├── service/
│   │   │   │   ├── security/
│   │   │   │   └── SmartTrackApplication.java
│   │   │   └── resources/
│   │   │       ├── application.properties
│   │   │       └── schema.sql
│   │   └── test/
│   └── pom.xml
├── frontend/                 # React Application
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
└── README.md
```

## Installation & Setup

### Prerequisites
- Java 17 or higher
- Node.js 16+ and npm
- MySQL 8.0+
- Maven 3.6+

### Database Setup
1. Create MySQL database:
```sql
CREATE DATABASE smarttrack_inventory;
```

2. Update database credentials in `backend/src/main/resources/application.properties`

### Backend Setup
```bash
cd backend
mvn clean install
mvn spring-boot:run
```
Backend will run on: http://localhost:8080

### Frontend Setup
```bash
cd frontend
npm install
npm start
```
Frontend will run on: http://localhost:3000

## Default Credentials
- **Username**: admin
- **Password**: admin123

## API Documentation
Once the backend is running, access Swagger UI at:
http://localhost:8080/swagger-ui.html

## Key Endpoints
- `POST /api/auth/login` - User authentication
- `GET /api/dashboard/overview` - Dashboard metrics
- `GET /api/inventory` - Get all inventory items
- `GET /api/inventory/near-expiry` - Get items nearing expiry
- `POST /api/inventory` - Add new inventory item
- `GET /api/reports/wastage` - Wastage trend report
- `GET /api/alerts` - Get active alerts

## Configuration

### Application Properties
Edit `backend/src/main/resources/application.properties`:
- Database connection settings
- JWT secret key
- Server port
- Expiry alert thresholds

### Environment Variables
```bash
DB_HOST=localhost
DB_PORT=3306
DB_NAME=smarttrack_inventory
DB_USERNAME=root
DB_PASSWORD=yourpassword
JWT_SECRET=your-secret-key
```

## Features in Detail

### 1. Dashboard Overview
- Total stock count across categories
- Inventory value tracking
- Near expiry alerts (30 days)
- Expired items count
- 6-month expiry forecast
- Stock distribution by category

### 2. Inventory Management
- CRUD operations for products
- Batch/lot number tracking
- Manufacturing and expiry dates
- Quantity management
- Category-based organization
- Search and filter capabilities

### 3. Expiry Tracking
- FEFO (First Expiry, First Out) logic
- Automated expiry alerts
- Configurable alert thresholds
- Critical expiry reports
- Restock recommendations

### 4. Reports & Analytics
- Inventory value by category
- Wastage reduction trends
- Expiry analytics
- Stock movement reports
- Supplier performance

### 5. User Management
- Role-based access (Admin, Manager, Operator)
- Secure authentication with JWT
- Activity audit logs

## Business Logic

### FEFO Implementation
The system automatically prioritizes items based on expiry dates:
1. Items expiring soonest are flagged first
2. Restock recommendations for expired/near-expiry items
3. Wastage calculation and trending

### Alert System
- **Critical**: Items expired
- **Warning**: Items expiring within 30 days
- **Info**: Items expiring within 60 days

## Testing
```bash
# Backend tests
cd backend
mvn test

# Frontend tests
cd frontend
npm test
```

## Deployment

### Docker Deployment (Optional)
```bash
docker-compose up -d
```

### Production Build
```bash
# Backend
mvn clean package -DskipTests

# Frontend
npm run build
```

## Troubleshooting

### Common Issues
1. **Database connection failed**: Check MySQL is running and credentials are correct
2. **Port already in use**: Change port in application.properties
3. **CORS errors**: Verify frontend URL in CorsConfig.java
4. **JWT token expired**: Token validity is 24 hours, re-login required

## Contributing
1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License
This project is licensed under the MIT License.

## Support
For issues and questions:
- Create an issue on GitHub
- Email: support@smarttrack.com

## Roadmap
- [ ] Mobile app (React Native)
- [ ] Barcode/QR code scanning
- [ ] Multi-warehouse support
- [ ] Advanced predictive analytics
- [ ] Integration with ERP systems
- [ ] Automated reorder system
- [ ] Email/SMS notifications

## Credits
Developed for enterprise inventory management with focus on expiry tracking and waste reduction.

---
**Version**: 1.0.0  
**Last Updated**: December 2025

