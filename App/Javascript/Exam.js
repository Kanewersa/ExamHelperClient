class Exam {
    constructor(id, name, description, course_id) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.course_id = course_id;
        this.questions = [];
    }

    static fromJson(json) {
        return new Exam(json[0], json[1], json[2], json[3]);
    }
}

module.exports = {
    Exam: Exam
}