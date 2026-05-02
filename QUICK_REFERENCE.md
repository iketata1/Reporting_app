# Quick Reference Guide - Mould Investigation Reporting App

## 🚀 Quick Start

### Access the Application
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5002
- **Health Check:** http://localhost:5002/health

### Current Status
- ✅ Backend: Running (Terminal 7, Port 5002)
- ✅ Frontend: Running (Terminal 4, Port 3000)
- ✅ Database: MongoDB Atlas (Connected)
- ✅ Uploads: D:/Reporting_app_uploads

---

## 📁 Key Files & Locations

### Configuration Files
- **Backend Port:** `.env` → PORT=5002
- **Frontend API URL:** `frontend/.env` → REACT_APP_API_URL=http://localhost:5002
- **Upload Directory:** `D:/Reporting_app_uploads`

### Main Application Files
- **Form:** `frontend/src/pages/CreateMouldReport.js`
- **Backend Server:** `backend/server.js`
- **Report Model:** `backend/models/Report.js`
- **PDF Generator:** `backend/controllers/reportController.js`
- **Upload Route:** `backend/routes/upload.js`

---

## 🔧 Common Commands

### Start Servers
```bash
# Backend (from project root)
npm start

# Frontend (from frontend folder)
cd frontend
npm start
```

### Stop/Restart Backend
```bash
# Stop: Ctrl+C in terminal
# Or use Kiro to stop Terminal 7

# Restart
npm start
```

### Check Server Status
```bash
# Backend health check
curl http://localhost:5002/health

# Frontend (open in browser)
http://localhost:3000
```

---

## 📝 Form Structure (6 Steps)

### Step 1: Basic Information
- Report title, type, date
- Client info, address
- **Investigation Findings** (bullet points)
- **Letter Introduction** (Dear Mr...)

### Step 2: Room Measurements (Section I)
- **Intro text** (before table)
- Add multiple rooms with:
  - Temperature, RH, CO₂, PM (with status: Normal/Warning/Critical)
  - Air samples
  - Photos with descriptions
- **Conclusion text** (after table)

### Step 3: Additional Air Quality (Section II)
- **Intro text**
- Global measurements: Oxygen, CH₂O, VOC
- **Conclusion text**

### Step 4: Microbiological Results (Section III)
- **Intro text**
- Summary of all samples
- **Conclusion text**

### Step 5: Conclusion & Recommendations
- Conclusion
- Proposed measures
- Recommendations list
- **Support & Contact text**

### Step 6: General Photos
- Upload photos not tied to rooms
- Add captions
- Review summary
- Submit report

---

## 🎨 Status Indicators

### Measurement Status (Choose in Form)
- **Normal (Green):** Values within acceptable range
- **Warning (Yellow):** Attention needed
- **Critical (Red):** Urgent action required

### Air Sample Colors (Automatic in PDF)
- **Green:** < 500 cfu/m³
- **Yellow:** 500-1000 cfu/m³
- **Red:** > 1000 cfu/m³ or "Overgrowth"

---

## 🐛 Troubleshooting

### Images Not Displaying
1. Check upload directory exists: `D:/Reporting_app_uploads`
2. Verify backend serves static files from D drive
3. Check image URLs use port 5002

### 500 Error on Submit
1. Check backend is running on port 5002
2. Verify MongoDB connection
3. Check browser console for errors
4. Ensure all required fields are filled

### Port Already in Use
1. Change PORT in `.env` file
2. Update REACT_APP_API_URL in `frontend/.env`
3. Update all URLs in `CreateMouldReport.js`
4. Restart both servers

### PDF Generation Issues
1. Verify images exist in `D:/Reporting_app_uploads`
2. Check image paths in reportController.js use correct port
3. Ensure PDFKit is installed: `npm install pdfkit`

---

## 📊 Database Collections

### Users
- firstName, lastName, email, password
- department, role, permissions

### Reports
- Basic info (title, type, dates, client)
- Investigation findings & letter intro
- Section texts (intro/conclusion for each section)
- Rooms array (measurements, samples, photos)
- Global air quality
- General photos
- Recommendations
- Support text
- Status (draft/pending-review/approved)

---

## 🔐 Authentication

### Login
- POST `/api/auth/login`
- Body: `{ email, password }`
- Returns: `{ token, user }`

### Register
- POST `/api/auth/register`
- Body: `{ firstName, lastName, email, password, department }`

### Protected Routes
- Add header: `Authorization: Bearer <token>`

---

## 📤 File Upload

### Upload Photos
- **Endpoint:** POST `/api/upload/photos`
- **Max Size:** 10MB per image
- **Formats:** JPEG, JPG, PNG, GIF, WEBP
- **Returns:** Array of file objects with fileName and fileUrl

### Delete Photo
- **Endpoint:** DELETE `/api/upload/photo/:filename`

---

## 📄 PDF Export

### Generate PDF
- **Endpoint:** GET `/api/reports/:id/pdf`
- **Returns:** PDF file download
- **Includes:**
  - Cover page
  - Assignment details
  - Letter introduction
  - All sections with tables
  - Explanations
  - Recommendations
  - Photos with captions

---

## 🌐 Multi-Language Support

### Available Languages
- English (en)
- French (fr)
- Dutch (nl)

### Language Switcher
- Located in top navigation
- Changes form labels dynamically
- PDF generated in selected language

---

## ✅ Testing Checklist

Before submitting a report, verify:
- [ ] All required fields filled
- [ ] At least one room added
- [ ] Room measurements have status indicators
- [ ] Photos uploaded successfully
- [ ] Photos display correctly
- [ ] All text fields completed
- [ ] Recommendations added (if any)
- [ ] Status selected (Draft/Pending/Approved)

---

## 📞 Support

### Common Issues
1. **Can't login:** Check credentials, verify backend is running
2. **Upload fails:** Check D drive space, verify upload directory exists
3. **PDF missing images:** Verify images uploaded to D drive
4. **Form won't submit:** Check browser console, verify all required fields

### Log Files
- Backend logs: Check Terminal 7 output
- Frontend logs: Check browser console (F12)
- MongoDB logs: Check Atlas dashboard

---

## 🎯 Quick Tips

1. **Save often:** Form data is not auto-saved
2. **Add rooms first:** Before moving to next steps
3. **Use status indicators:** They control PDF colors
4. **Add descriptions:** To photos for better PDF output
5. **Review summary:** In Step 6 before submitting
6. **Check PDF:** After creation to verify all data

---

## 📈 Performance

### Optimization Tips
- Compress images before upload (< 2MB recommended)
- Limit photos to 5-10 per room
- Use descriptive but concise text
- Avoid very long text fields (> 5000 chars)

### Limits
- Max file size: 10MB per image
- Max files per upload: 10 images
- Max rooms: No limit (but 10-20 recommended)
- Max samples per room: No limit

---

## 🔄 Updates & Maintenance

### Restart Servers
```bash
# Backend
cd D:\Reporting_app
npm start

# Frontend
cd D:\Reporting_app\frontend
npm start
```

### Clear Cache
```bash
# Backend
rm -rf node_modules
npm install

# Frontend
cd frontend
rm -rf node_modules
npm install
```

### Update Dependencies
```bash
npm update
cd frontend
npm update
```

---

**Last Updated:** May 2, 2026  
**Version:** 1.0.0  
**Status:** Production Ready ✅
