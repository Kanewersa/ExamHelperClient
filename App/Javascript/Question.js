class Question {
    constructor(id, content, image, exam_id) {
        this.id = id;
        this.content = content;
        this.image = image;
        this.exam_id = exam_id;
        this.answers = [];
    }

    static fromJson(json) {
        return new Question(json["id"], json["content"], json["base64"], json["exam_id"]);
    }
}

module.exports = {
    Question: Question
}