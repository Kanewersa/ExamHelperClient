class Course {
    constructor(id, name, term_id) {
        this.id = id;
        this.name = name;
        this.term_id = term_id;
        this.instructors = [];
        this.exams = [];
    }

    static fromJson(json) {
        return new Course(json[0], json[1], json[2]);
    }
}

module.exports = {
    Course: Course
}