const trm = require("./Javascript/Term");
let Term = trm.Term;
const crs = require("./Javascript/Course");
let Course = crs.Course;
const exm = require("./Javascript/Exam");
let Exam = exm.Exam;
const inst = require("./Javascript/Instructor");
let Instructor = inst.Instructor;
const answ = require("./Javascript/Answer");
let Answer = answ.Answer;
const qst = require("./Javascript/Question");
let Question = qst.Question;

$ = require('jquery');

$.expr[":"].contains = $.expr.createPseudo(function(arg) {
    return function( elem ) {
        return $(elem).text().toUpperCase().indexOf(arg.toUpperCase()) >= 0;
    };
});

const {screen, shell, ipcRenderer} = require('electron');

let connectionOff = $('#connection-off');
let connectionOn = $('#connection-on');

let loadingAnimation = $('#loading-animation');
let loginPanel = $('#login-panel');
let nameInput = $('#name-input');
let loginButton = $('#login-button');
let termsPanel = $('#terms');
let activeTermTitle = $('#active-term');
let coursesList = $('#courses');
let currentCourses = coursesList.find('li');
let courseTitle = $('#course-title');
let instructorsView = $('#instructors');
let examsView = $('#exams');
let circle = $('#circle');
let answersPanel = $('#answers-panel');
let answersHolder = $('#answers-holder');
let galleryModal = $('#gallery-modal');
let questionModal = $('#question-modal');
let activeQuestionImage = $('#active-question-image');
let activeQuestionContent = $('#active-question-content');
let loadingModal = $('#loading-modal');
let modalClose = $('#gallery-modal-close');
let questionModalClose = $('#question-modal-close');
let gallery = $('#gallery');
let examName = $('#exam-name');
let searchInput = $('#search-input');
let arrowButton = $('#arrow');
let arrowIcon = $('#icon');
let circleTop = 0;
let circleLeft = 0;

let loggedIn = false;

const Connection = require("./Javascript/connection");
const {DataManager} = require("./Javascript/DataManager");
Connection.connectToServer();
Connection.onmessage.attach(readStartingData);

Connection.onerror.attach(function() {
    loadingModal.fadeIn();
    connectionOn.hide();
    connectionOff.show();
});

Connection.onopen.attach(function () {
    if (loggedIn) {
        loadingModal.fadeOut();
    }
    connectionOn.show();
    connectionOff.hide();
});

function readStartingData(sender, args) {
    let data = args['data'];

    if (data.startsWith('login')) {
        loadingAnimation.addClass('hidden');
        loginPanel.removeClass('hidden');

        nameInput.keydown(function() {
           nameInput.removeClass('error');
        });

        loginButton.click(function() {
           if (nameInput.val().length < 4) {
               nameInput.addClass('error');
           } else {
               Connection.sendMessage('login/' + nameInput.val());
           }
        });

        // TODO: Enter user name here!
        return;
    }

    let manager = new DataManager();
    let terms = manager.readStartData(args['data']);
    loadData(terms);
    Connection.onmessage.detach(readStartingData);
    Connection.onmessage.attach(readMessage);
    loggedIn = true;
    loadingModal.fadeOut();
}

function readMessage(sender, args) {
    let data = args['data'];
    if (data.startsWith('questions')) {
        data = data.substring(10);
        loadQuestions(JSON.parse(data));
    } else if (data.startsWith('answers')) {
        $("body").css("cursor", "default");
        questionModal.fadeIn();
        data = data.substring(8);
        loadAnswers(JSON.parse(data));
    } else if (data.startsWith('added_question')) {
        let questionData = data.substring(15);
        $.get("./Views/gallery-image.html", function (data) {
            loadQuestion(data, Question.fromJson(JSON.parse(questionData)));
        });
    }
}

function loadAnswers(answers) {
    $.get("./Views/answer.html", function (data) {
        answersHolder.html('');

        for (let i = 0; i < answers.length; i++) {
            let answer = Answer.fromJson(answers[i]);
            let element = $(data);
            answersHolder.append(element).ready(function () {
                let upvote = element.find('.score.up');
                let downvote = element.find('.score.down');

                upvote.find('p').text(answer.upvotes.toString());
                downvote.find('p').text(answer.downvotes.toString());
                element.find('h3').text(answer.content);

                upvote.click(function () {
                    voteForAnswer(answer.id, 1);
                });

                downvote.click(function() {
                    voteForAnswer(answer.id, -1);
                });
            });
        }
    });
}

function voteForAnswer(answer, vote) {

}

function unvoteAnswer(answer) {

}

ipcRenderer.on('pressed-esc', ((event, args) => {
    if (questionModal.hasClass('show')) {
        closeQuestionModal(event);
    } else {
        closeGalleryModal(event);
    }
}));

function closeQuestionModal(event) {
    questionModal.fadeOut();
    galleryModal.removeClass('blur');
}

function closeGalleryModal(event) {
    Connection.sendMessage("leave_channel");
    galleryModal.fadeOut();
    setTimeout(function () {
        circleTop = event.pageY - $(window).scrollTop();
        circleLeft = event.pageX - $(window).scrollLeft();

        circle.addClass('fast-transition');
        circle.removeClass('active');
        circle.css({top: circleTop, left: circleLeft})
        circle[0].offsetHeight;
        circle.removeClass('fast-transition');
    }, 250);
}

questionModalClose.click(function (event) {
    closeQuestionModal(event);
});

searchInput.on('input', function () {
    let text = searchInput.val();
    if (text.length > 12) {
        let width = 200 + (text.length - 12) * 8;
        searchInput.css('width', width)
    } else {
        searchInput.css('width', 200);
    }

    let searchTerm = text.trim().split(' ');

    let results = $('#gallery p:contains("' + searchTerm.join('"):contains("') + '")');

    questionsSet.forEach(question => {
        question.addClass('hide');
    });

    results.each(function() {
        $(this).parent().removeClass('hide');
    });
});

modalClose.click(function (event) {
    closeGalleryModal(event);
});

function toggleTerms() {
    if (termsPanel.hasClass('hide')) {
        termsPanel.removeClass('hide');
        arrowButton.addClass('move');
        arrowIcon.addClass('rotate');
    } else {
        termsPanel.addClass('hide');
        arrowButton.removeClass('move');
        arrowIcon.removeClass('rotate');
    }
}

arrowButton.click(toggleTerms);

function loadQuestionView(question) {
    activeQuestionImage.attr('src', question.base64);
    activeQuestionContent.text(question.content);
    galleryModal.addClass('blur');
    $("body").css("cursor", "progress");
    Connection.sendMessage("get_answers/" + question.id)
}

let questionsSet = new Set();

function loadQuestions(questions) {
    $.get("./Views/gallery-image.html", function (data) {
        gallery.html('');

        let values = Object.values(questions)
        for (let i = 0; i < values.length; i++) {
            let question = values[i];
            loadQuestion(data, Question.fromJson(question));
        }
    });
}

function loadQuestion(data, question) {
    let element = $(data);
    questionsSet.add(element);
    gallery.append(element).ready(function () {
        element.find('p').text(question.content);
        element.find('img').attr('src', question.image);
        element.click(function () {
            loadQuestionView(question);
        });
    });
}

function loadExam(event) {
    let exam = event.data.exam;

    Connection.sendMessage("join_channel/" + exam.id);
    Connection.sendMessage("get_questions");
    circleTop = event.pageY - $(window).scrollTop();
    circleLeft = event.pageX - $(window).scrollLeft();

    circle.addClass('no-transition');
    circle.css({top: circleTop, left: circleLeft});
    circle[0].offsetHeight;
    circle.removeClass('no-transition');

    circle.addClass('active');
    circle.css({top: circleTop - 5000, left: circleLeft - 5000})

    examName.html(exam.name);
    setTimeout(function () {
        galleryModal.fadeIn();
    }, 1500);
}

function loadCourse(event) {
    currentCourses.each(function () {
        $(this).removeClass('active');
    });

    if (event === null) {
        examsView.html('');
        courseTitle.html('Select course');
        return;
    }

    $(this).addClass('active');

    let course = event.data.course;

    courseTitle.html(course.name);

    instructorsView.html('');

    $.get("./Views/instructor.html", function (data) {
        for (let i = 0; i < course.instructors.length; i++) {
            let element = $(data);
            instructorsView.append(element).ready(function () {
                let instructor = course.instructors[i];
                element.text(instructor.name);
                element.data('link', instructor.link);
                element.click(function () {
                    shell.openExternal($(this).data('link'));
                });
            });
        }
    });

    examsView.html('');

    $.get("./Views/exam.html", function (data) {
        for (let i = 0; i < course.exams.length; i++) {
            let element = $(data);
            examsView.append(element).ready(function () {
                let exam = course.exams[i];
                element.find('h2').text(exam.name);
                element.find('p').text(exam.description);
                element.find('button').click({exam: course.exams[i]}, loadExam);
            });
        }
    });
}

function loadTerm(event) {
    let term = event.data.term;
    activeTermTitle.text("Term " + term.name[1]);
    coursesList.html("");
    toggleTerms();

    $.get("./Views/course.html", function (data) {
        for (let x = 0; x < term.courses.length; x++) {
            let element = $(data);
            coursesList.append(element).ready(function () {
                element.text(term.courses[x].name);
                element.click({course: term.courses[x]}, loadCourse);
            });
        }
        currentCourses = coursesList.find('li');
    });

    loadCourse(null);
}

function loadData(terms) {
    $.get("./Views/term-box.html", function (data) {
        for (let i = 0; i < terms.length; i++) {
            let term = terms[i];
            let element = $(data);
            termsPanel.append(element).ready(function () {
                element.find('h1').text(term.name);
            });

            element.click({term: term}, loadTerm);
        }
    });
}

const courseView = require("./Javascript/course-view");
courseView.initialize();

const shortcuts = require("./Javascript/shortcuts");
shortcuts.initialize(Connection);

const titlebar = require("./Javascript/titlebar");
titlebar.initialize();
