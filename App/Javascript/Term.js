class Term {
    constructor(id, name) {
        this.id = id;
        this.name = name;
        this.courses = [];
    }

    static fromJson(json) {
        return new Term(json[0], json[1]);
    }
}

module.exports = {
    Term: Term
}