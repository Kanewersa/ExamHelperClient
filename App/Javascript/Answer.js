class Answer {
    constructor(id,  question_id, content, image, upvotes, downvotes) {
        this.id = id;
        this.question_id = question_id;
        this.content = content;
        this.image = image;
        this.upvotes = upvotes;
        this.downvotes = downvotes;
        this.voted = false;
    }

    static fromJson(json) {
        return new Answer(json[0], json[1], json[2], json[3], json[4], json[5]);
    }
}

module.exports = {
    Answer: Answer
}