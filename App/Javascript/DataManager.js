const {Course} = require("./Course");
const {Exam} = require("./Exam");
const {Term} = require("./Term");

class DataManager {
    constructor(props) {
        this.terms = {};
        this.courses = {};
        this.exams = {};
        this.questions = {};
        this.answers = {};

        this.types = {
            Term: this.terms,
            Course: this.courses,
            Exam: this.exams,
            Question: this.questions,
            Answer: this.answers
        }
    }

    addObject(obj) {
        this.types[obj.type][obj.id] = obj;
    }

    removeObject(obj) {
        return this.types[obj.type].delete(obj.id);
    }

    hasObject(obj) {
        return obj.id in this.types[obj.type];
    }

    getObject(type, id) {
        return this.types[type][id];
    }

    fromJson(type, json) {
        return type.fromJson(json);
    }

    readStartData(jsonData) {
        let data = JSON.parse(jsonData);
        let termsData = data["terms"];
        let coursesData = data["courses"];
        let examsData = data["exams"];

        let terms = {};
        let courses = {};
        let exams = {};

        for (let i = 0; i < termsData.length; i++) {
            let info = termsData[i];
            let term = Term.fromJson(info);
            this.terms[term.id] = term;
            terms[info[0]] = term;
        }

        for (let i = 0; i < coursesData.length; i++) {
            let info = coursesData[i];
            let course = Course.fromJson(info);
            this.courses[course.id] = course;
            courses[info[0]] = course;
            terms[course.term_id].courses.push(course);
        }

        for (let i = 0; i < examsData.length; i++) {
            let info = examsData[i];
            let exam = Exam.fromJson(info)
            this.exams[exam.id] = exam;
            exams[info[0]] = exam;
            courses[exam.course_id].exams.push(exam);
        }

        return Object.keys(terms).map(function(k) { return terms[k]; });
    }
}

module.exports = {
    DataManager: DataManager
}