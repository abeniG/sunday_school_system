 // Ethiopian calendar conversion functions
        function gregorianToEthiopian(date) {
            const gregDate = new Date(date);
            const year = gregDate.getFullYear();
            const month = gregDate.getMonth() + 1;
            const day = gregDate.getDate();
            
            // Calculate Ethiopian date (simple approximation)
            let ethYear = year - 8;
            if (month < 9 || (month === 9 && day < 11)) {
                ethYear--;
            }
            
            // Calculate month and day (simplified)
            let ethMonth, ethDay;
            if (month === 9 && day >= 11) {
                ethMonth = 1;
                ethDay = day - 10;
            } else if (month > 9) {
                ethMonth = month - 8;
                ethDay = day;
            } else {
                ethMonth = month + 4;
                ethDay = day;
            }
            
            // Adjust for Ethiopian calendar specifics
            if (ethDay > 30) {
                ethDay -= 30;
                ethMonth++;
            }
            
            const ethMonths = ["መስከረም", "ጥቅምት", "ኅዳር", "ታኅሳስ", "ጥር", "የካቲት", "መጋቢት", "ሚያዝያ", "ግንቦት", "ሰኔ", "ሐምሌ", "ነሐሴ", "ጳጉሜ"];
            
            return {
                day: ethDay,
                month: ethMonth,
                monthName: ethMonths[ethMonth - 1],
                year: ethYear
            };
        }
        
        function getEthiopianDate() {
            const today = new Date();
            const ethDate = gregorianToEthiopian(today);
            return `${ethDate.monthName} ${ethDate.day}, ${ethDate.year} ዓ.ም`;
        }
        
        function getEthiopianYear() {
            const today = new Date();
            const ethDate = gregorianToEthiopian(today);
            return ethDate.year;
        }
        
        // Data storage
        let students = JSON.parse(localStorage.getItem('sundaySchoolStudents')) || [];
        let classes = JSON.parse(localStorage.getItem('sundaySchoolClasses')) || [];
        let currentDeleteId = null;
        let currentDeleteType = null;
        let isEnglish = false;
        
        // DOM Elements
        const currentDateElement = document.getElementById('current-date');
        const currentYearElement = document.getElementById('current-year');
        const totalStudentsElement = document.getElementById('total-students');
        const totalClassesElement = document.getElementById('total-classes');
        const monthRegistrationsElement = document.getElementById('month-registrations');
        const recentStudentsElement = document.getElementById('recent-students');
        const sundayClassSelect = document.getElementById('sundayClass');
        const classYearSelect = document.getElementById('classYear');
        const detailedClassData = document.getElementById('detailed-class-data');
        const saveStudentBtn = document.getElementById('save-student-btn');
        const saveClassBtn = document.getElementById('save-class-btn');
        const studentSpinner = document.getElementById('student-spinner');
        const classSpinner = document.getElementById('class-spinner');
        const studentsTableBody = document.getElementById('students-table-body');
        const classesTableBody = document.getElementById('classes-table-body');
        const studentSearch = document.getElementById('student-search');
        const classSearch = document.getElementById('class-search');
        const studentsCount = document.getElementById('students-count');
        const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
        const deleteConfirmMessage = document.getElementById('delete-confirm-message');
        const languageSwitcher = document.getElementById('language-switcher');
        
        // Amharic translations
        const translations = {
            // Dashboard
            dashboard: {
                en: "Dashboard",
                am: "ዳሽቦርድ"
            },
            totalStudents: {
                en: "Total Students",
                am: "አጠቃላይ ተማሪዎች"
            },
            totalClasses: {
                en: "Total Classes",
                am: "አጠቃላይ ክፍሎች"
            },
            monthRegistrations: {
                en: "This Month Registrations",
                am: "በዚህ ወር የተመዘገቡ"
            },
            currentYear: {
                en: "Current Year",
                am: "የአሁኑ ዓመት"
            },
            recentStudents: {
                en: "Recent Students Added",
                am: "የቅርብ ጊዜ ተማሪዎች"
            },
            classDistribution: {
                en: "Class Distribution",
                am: "የክፍል ስርጭት"
            },
            
            // Manage Students
            manageStudents: {
                en: "Manage Students",
                am: "ተማሪዎችን አስተዳድር"
            },
            addNewStudent: {
                en: "Add New Student",
                am: "አዲስ ተማሪ ያክሉ"
            },
            allStudents: {
                en: "All Students",
                am: "ሁሉም ተማሪዎች"
            },
            searchStudents: {
                en: "Search students...",
                am: "ተማሪዎችን ይፈልጉ..."
            },
            photo: {
                en: "Photo",
                am: "ፎቶ"
            },
            name: {
                en: "Name",
                am: "ስም"
            },
            class: {
                en: "Class",
                am: "ክፍል"
            },
            age: {
                en: "Age",
                am: "እድሜ"
            },
            gender: {
                en: "Gender",
                am: "ጾታ"
            },
            phone: {
                en: "Phone",
                am: "ስልክ"
            },
            actions: {
                en: "Actions",
                am: "ድርጊቶች"
            },
            studentsFound: {
                en: "students found",
                am: "ተማሪዎች ተገኝተዋል"
            },
            view: {
                en: "View",
                am: "ይመልከቱ"
            },
            edit: {
                en: "Edit",
                am: "አስተካክል"
            },
            delete: {
                en: "Delete",
                am: "ሰርዝ"
            },
            
            // Manage Classes
            manageClasses: {
                en: "Manage Classes",
                am: "ክፍሎችን አስተዳድር"
            },
            addNewClass: {
                en: "Add New Class",
                am: "አዲስ ክፍል ያክሉ"
            },
            allClasses: {
                en: "All Classes",
                am: "ሁሉም ክፍሎች"
            },
            searchClasses: {
                en: "Search classes...",
                am: "ክፍሎችን ይፈልጉ..."
            },
            className: {
                en: "Class Name",
                am: "የክፍል ስም"
            },
            ageRange: {
                en: "Age Range",
                am: "የእድሜ ክልል"
            },
            year: {
                en: "Year",
                am: "ዓመት"
            },
            students: {
                en: "Students",
                am: "ተማሪዎች"
            },
            
            // View Data
            schoolDataOverview: {
                en: "School Data Overview",
                am: "የትምህርት ቤት ዳታ አጠቃላይ እይታ"
            },
            studentsPerClass: {
                en: "Students per Class",
                am: "ተማሪዎች በክፍል"
            },
            genderDistribution: {
                en: "Gender Distribution",
                am: "የጾታ ስርጭት"
            },
            detailedClassInfo: {
                en: "Detailed Class Information",
                am: "ዝርዝር የክፍል መረጃ"
            },
            numberOfStudents: {
                en: "Number of Students",
                am: "የተማሪዎች ብዛት"
            },
            maleStudents: {
                en: "Male Students",
                am: "ወንድ ተማሪዎች"
            },
            femaleStudents: {
                en: "Female Students",
                am: "ሴት ተማሪዎች"
            },
            
            // Forms
            fullName: {
                en: "Full Name",
                am: "ሙሉ ስም"
            },
            fathersName: {
                en: "Father's Name",
                am: "የአባት ስም"
            },
            grandfathersName: {
                en: "Grandfather's Name",
                am: "የአያት ስም"
            },
            dateOfBirth: {
                en: "Date of Birth",
                am: "የትውልድ ቀን"
            },
            selectGender: {
                en: "Select Gender",
                am: "ጾታ ይምረጡ"
            },
            male: {
                en: "Male",
                am: "ወንድ"
            },
            female: {
                en: "Female",
                am: "ሴት"
            },
            currentSchoolClass: {
                en: "Current School Class",
                am: "የትምህርት ክፍል"
            },
            guardianName: {
                en: "Guardian's Name",
                am: "የጠባቂ ስም"
            },
            parentPhone: {
                en: "Parent's Phone Number",
                am: "የወላጅ ስልክ"
            },
            kebele: {
                en: "Kebele",
                am: "ቀበሌ"
            },
            woreda: {
                en: "Woreda",
                am: "ወረዳ"
            },
            houseNumber: {
                en: "House Number",
                am: "የቤት ቁጥር"
            },
            sundaySchoolClass: {
                en: "Sunday School Class",
                am: "የእሁድ ት/ቤት ክፍል"
            },
            selectClass: {
                en: "Select Class",
                am: "ክፍል ይምረጡ"
            },
            studentPhoto: {
                en: "Student Photo",
                am: "የተማሪ ፎቶ"
            },
            minAge: {
                en: "Minimum Age",
                am: "አስነሲይ እድሜ"
            },
            maxAge: {
                en: "Maximum Age",
                am: "ከፍተኛ እድሜ"
            },
            academicYear: {
                en: "Academic Year",
                am: "የትምህርት ዓመት"
            },
            selectYear: {
                en: "Select Year",
                am: "ዓመት ይምረጡ"
            },
            registerStudent: {
                en: "Register Student",
                am: "ተማሪ ይመዝገቡ"
            },
            createClass: {
                en: "Create Class",
                am: "ክፍል ይፍጠሩ"
            },
            cancel: {
                en: "Cancel",
                am: "ይቅር"
            },
            
            // Modals
            studentDetails: {
                en: "Student Details",
                am: "የተማሪ ዝርዝሮች"
            },
            confirmation: {
                en: "Confirmation",
                am: "ማረጋገጫ"
            },
            confirmDelete: {
                en: "Are you sure you want to delete this item?",
                am: "እርግጠኛ ነዎት ይህን ለመሰረዝ?"
            },
            close: {
                en: "Close",
                am: "ዝጋ"
            },
            
            // Messages
            loading: {
                en: "Loading...",
                am: "በመጫን ላይ..."
            },
            noStudents: {
                en: "No students found",
                am: "ምንም ተማሪዎች አልተገኙም"
            },
            noClasses: {
                en: "No classes found",
                am: "ምንም ክፍሎች አልተገኙም"
            },
            noRecentStudents: {
                en: "No recent students",
                am: "ምንም የቅርብ ጊዜ ተማሪዎች የሉም"
            },
            studentRegistered: {
                en: "Student registered successfully!",
                am: "ተማሪው በተሳካ ሁኔታ ተመዝግቧል!"
            },
            classCreated: {
                en: "Class created successfully!",
                am: "ክፍሉ በተሳካ ሁኔታ ተፈጥሯል!"
            },
            studentDeleted: {
                en: "Student deleted successfully!",
                am: "ተማሪው በተሳካ ሁኔታ ተሰርዟል!"
            },
            classDeleted: {
                en: "Class deleted successfully!",
                am: "ክፍሉ በተሳካ ሁኔታ ተሰርዟል!"
            },
            cannotDeleteClass: {
                en: "Cannot delete class because it has students enrolled",
                am: "ክፍሉ ተማሪዎች ስላሉት ሊሰረዝ አይችልም"
            },
            fillAllFields: {
                en: "Please fill all required fields",
                am: "እባክዎ ሁሉንም አስፈላጊ ህዋሶች ይሙሉ"
            },
            ageRangeError: {
                en: "Maximum age must be greater than minimum age",
                am: "ከፍተኛው እድሜ ከአስነሲይ እድሜ የሚበልጥ መሆን አለበት"
            }
        };
        
        // Initialize the application
        document.addEventListener('DOMContentLoaded', function() {
            // Set Ethiopian date
            currentDateElement.textContent = getEthiopianDate();
            currentYearElement.textContent = getEthiopianYear();
            
            // Initialize navigation
            initNavigation();
            
            // Initialize forms
            initForms();
            
            // Initialize class dropdowns
            populateClassDropdowns();
            
            // Initialize year dropdowns
            populateYearDropdowns();
            
            // Load data
            loadData();
            
            // Initialize event listeners
            initEventListeners();
            
            // Initialize language switcher
            languageSwitcher.addEventListener('click', function() {
                toggleLanguage();
            });
        });
        
        // Toggle between English and Amharic
        function toggleLanguage() {
            isEnglish = !isEnglish;
            languageSwitcher.textContent = isEnglish ? "AM" : "EN";
            translatePage();
        }
        
        // Translate the entire page
        function translatePage() {
            const lang = isEnglish ? "en" : "am";
            
            // Update all elements with data-translate attribute
            document.querySelectorAll('[data-translate]').forEach(element => {
                const key = element.getAttribute('data-translate');
                if (translations[key] && translations[key][lang]) {
                    element.textContent = translations[key][lang];
                }
            });
            
            // Update placeholders
            document.querySelectorAll('[data-translate-placeholder]').forEach(element => {
                const key = element.getAttribute('data-translate-placeholder');
                if (translations[key] && translations[key][lang]) {
                    element.setAttribute('placeholder', translations[key][lang]);
                }
            });
            
            // Update button texts
            document.querySelectorAll('[data-translate-value]').forEach(element => {
                const key = element.getAttribute('data-translate-value');
                if (translations[key] && translations[key][lang]) {
                    element.value = translations[key][lang];
                }
            });
            
            // Update options in select elements
            document.querySelectorAll('[data-translate-option]').forEach(element => {
                const key = element.getAttribute('data-translate-option');
                if (translations[key] && translations[key][lang]) {
                    element.textContent = translations[key][lang];
                }
            });
        }
        
        // Navigation
        function initNavigation() {
            const navLinks = document.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    const targetPage = this.getAttribute('data-page');
                    
                    // Update active nav link
                    navLinks.forEach(navLink => navLink.classList.remove('active'));
                    this.classList.add('active');
                    
                    // Show target page
                    document.querySelectorAll('.page-content').forEach(page => {
                        page.classList.remove('active');
                    });
                    document.getElementById(targetPage).classList.add('active');
                    
                    // Refresh data for specific pages
                    if (targetPage === 'dashboard') {
                        updateStatistics();
                    } else if (targetPage === 'manage-students') {
                        loadStudents();
                    } else if (targetPage === 'manage-classes') {
                        loadClasses();
                    } else if (targetPage === 'view-data') {
                        initCharts();
                    }
                });
            });
        }
        
        // Form handling
        function initForms() {
            // Calculate age when DOB changes
            const dobInput = document.getElementById('dob');
            dobInput.addEventListener('change', function() {
                calculateAge(this.value);
            });
            
            // Save student button
            saveStudentBtn.addEventListener('click', function() {
                addStudent();
            });
            
            // Save class button
            saveClassBtn.addEventListener('click', function() {
                addClass();
            });
            
            // Photo preview
            const photoInput = document.getElementById('photo');
            const photoPreview = document.querySelector('.photo-preview');
            
            photoInput.addEventListener('change', function() {
                const file = this.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        photoPreview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
                    }
                    reader.readAsDataURL(file);
                }
            });
        }
        
        // Initialize event listeners
        function initEventListeners() {
            // Student search
            studentSearch.addEventListener('input', function() {
                filterStudents(this.value);
            });
            
            // Class search
            classSearch.addEventListener('input', function() {
                filterClasses(this.value);
            });
            
            // Confirm delete button
            confirmDeleteBtn.addEventListener('click', function() {
                if (currentDeleteType === 'student') {
                    deleteStudent(currentDeleteId);
                } else if (currentDeleteType === 'class') {
                    deleteClass(currentDeleteId);
                }
            });
        }
        
        // Load all data
        function loadData() {
            updateStatistics();
            loadStudents();
            loadClasses();
        }
        
        // Calculate age from date of birth
        function calculateAge(dob) {
            if (!dob) return;
            
            const birthDate = new Date(dob);
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            
            document.getElementById('age').value = age;
            
            // Auto-suggest class based on age
            autoSuggestClass(age);
        }
        
        // Auto-suggest class based on age
        function autoSuggestClass(age) {
            const classSelect = document.getElementById('sundayClass');
            let suggestedClassId = '';
            
            // Find a class that matches the age range
            for (const cls of classes) {
                if (age >= cls.minAge && age <= cls.maxAge) {
                    suggestedClassId = cls.id;
                    break;
                }
            }
            
            // Set the suggested class if found
            if (suggestedClassId) {
                classSelect.value = suggestedClassId;
            }
        }
        
        // Add a new student
        async function addStudent() {
            const fullName = document.getElementById('fullName').value;
            const fatherName = document.getElementById('fatherName').value;
            const grandfatherName = document.getElementById('grandfatherName').value;
            const dob = document.getElementById('dob').value;
            const gender = document.getElementById('gender').value;
            const currentClass = document.getElementById('currentClass').value;
            const guardianName = document.getElementById('guardianName').value;
            const parentPhone = document.getElementById('parentPhone').value;
            const kebele = document.getElementById('kebele').value;
            const woreda = document.getElementById('woreda').value;
            const houseNumber = document.getElementById('houseNumber').value;
            const sundayClass = document.getElementById('sundayClass').value;
            
            // Validate required fields
            if (!fullName || !fatherName || !grandfatherName || !dob || !gender || 
                !currentClass || !guardianName || !parentPhone || !kebele || 
                !woreda || !houseNumber || !sundayClass) {
                alert(isEnglish ? translations.fillAllFields.en : translations.fillAllFields.am);
                return;
            }
            
            try {
                // Show loading state
                saveStudentBtn.disabled = true;
                studentSpinner.style.display = 'inline-block';
                
                // Create student object
                const newStudent = {
                    id: Date.now(),
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
                    sundayClass,
                    registrationDate: new Date().toISOString()
                };
                
                // Handle photo upload
                const photoInput = document.getElementById('photo');
                if (photoInput.files[0]) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        newStudent.photo = e.target.result;
                        completeStudentRegistration(newStudent);
                    };
                    reader.readAsDataURL(photoInput.files[0]);
                } else {
                    completeStudentRegistration(newStudent);
                }
                
                function completeStudentRegistration(student) {
                    // Add to students array
                    students.push(student);
                    
                    // Save to localStorage
                    localStorage.setItem('sundaySchoolStudents', JSON.stringify(students));
                    
                    // Hide modal
                    const modal = bootstrap.Modal.getInstance(document.getElementById('addStudentModal'));
                    modal.hide();
                    
                    // Reset form
                    document.getElementById('student-form').reset();
                    document.querySelector('.photo-preview').innerHTML = '<i class="fas fa-user fa-3x text-muted"></i>';
                    
                    // Update UI
                    updateStatistics();
                    loadStudents();
                    
                    alert(isEnglish ? translations.studentRegistered.en : translations.studentRegistered.am);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Error registering student: ' + error.message);
            } finally {
                // Hide loading state
                saveStudentBtn.disabled = false;
                studentSpinner.style.display = 'none';
            }
        }
        
        // Add a new class
        async function addClass() {
            const className = document.getElementById('className').value;
            const minAge = parseInt(document.getElementById('minAge').value);
            const maxAge = parseInt(document.getElementById('maxAge').value);
            const classYear = document.getElementById('classYear').value;
            
            // Validate required fields
            if (!className || !minAge || !maxAge || !classYear) {
                alert(isEnglish ? translations.fillAllFields.en : translations.fillAllFields.am);
                return;
            }
            
            // Validate age range
            if (minAge >= maxAge) {
                alert(isEnglish ? translations.ageRangeError.en : translations.ageRangeError.am);
                return;
            }
            
            try {
                // Show loading state
                saveClassBtn.disabled = true;
                classSpinner.style.display = 'inline-block';
                
                // Create class object
                const newClass = {
                    id: Date.now(),
                    name: className,
                    minAge,
                    maxAge,
                    year: classYear
                };
                
                // Add to classes array
                classes.push(newClass);
                
                // Save to localStorage
                localStorage.setItem('sundaySchoolClasses', JSON.stringify(classes));
                
                // Hide modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('addClassModal'));
                modal.hide();
                
                // Reset form
                document.getElementById('class-form').reset();
                
                // Update UI
                updateStatistics();
                loadClasses();
                populateClassDropdowns();
                
                alert(isEnglish ? translations.classCreated.en : translations.classCreated.am);
            } catch (error) {
                console.error('Error:', error);
                alert('Error creating class: ' + error.message);
            } finally {
                // Hide loading state
                saveClassBtn.disabled = false;
                classSpinner.style.display = 'none';
            }
        }
        
        // Load students
        function loadStudents() {
            students = JSON.parse(localStorage.getItem('sundaySchoolStudents')) || [];
            displayStudents(students);
        }
        
        // Display students in table
        function displayStudents(studentsList) {
            studentsTableBody.innerHTML = '';
            
            if (studentsList.length === 0) {
                studentsTableBody.innerHTML = `
                    <tr>
                        <td colspan="7" class="text-center">${isEnglish ? translations.noStudents.en : translations.noStudents.am}</td>
                    </tr>
                `;
                studentsCount.textContent = '0';
                return;
            }
            
            studentsList.forEach(student => {
                const classInfo = getClassInfo(student.sundayClass);
                const age = calculateAgeFromDOB(student.dob);
                
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td class="text-center">
                        ${student.photo ? 
                            `<img src="${student.photo}" class="student-photo" alt="Student Photo">` : 
                            `<i class="fas fa-user fa-2x text-muted"></i>`
                        }
                    </td>
                    <td>${student.fullName}</td>
                    <td>${classInfo ? classInfo.name : 'Unknown'}</td>
                    <td>${age}</td>
                    <td>${isEnglish ? student.gender : (student.gender === 'Male' ? 'ወንድ' : 'ሴት')}</td>
                    <td>${student.parentPhone}</td>
                    <td class="action-buttons">
                        <span class="view-btn" onclick="viewStudentDetails(${student.id})">
                            <i class="fas fa-eye"></i> ${isEnglish ? translations.view.en : translations.view.am}
                        </span>
                        <span class="edit-btn" onclick="editStudent(${student.id})">
                            <i class="fas fa-edit"></i> ${isEnglish ? translations.edit.en : translations.edit.am}
                        </span>
                        <span class="delete-btn" onclick="showDeleteConfirm('student', ${student.id}, '${student.fullName}')">
                            <i class="fas fa-trash"></i> ${isEnglish ? translations.delete.en : translations.delete.am}
                        </span>
                    </td>
                `;
                studentsTableBody.appendChild(row);
            });
            
            studentsCount.textContent = studentsList.length;
        }
        
        // Load classes
        function loadClasses() {
            classes = JSON.parse(localStorage.getItem('sundaySchoolClasses')) || [];
            displayClasses(classes);
        }
        
        // Display classes in table
        function displayClasses(classesList) {
            classesTableBody.innerHTML = '';
            
            if (classesList.length === 0) {
                classesTableBody.innerHTML = `
                    <tr>
                        <td colspan="5" class="text-center">${isEnglish ? translations.noClasses.en : translations.noClasses.am}</td>
                    </tr>
                `;
                return;
            }
            
            classesList.forEach(cls => {
                const studentCount = students.filter(s => s.sundayClass == cls.id).length;
                
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${cls.name}</td>
                    <td>${cls.minAge} - ${cls.maxAge}</td>
                    <td>${cls.year}</td>
                    <td>${studentCount}</td>
                    <td class="action-buttons">
                        <span class="edit-btn" onclick="editClass(${cls.id})">
                            <i class="fas fa-edit"></i> ${isEnglish ? translations.edit.en : translations.edit.am}
                        </span>
                        <span class="delete-btn" onclick="showDeleteConfirm('class', ${cls.id}, '${cls.name}')">
                            <i class="fas fa-trash"></i> ${isEnglish ? translations.delete.en : translations.delete.am}
                        </span>
                    </td>
                `;
                classesTableBody.appendChild(row);
            });
        }
        
        // Filter students
        function filterStudents(searchTerm) {
            if (!searchTerm) {
                displayStudents(students);
                return;
            }
            
            const filteredStudents = students.filter(student => 
                student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                student.fatherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                student.guardianName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                student.parentPhone.includes(searchTerm)
            );
            
            displayStudents(filteredStudents);
        }
        
        // Filter classes
        function filterClasses(searchTerm) {
            if (!searchTerm) {
                displayClasses(classes);
                return;
            }
            
            const filteredClasses = classes.filter(cls => 
                cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                cls.year.toString().includes(searchTerm)
            );
            
            displayClasses(filteredClasses);
        }
        
        // Show delete confirmation
        function showDeleteConfirm(type, id, name) {
            currentDeleteId = id;
            currentDeleteType = type;
            
            if (type === 'student') {
                deleteConfirmMessage.textContent = isEnglish ? 
                    `Are you sure you want to delete student "${name}"?` : 
                    `እርግጠኛ ነዎት ተማሪ "${name}" ን ለመሰረዝ?`;
                confirmDeleteBtn.disabled = false;
            } else if (type === 'class') {
                // Check if class has students
                const studentCount = students.filter(s => s.sundayClass == id).length;
                if (studentCount > 0) {
                    deleteConfirmMessage.textContent = isEnglish ? 
                        `Cannot delete class "${name}" because it has ${studentCount} student(s) enrolled.` : 
                        `ክፍል "${name}" ${studentCount} ተማሪ(ዎች) ስላሉት ሊሰረዝ አይችልም።`;
                    confirmDeleteBtn.disabled = true;
                } else {
                    deleteConfirmMessage.textContent = isEnglish ? 
                        `Are you sure you want to delete class "${name}"?` : 
                        `እርግጠኛ ነዎት ክፍል "${name}" ን ለመሰረዝ?`;
                    confirmDeleteBtn.disabled = false;
                }
            }
            
            const modal = new bootstrap.Modal(document.getElementById('deleteConfirmModal'));
            modal.show();
        }
        
        // Delete student
        function deleteStudent(studentId) {
            students = students.filter(s => s.id !== studentId);
            localStorage.setItem('sundaySchoolStudents', JSON.stringify(students));
            
            // Update UI
            updateStatistics();
            loadStudents();
            
            // Hide modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('deleteConfirmModal'));
            modal.hide();
            
            alert(isEnglish ? translations.studentDeleted.en : translations.studentDeleted.am);
        }
        
        // Delete class
        function deleteClass(classId) {
            classes = classes.filter(c => c.id !== classId);
            localStorage.setItem('sundaySchoolClasses', JSON.stringify(classes));
            
            // Update UI
            updateStatistics();
            loadClasses();
            populateClassDropdowns();
            
            // Hide modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('deleteConfirmModal'));
            modal.hide();
            
            alert(isEnglish ? translations.classDeleted.en : translations.classDeleted.am);
        }
        
        // View student details
        function viewStudentDetails(studentId) {
            const student = students.find(s => s.id == studentId);
            if (!student) return;
            
            const age = calculateAgeFromDOB(student.dob);
            const classInfo = getClassInfo(student.sundayClass);
            const className = classInfo ? `${classInfo.name} (${classInfo.year})` : 'Not assigned';
            
            let studentDetails = `
                <div class="row">
                    <div class="col-md-4 text-center">
                        ${student.photo ? 
                            `<img src="${student.photo}" class="student-photo mb-3" alt="Student Photo">` : 
                            `<div class="bg-light rounded-circle d-flex align-items-center justify-content-center mx-auto" style="width: 150px; height: 150px;">
                                <i class="fas fa-user fa-4x text-muted"></i>
                            </div>`
                        }
                        <h5 class="mt-3">${student.fullName}</h5>
                        <p class="text-muted">${className}</p>
                    </div>
                    <div class="col-md-8">
                        <h5>${isEnglish ? 'Personal Information' : 'ግላዊ መረጃ'}</h5>
                        <table class="table table-sm">
                            <tr>
                                <th width="30%">${isEnglish ? 'Full Name' : 'ሙሉ ስም'}</th>
                                <td>${student.fullName}</td>
                            </tr>
                            <tr>
                                <th>${isEnglish ? 'Father\'s Name' : 'የአባት ስም'}</th>
                                <td>${student.fatherName}</td>
                            </tr>
                            <tr>
                                <th>${isEnglish ? 'Grandfather\'s Name' : 'የአያት ስም'}</th>
                                <td>${student.grandfatherName}</td>
                            </tr>
                            <tr>
                                <th>${isEnglish ? 'Date of Birth' : 'የትውልድ ቀን'}</th>
                                <td>${formatDate(student.dob)} (${age} ${isEnglish ? 'years old' : 'ዓመት'})</td>
                            </tr>
                            <tr>
                                <th>${isEnglish ? 'Gender' : 'ጾታ'}</th>
                                <td>${isEnglish ? student.gender : (student.gender === 'Male' ? 'ወንድ' : 'ሴት')}</td>
                            </tr>
                            <tr>
                                <th>${isEnglish ? 'Current School Class' : 'የትምህርት ክፍል'}</th>
                                <td>${student.currentClass}</td>
                            </tr>
                        </table>
                        
                        <h5 class="mt-4">${isEnglish ? 'Contact Information' : 'የመገኛ መረጃ'}</h5>
                        <table class="table table-sm">
                            <tr>
                                <th width="30%">${isEnglish ? 'Guardian\'s Name' : 'የጠባቂ ስም'}</th>
                                <td>${student.guardianName}</td>
                            </tr>
                            <tr>
                                <th>${isEnglish ? 'Parent\'s Phone' : 'የወላጅ ስልክ'}</th>
                                <td>${student.parentPhone}</td>
                            </tr>
                            <tr>
                                <th>${isEnglish ? 'Kebele' : 'ቀበሌ'}</th>
                                <td>${student.kebele}</td>
                            </tr>
                            <tr>
                                <th>${isEnglish ? 'Woreda' : 'ወረዳ'}</th>
                                <td>${student.woreda}</td>
                            </tr>
                            <tr>
                                <th>${isEnglish ? 'House Number' : 'የቤት ቁጥር'}</th>
                                <td>${student.houseNumber}</td>
                            </tr>
                        </table>
                    </div>
                </div>
            `;
            
            document.getElementById('student-details').innerHTML = studentDetails;
            
            const modal = new bootstrap.Modal(document.getElementById('studentDetailModal'));
            modal.show();
        }
        
        // Edit student (placeholder function)
        function editStudent(studentId) {
            alert(isEnglish ? 'Edit student functionality would open a form to edit student details.' : 'የተማሪ አርትዖት ተግባር የተማሪ ዝርዝሮችን ለመስተካከል ፎርም ያከፍታል።');
            // This would open a modal with the student form pre-filled with existing data
        }
        
        // Edit class (placeholder function)
        function editClass(classId) {
            alert(isEnglish ? 'Edit class functionality would open a form to edit class details.' : 'የክፍል አርትዖት ተግባር የክፍል ዝርዝሮችን ለመስተካከል ፎርም ያከፍታል።');
            // This would open a modal with the class form pre-filled with existing data
        }
        
        // Populate class dropdowns
        function populateClassDropdowns() {
            classes = JSON.parse(localStorage.getItem('sundaySchoolClasses')) || [];
            
            // Clear existing options
            sundayClassSelect.innerHTML = '<option value="">' + (isEnglish ? translations.selectClass.en : translations.selectClass.am) + '</option>';
            
            // Add classes to dropdown
            classes.forEach(cls => {
                const option = document.createElement('option');
                option.value = cls.id;
                option.textContent = `${cls.name} (${isEnglish ? 'Ages' : 'እድሜ'} ${cls.minAge}-${cls.maxAge}) - ${cls.year}`;
                sundayClassSelect.appendChild(option);
            });
        }
        
        // Populate year dropdowns
        function populateYearDropdowns() {
            // Clear existing options
            classYearSelect.innerHTML = '<option value="">' + (isEnglish ? translations.selectYear.en : translations.selectYear.am) + '</option>';
            
            // Generate years (from 5 years ago to 5 years in the future)
            const currentYear = getEthiopianYear();
            for (let year = currentYear - 5; year <= currentYear + 5; year++) {
                const option = document.createElement('option');
                option.value = year;
                option.textContent = year;
                if (year === currentYear) option.selected = true;
                classYearSelect.appendChild(option);
            }
        }
        
        // Update statistics
        function updateStatistics() {
            students = JSON.parse(localStorage.getItem('sundaySchoolStudents')) || [];
            classes = JSON.parse(localStorage.getItem('sundaySchoolClasses')) || [];
            
            totalStudentsElement.textContent = students.length;
            totalClassesElement.textContent = classes.length;
            
            // Calculate this month's registrations
            const currentDate = new Date();
            const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
            const monthRegistrations = students.filter(s => {
                const regDate = new Date(s.registrationDate);
                return regDate >= firstDayOfMonth;
            }).length;
            
            monthRegistrationsElement.textContent = monthRegistrations;
            
            // Display recent students
            displayRecentStudents();
            
            // Update charts if they exist
            if (typeof updateCharts === 'function') {
                updateCharts();
            }
        }
        
        // Display recent students
        function displayRecentStudents() {
            recentStudentsElement.innerHTML = '';
            
            if (students.length === 0) {
                recentStudentsElement.innerHTML = `<li class="list-group-item d-flex justify-content-between align-items-center">${isEnglish ? translations.noRecentStudents.en : translations.noRecentStudents.am}</li>`;
                return;
            }
            
            // Get the 5 most recent students
            const recentStudents = [...students]
                .sort((a, b) => new Date(b.registrationDate) - new Date(a.registrationDate))
                .slice(0, 5);
            
            recentStudents.forEach(student => {
                const li = document.createElement('li');
                li.className = 'list-group-item d-flex justify-content-between align-items-center';
                li.innerHTML = `
                    <div>${student.fullName}</div>
                    <span class="badge bg-primary rounded-pill">${getClassName(student.sundayClass)}</span>
                `;
                recentStudentsElement.appendChild(li);
            });
        }
        
        // Get class name by ID
        function getClassName(classId) {
            const cls = classes.find(c => c.id == classId);
            return cls ? cls.name : isEnglish ? 'Unknown' : 'የማይታወቅ';
        }
        
        // Get class info by ID
        function getClassInfo(classId) {
            return classes.find(c => c.id == classId);
        }
        
        // Calculate age from date of birth
        function calculateAgeFromDOB(dob) {
            const birthDate = new Date(dob);
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            
            return age;
        }
        
        // Format date for display
        function formatDate(dateString) {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        }
        
        // Initialize charts
        function initCharts() {
            // Class distribution chart
            const classCtx = document.getElementById('classChart').getContext('2d');
            const classChart = new Chart(classCtx, {
                type: 'doughnut',
                data: {
                    labels: classes.map(c => c.name),
                    datasets: [{
                        data: classes.map(c => students.filter(s => s.sundayClass == c.id).length),
                        backgroundColor: [
                            '#4e73df', '#1cc88a', '#36b9cc', '#f6c23e', 
                            '#e74a3b', '#858796', '#f8f9fc', '#5a5c69'
                        ],
                        hoverOffset: 4
                    }]
                },
                options: {
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'right'
                        }
                    }
                }
            });
            
            // Students per class chart
            const studentsPerClassCtx = document.getElementById('studentsPerClassChart').getContext('2d');
            const studentsPerClassChart = new Chart(studentsPerClassCtx, {
                type: 'bar',
                data: {
                    labels: classes.map(c => c.name),
                    datasets: [{
                        label: isEnglish ? 'Number of Students' : 'የተማሪዎች ብዛት',
                        data: classes.map(c => students.filter(s => s.sundayClass == c.id).length),
                        backgroundColor: '#4e73df',
                        borderRadius: 5
                    }]
                },
                options: {
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                stepSize: 1
                            }
                        }
                    }
                }
            });
            
            // Gender distribution chart
            const maleCount = students.filter(s => s.gender === 'Male').length;
            const femaleCount = students.filter(s => s.gender === 'Female').length;
            
            const genderCtx = document.getElementById('genderDistributionChart').getContext('2d');
            const genderChart = new Chart(genderCtx, {
                type: 'pie',
                data: {
                    labels: [isEnglish ? 'Male' : 'ወንድ', isEnglish ? 'Female' : 'ሴት'],
                    datasets: [{
                        data: [maleCount, femaleCount],
                        backgroundColor: ['#4e73df', '#e74a3b'],
                        hoverOffset: 4
                    }]
                },
                options: {
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        }
                    }
                }
            });
            
            // Update detailed class data table
            updateDetailedClassData();
        }
        
        // Update detailed class data table
        function updateDetailedClassData() {
            detailedClassData.innerHTML = '';
            
            classes.forEach(cls => {
                const classStudents = students.filter(s => s.sundayClass == cls.id);
                const maleStudents = classStudents.filter(s => s.gender === 'Male').length;
                const femaleStudents = classStudents.filter(s => s.gender === 'Female').length;
                
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${cls.name}</td>
                    <td>${cls.minAge} - ${cls.maxAge}</td>
                    <td>${cls.year}</td>
                    <td>${classStudents.length}</td>
                    <td>${maleStudents}</td>
                    <td>${femaleStudents}</td>
                `;
                detailedClassData.appendChild(row);
            });
        }