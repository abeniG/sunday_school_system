// server.js
const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// Initialize database
const db = new sqlite3.Database('sundayschool.db', (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to SQLite database');
    initDatabase();
  }
});

// Initialize database tables
function initDatabase() {
  // Create classes table
  db.run(`CREATE TABLE IF NOT EXISTS classes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    minAge INTEGER NOT NULL,
    maxAge INTEGER NOT NULL,
    year INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Create students table
  db.run(`CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    fullName TEXT NOT NULL,
    fatherName TEXT NOT NULL,
    grandfatherName TEXT NOT NULL,
    dob DATE NOT NULL,
    gender TEXT NOT NULL,
    currentClass TEXT NOT NULL,
    guardianName TEXT NOT NULL,
    parentPhone TEXT NOT NULL,
    kebele TEXT NOT NULL,
    woreda TEXT NOT NULL,
    houseNumber TEXT NOT NULL,
    sundayClass INTEGER NOT NULL,
    photoPath TEXT,
    registrationDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sundayClass) REFERENCES classes (id)
  )`);

  // Insert sample data if tables are empty
  db.get("SELECT COUNT(*) as count FROM classes", (err, row) => {
    if (err) {
      console.error("Error checking classes table:", err);
      return;
    }
    
    if (row.count === 0) {
      // Insert sample classes
      const sampleClasses = [
        { name: "Kindergarten", minAge: 3, maxAge: 5, year: 2023 },
        { name: "Elementary", minAge: 6, maxAge: 8, year: 2023 },
        { name: "Pre-Teens", minAge: 9, maxAge: 12, year: 2023 },
        { name: "Teens", minAge: 13, maxAge: 17, year: 2023 }
      ];
      
      const stmt = db.prepare("INSERT INTO classes (name, minAge, maxAge, year) VALUES (?, ?, ?, ?)");
      sampleClasses.forEach(cls => {
        stmt.run(cls.name, cls.minAge, cls.maxAge, cls.year);
      });
      stmt.finalize();
    }
  });
}

// Routes

// Get all classes
app.get('/api/classes', (req, res) => {
  db.all("SELECT * FROM classes ORDER BY name", (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Get class by ID
app.get('/api/classes/:id', (req, res) => {
  const id = req.params.id;
  db.get("SELECT * FROM classes WHERE id = ?", [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: "Class not found" });
      return;
    }
    res.json(row);
  });
});

// Create a new class
app.post('/api/classes', (req, res) => {
  const { name, minAge, maxAge, year } = req.body;
  
  if (!name || !minAge || !maxAge || !year) {
    res.status(400).json({ error: "All fields are required" });
    return;
  }
  
  db.run(
    "INSERT INTO classes (name, minAge, maxAge, year) VALUES (?, ?, ?, ?)",
    [name, minAge, maxAge, year],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({
        id: this.lastID,
        name,
        minAge,
        maxAge,
        year
      });
    }
  );
});

// Get all students
app.get('/api/students', (req, res) => {
  db.all(`
    SELECT students.*, classes.name as className 
    FROM students 
    LEFT JOIN classes ON students.sundayClass = classes.id 
    ORDER BY students.registrationDate DESC
  `, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Get student by ID
app.get('/api/students/:id', (req, res) => {
  const id = req.params.id;
  db.get(`
    SELECT students.*, classes.name as className 
    FROM students 
    LEFT JOIN classes ON students.sundayClass = classes.id 
    WHERE students.id = ?
  `, [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: "Student not found" });
      return;
    }
    res.json(row);
  });
});

// Create a new student
app.post('/api/students', upload.single('photo'), (req, res) => {
  const {
    fullName,
    fatherName,
    grandfatherName,
    dob,
    gender,
    currentClass,
    guardianName,
    parentPhone,
    kebele,
    woreda,
    houseNumber,
    sundayClass
  } = req.body;
  
  // Validate required fields
  if (!fullName || !fatherName || !grandfatherName || !dob || !gender || 
      !currentClass || !guardianName || !parentPhone || !kebele || 
      !woreda || !houseNumber || !sundayClass) {
    res.status(400).json({ error: "All fields are required" });
    return;
  }
  
  const photoPath = req.file ? req.file.path : null;
  
  db.run(
    `INSERT INTO students (
      fullName, fatherName, grandfatherName, dob, gender, currentClass,
      guardianName, parentPhone, kebele, woreda, houseNumber, sundayClass, photoPath
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      fullName, fatherName, grandfatherName, dob, gender, currentClass,
      guardianName, parentPhone, kebele, woreda, houseNumber, sundayClass, photoPath
    ],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      
      // Get the newly created student with class name
      db.get(`
        SELECT students.*, classes.name as className 
        FROM students 
        LEFT JOIN classes ON students.sundayClass = classes.id 
        WHERE students.id = ?
      `, [this.lastID], (err, row) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.json(row);
      });
    }
  );
});

// Get dashboard statistics
app.get('/api/dashboard/stats', (req, res) => {
  const stats = {};
  
  // Get total students
  db.get("SELECT COUNT(*) as totalStudents FROM students", (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    stats.totalStudents = row.totalStudents;
    
    // Get total classes
    db.get("SELECT COUNT(*) as totalClasses FROM classes", (err, row) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      stats.totalClasses = row.totalClasses;
      
      // Get this month registrations
      const currentDate = new Date();
      const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
        .toISOString().split('T')[0];
      
      db.get(
        "SELECT COUNT(*) as monthRegistrations FROM students WHERE registrationDate >= ?",
        [firstDayOfMonth],
        (err, row) => {
          if (err) {
            res.status(500).json({ error: err.message });
            return;
          }
          stats.monthRegistrations = row.monthRegistrations;
          
          // Get recent students (last 5)
          db.all(`
            SELECT students.*, classes.name as className 
            FROM students 
            LEFT JOIN classes ON students.sundayClass = classes.id 
            ORDER BY students.registrationDate DESC 
            LIMIT 5
          `, (err, rows) => {
            if (err) {
              res.status(500).json({ error: err.message });
              return;
            }
            stats.recentStudents = rows;
            
            // Get class distribution
            db.all(`
              SELECT classes.name, COUNT(students.id) as studentCount
              FROM classes
              LEFT JOIN students ON classes.id = students.sundayClass
              GROUP BY classes.id
              ORDER BY classes.name
            `, (err, rows) => {
              if (err) {
                res.status(500).json({ error: err.message });
                return;
              }
              stats.classDistribution = rows;
              
              // Get gender distribution
              db.all(`
                SELECT gender, COUNT(*) as count
                FROM students
                GROUP BY gender
              `, (err, rows) => {
                if (err) {
                  res.status(500).json({ error: err.message });
                  return;
                }
                stats.genderDistribution = rows;
                
                // Get detailed class information
                db.all(`
                  SELECT 
                    classes.name as className,
                    classes.minAge,
                    classes.maxAge,
                    classes.year,
                    COUNT(students.id) as totalStudents,
                    SUM(CASE WHEN students.gender = 'Male' THEN 1 ELSE 0 END) as maleStudents,
                    SUM(CASE WHEN students.gender = 'Female' THEN 1 ELSE 0 END) as femaleStudents
                  FROM classes
                  LEFT JOIN students ON classes.id = students.sundayClass
                  GROUP BY classes.id
                  ORDER BY classes.name
                `, (err, rows) => {
                  if (err) {
                    res.status(500).json({ error: err.message });
                    return;
                  }
                  stats.detailedClassInfo = rows;
                  
                  res.json(stats);
                });
              });
            });
          });
        }
      );
    });
  });
});

// Get students by class ID
app.get('/api/classes/:id/students', (req, res) => {
  const classId = req.params.id;
  
  db.all(`
    SELECT students.*, classes.name as className 
    FROM students 
    LEFT JOIN classes ON students.sundayClass = classes.id 
    WHERE students.sundayClass = ?
    ORDER BY students.fullName
  `, [classId], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Serve uploaded photos
app.get('/uploads/:filename', (req, res) => {
  const filename = req.params.filename;
  res.sendFile(path.join(__dirname, 'uploads', filename));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Database connection closed.');
    process.exit(0);
  });
});