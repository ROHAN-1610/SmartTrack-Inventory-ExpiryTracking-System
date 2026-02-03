# SmartTrack Inventory System - Quick Start Guide

## Prerequisites
- Java 17 or higher
- Maven 3.6+
- Node.js 16+ and npm
- MySQL 8.0+

## Step 1: Database Setup

### Create Database
```sql
CREATE DATABASE smarttrack_inventory;
CREATE USER 'smarttrack'@'localhost' IDENTIFIED BY 'smarttrack123';
GRANT ALL PRIVILEGES ON smarttrack_inventory.* TO 'smarttrack'@'localhost';
FLUSH PRIVILEGES;
```

### Configure Database Connection
Edit `backend/src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/smarttrack_inventory
spring.datasource.username=root
spring.datasource.password=yourpassword
```

## Step 2: Start Backend (Spring Boot)

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

Backend will start on: **http://localhost:8080**

### Verify Backend
- API: http://localhost:8080/api/dashboard/overview
- Swagger UI: http://localhost:8080/swagger-ui.html

## Step 3: Start Frontend (React)

```bash
cd frontend
npm install
npm start
```

Frontend will start on: **http://localhost:3000**

## Step 4: Login

Navigate to http://localhost:3000

**Default Credentials:**
- Username: `admin`
- Password: `admin123`

## Project Structure

```
smarttrack-inventory/
├── backend/                    # Spring Boot Application
│   ├── src/main/java/          # Java source code
│   ├── src/main/resources/     # Configuration files
│   └── pom.xml                 # Maven dependencies
├── frontend/                   # React Application
│   ├── src/                    # React source code
│   ├── public/                 # Static files
│   └── package.json            # npm dependencies
└── README.md                   # Full documentation
```

## Key Features

✅ Dashboard with real-time analytics
✅ Batch/Lot tracking
✅ Expiry date management (FEFO/FIFO)
✅ Automated alerts
✅ Multi-category inventory
✅ Comprehensive reporting
✅ Role-based access control

## API Endpoints

### Authentication
- POST `/api/auth/login` - User login

### Dashboard
- GET `/api/dashboard/overview` - Dashboard metrics

### Inventory
- GET `/api/inventory` - Get all inventory
- GET `/api/inventory/near-expiry?days=30` - Near expiry items
- GET `/api/inventory/expired` - Expired items
- POST `/api/inventory` - Add new batch
- PUT `/api/inventory/{id}` - Update batch
- DELETE `/api/inventory/{id}` - Delete batch

## Troubleshooting

### Backend won't start
- Check MySQL is running: `systemctl status mysql`
- Verify database credentials in application.properties
- Check port 8080 is not in use: `lsof -i :8080`

### Frontend won't start
- Delete node_modules: `rm -rf node_modules`
- Clear cache: `npm cache clean --force`
- Reinstall: `npm install`

### CORS errors
- Verify backend is running
- Check `app.cors.allowed-origins` in application.properties
- Should be: `http://localhost:3000`

### Database connection failed
```bash
# Test MySQL connection
mysql -u root -p
# Create database if not exists
CREATE DATABASE IF NOT EXISTS smarttrack_inventory;
```

## Default Data

The system comes with pre-populated data:
- **Users**: admin/admin123
- **Categories**: Food & Beverage, Medicine & Pharma, Cosmetics, Electronics
- **Suppliers**: Sample suppliers

## Next Steps

1. ✅ Configure email notifications (optional)
2. ✅ Set up barcode scanning (optional)
3. ✅ Integrate with ERP systems (optional)
4. ✅ Deploy to production server

## Production Deployment

### Backend (JAR)
```bash
cd backend
mvn clean package -DskipTests
java -jar target/inventory-system-1.0.0.jar
```

### Frontend (Build)
```bash
cd frontend
npm run build
# Serve the build folder with nginx or apache
```

## Support

For issues:
- Check logs: `backend/logs/spring-boot.log`
- Review console errors in browser DevTools
- Verify API responses in Network tab

## License
MIT License

---
**Version**: 1.0.0
**Last Updated**: December 2025
