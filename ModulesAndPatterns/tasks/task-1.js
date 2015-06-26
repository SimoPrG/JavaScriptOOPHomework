//@formatter:off
/* Task Description */
/* 
* Create a module for a Telerik Academy course
  * The course has a title and presentations
    * Each presentation also has a title
    * There is a homework for each presentation
  * There is a set of students listed for the course
    * Each student has firstname, lastname and an ID
      * IDs must be unique integer numbers which are at least 1
  * Each student can submit a homework for each presentation in the course
  * Create method init
    * Accepts a string - course title
    * Accepts an array of strings - presentation titles
    * Throws if there is an invalid title
      * Titles do not start or end with spaces
      * Titles do not have consecutive spaces
      * Titles have at least one character
    * Throws if there are no presentations
  * Create method addStudent which lists a student for the course
    * Accepts a string in the format 'Firstname Lastname'
    * Throws if any of the names are not valid
      * Names start with an upper case letter
      * All other symbols in the name (if any) are lowercase letters
    * Generates a unique student ID and returns it
  * Create method getAllStudents that returns an array of students in the format:
    * {firstname: 'string', lastname: 'string', id: StudentID}
  * Create method submitHomework
    * Accepts studentID and homeworkID
      * homeworkID 1 is for the first presentation
      * homeworkID 2 is for the second one
      * ...
    * Throws if any of the IDs are invalid
  * Create method pushExamResults
    * Accepts an array of items in the format {StudentID: ..., Score: ...}
      * StudentIDs which are not listed get 0 points
    * Throw if there is an invalid StudentID
    * Throw if same StudentID is given more than once ( he tried to cheat (: )
    * Throw if Score is not a number
  * Create method getTopStudents which returns an array of the top 10 performing students
    * Array must be sorted from best to worst
    * If there are less than 10, return them all
    * The final score that is used to calculate the top performing students is done as follows:
      * 75% of the exam result
      * 25% the submitted homework (count of submitted homeworks / count of all homeworks) for the course
*/
//@formatter:on
function solve() {
    function validateTitle(title) {
        if (!title.length) {
            throw new Error('Title must have at least one character! value: ' + title);
        }

        if (invalidTitlesRegEx.test(title)) {
            throw new Error('Title must not begin or end with a space or contain consecutive spaces! value: ' + title);
        }
    }

    function validateStudentName(name) {
        if (name.constructor !== String) {
            throw new TypeError('Student name must be a string! type: ' + typeof name);
        }

        if (!studentNameRegEx.test(name)) {
            throw new Error('Invalid student name! It must be a string in the format "Firstname Lastname". value: ' + name);
        }
    }

    function validateStudentID(studentID) {
        validateIDInCollection.call(this, studentID, 'students', 'Invalid studentID!');
    }

    function validateHomeworkID(homeworkID) {
        validateIDInCollection.call(this, homeworkID, 'presentations', 'Invalid homeworkID!');
    }

    function validateIDInCollection(id, collection, errorMessage) {
        var idExists = this[collection].some(function (item) {
            return item.id == id;
        });

        if (!idExists) {
            throw new Error(errorMessage + ' value: ' + id);
        }
    }

    function getStudentByID(studentID) {
        var studentIndex = this.students.map(function (student) {
            return student.id;
        }).indexOf(studentID);

        if (studentIndex === -1) {
            throw new Error('Student with ID: ' + studentID + ' was not found');
        } else {
            return this.students[studentIndex];
        }
    }

    function validateExamScore(Score) {
        if (Score.constructor !== Number) {
            throw new TypeError('Score must be a number! type: ' + typeof Score);
        }
    }

    function validateStudentIDsAreNotDuplicatedInExamResults(results) {
        var i,
            j,
            len;

        for (i = 0, len = results.length; i < len - 1; i += 1) {
            for (j = i + 1; j < len; j += 1) {
                if (results[i].StudentID == results[j].StudentID) {
                    throw new Error('StudentID: ' + results[i].StudentID + ' is duplicated at positions ' + i + ' and ' + j);
                }
            }
        }
    }

    var studentNameRegEx = /^([A-Z][a-z]*) ([A-Z][a-z]*)$/,
        invalidTitlesRegEx = /^\s|\s{2}|\s$/,

        examWeight = 0.75,
        homeworkWeight = 1 - examWeight,

        Course = {
            init: function (title, presentations) {
                this.title = title;
                this.presentations = presentations;
                this.students = [];

                return this;
            },

            addStudent: function (name) {
                var firstAndLastName,
                    firstName,
                    lastName,
                    id;

                validateStudentName(name);

                firstAndLastName = name.match(studentNameRegEx);
                firstName = firstAndLastName[1];
                lastName = firstAndLastName[2];

                id = this.students.length + 1;

                this.students.push({
                    firstname: firstName,
                    lastname: lastName,
                    id: id,
                    submittedHomework: Object.create(null),
                    examScore: 0,
                    finalScore: 0
                });

                return id;
            },

            getAllStudents: function () {
                return this.students.map(function (student) {
                    return {
                        firstname: student.firstname,
                        lastname: student.lastname,
                        id: student.id
                    }
                });
            },

            submitHomework: function (studentID, homeworkID) {
                var student;

                validateStudentID.call(this, studentID);
                validateHomeworkID.call(this, homeworkID);

                student = getStudentByID.call(this, studentID);
                student.submittedHomework[homeworkID] = true;
            },

            pushExamResults: function (results) {
                results.forEach(function (result) {
                    validateStudentID.call(this, result.StudentID);
                    validateExamScore(result.Score);
                }, this);

                validateStudentIDsAreNotDuplicatedInExamResults(results);

                results.forEach(function (result) {
                    var student = getStudentByID.call(this, result.StudentID);

                    student.examScore = result.Score;
                }, this);
            },

            getTopStudents: function () {
                var i,
                    topTenStudents = [],
                    presentationsCount = this.presentations.length,
                    studentsCount = this.students.length,
                    studentsUpToTenCount = (studentsCount > 10 ? 10 : studentsCount);

                // Calculate final score for each student.
                this.students.forEach(function (student) {
                    var submittedHomeworksCount = Object.keys(student.submittedHomework).length;

                    student.finalScore =
                        ((homeworkWeight * submittedHomeworksCount) / presentationsCount) + (student.examScore * examWeight);
                });

                this.students.sort(function (firstStudent, secondStudent) {
                    return secondStudent.finalScore - firstStudent.finalScore;
                });

                for (i = 0; i < studentsUpToTenCount; i += 1) {
                    topTenStudents.push({
                        firstname: this.students[i].firstname,
                        lastname: this.students[i].lastname,
                        id: this.students[i].id
                    });
                }

                return topTenStudents;
            }
        };

    Object.defineProperties(Course, {
        title: {
            set: function (title) {
                validateTitle(title);
                this._title = title;
            },

            get: function () {
                return this._title;
            }
        },
        presentations: {
            set: function (presentations) {
                if (presentations.constructor !== Array || !presentations.length) {
                    throw new Error('Presentations must be an non empty array.');
                }

                presentations.forEach(validateTitle);

                this._presentations = presentations.map(function (presentation, index) {
                    return {
                        title: presentation,
                        id: index + 1
                    }
                });
            },

            get: function () {
                return this._presentations;
            }
        }
    });

    return Course;
}

module.exports = solve;