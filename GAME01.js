var GAME01 = {
  paper: Paper.g(),
  type: 1, // 0: 한자 gen, 1: 뜻음 gen
  count: 0,
  repeatCount: 20,
  progress: {},
  gen: {},
  condition: {
    grade: '가',
    setRange: [1, 20]
  },
  choiceCount: 4,
  result: [],
  configure: function() {
    var self = GAME01;

    // progress 인스턴스 생성
    self.progress = new Library.Progress(self.repeatCount);

    // generate 인스턴스 생성
    self.gen = new Library.Generate({
      type: self.type,
      condition: self.condition,
      choiceCount: self.choiceCount
    });
  },

  generate: function() {
    var self = GAME01;
    self.gen.generate();
  },

  makeQuestion: function() {
    var self = GAME01;
    type = self.type;
    self.questionInfo = type === 0 ? self.gen.answer : self.gen.question;
    self.helping = type === 0 ? self.gen.mean : self.gen.mean;

    Library.drawQuestion({
      paper: self.paper,
      type: self.type,
      questionInfo: self.questionInfo,
      helping: self.helping,
    });
  },

  makeChoice: function() {
    var self = GAME01;
    var exampleInfo = self.gen.choiceInfo;

    var choices = Library.drawChoice({
      paper: self.paper,
      type: self.type,
      exampleInfo: exampleInfo
    });

    Library.choiceCheck({
      type: self.type,
      choices: choices,
      exampleInfo: exampleInfo,
      callback: self.control,
    });
  },

  control: function(bool, userChoice) {
    var self = GAME01;

    self.result.push({
      result: bool,
      userChoice: userChoice,
      question: self.questionInfo,
      choiceInfo: self.gen.choiceInfo
    });

    self.count += 1;

    if (self.count === self.repeatCount) {
      self.report();
    } else {
      self.paper.clear();
      self.generate();
      self.makeQuestion();
      self.makeChoice();
      self.progress.countUp();
    }
  },

  report: function() {
    var self = GAME01;
    self.paper.clear();
    self.progress.remove();

    var code03 = new Audio('aud/code03.mp3');
    code03.play();

    var result = self.result;
    var reportG = self.paper.g();

    var rightCount = 0;
    result.forEach(function(el) {
      if (el.result) rightCount += 1;
    });

    reportG.rect(0, 0, 360, 640, 6).attr({
      'stroke': 'gray',
      'fill': 'white'
    });

    reportG.image('img/end.png', 95, 170, 180, 180);
    reportG.image('img/star.png', 95, 90, 200, 120);

    var blueB = reportG.rect(40, 400, 120, 50).attr({
      'fill': 'skyblue',
      'rx': 8,
      'ry': 8
    });
    var blueBT = reportG.text(100, 432, '처음으로').attr({
      'font-size': 20,
      'text-anchor': 'middle'
    });
    var blue = reportG.g(blueB, blueBT).click(handler01).attr({
      'cursor': 'pointer'
    });

    function handler01() {
      location.replace('GAME.html');
    }

    var greenB = reportG.rect(200, 400, 120, 50).attr({
      'fill': '#86e07f',
      'rx': 8,
      'ry': 8
    });
    var greenBT = reportG.text(260, 432, '재도전').attr({
      'font-size': 20,
      'text-anchor': 'middle'
    });
    var red = reportG.g(greenB, greenBT).click(handler02).attr({
      'cursor': 'pointer'
    });

    function handler02() {
      location.reload();
    }

    // var orangeB = reportG.rect(40, 460, 280, 45).attr({
    //   'stroke': 'orange',
    //   'stroke-width': 3,
    //   'fill': '#F6F6F6',
    //   'rx': 8,
    //   'ry': 8
    // });
    // var orangeBT = reportG.text(180, 488, '사자성어 보기').attr({
    //   'font-size': 18,
    //   'text-anchor': 'middle'
    // });
    // var orange = reportG.g(orangeB, orangeBT).click(handler03).attr({
    //   'cursor': 'pointer'
    // });
    //
    // function handler03() {
    //   location.replace('card01.html');
    // }
  },

  start: function() {
    var self = GAME01;
    self.configure();
    self.generate();
    self.makeQuestion();
    self.makeChoice();
  }
};

GAME01.start();
