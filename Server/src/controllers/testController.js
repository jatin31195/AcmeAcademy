import Test from "../models/Test.js";
import UserTestAttempt from "../models/UserTestAttempt.js";
import User from "../models/User.js";
import Topic from "../models/Topic.js";

export const createTest = async (req, res) => {
  try {
    const test = await Test.create(req.body);
    if (req.body.topic) {
      await Topic.findByIdAndUpdate(
        req.body.topic,
        { $push: { tests: test._id } },
        { new: true }
      );
    }
    res.status(201).json(test);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const addQuestionsToTest = async (req, res) => {
  try {
    const { testId } = req.params;
    const { questions } = req.body;

    if (!questions || questions.length === 0)
      return res.status(400).json({ message: "No questions provided" });

    const test = await Test.findById(testId);
    if (!test) return res.status(404).json({ message: "Test not found" });

   
    test.questions.push(...questions);

    
    test.totalQuestions = test.questions.length;

   
    if (test.sections && test.sections.length > 0) {
  
      let totalMarks = 0;
      test.sections.forEach((sec) => {
        const secQuestions = test.questions.filter(
          (q) => q.section?.toString() === sec._id.toString()
        );
        const marksPerQ = sec.marksPerQuestion ?? 1;
        totalMarks += secQuestions.length * marksPerQ;
        sec.numQuestions = secQuestions.length; 
      });
      test.totalMarks = totalMarks;
    } else {
      
      test.totalMarks = test.questions.length;
    }

    await test.save();

    res.json({
      message: "Questions added successfully",
      totalQuestions: test.totalQuestions,
      totalMarks: test.totalMarks,
    });
  } catch (err) {
    console.error("Error adding questions:", err);
    res.status(500).json({ message: err.message });
  }
};


// Upload solution image
export const uploadSolutionImage = async (req, res) => {
  try {
    res.json({ url: req.file.path });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get test for user (hide solutions)
export const getTestForUser = async (req, res) => {
  try {
    const test = await Test.findById(req.params.id)
      .select("-questions.solution")
      .populate("topic", "title");
    if (!test) return res.status(404).json({ message: "Test not found" });

    res.json(test);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const submitTest = async (req, res) => {
  try {
    const userId = req.user._id;
    const { answers, totalTimeTaken } = req.body;
    const testId = req.params.id;

    const previousAttempts = await UserTestAttempt.find({ user: userId, test: testId });
    if (previousAttempts.length >= 5)
      return res.status(400).json({ message: "Max attempts reached" });

    const test = await Test.findById(testId);
    if (!test) return res.status(404).json({ message: "Test not found" });

    let totalScore = 0;

    const markedAnswers = answers.map(ans => {
      const question = test.questions.find(q => q._id.toString() === ans.question.toString());
      if (!question) return { ...ans, marksObtained: 0 };

      const section = test.sections.find(s => s._id.toString() === question.section?.toString());
      const marks = section?.marksPerQuestion ?? 1;
      const negativeMarks = section?.negativeMarks ?? 0;

      const userAns = ans.answer?.toString().trim();
      const correctAns = question.correctAnswer?.toString().trim();

      let marksObtained = 0;
      if (userAns && userAns === correctAns) marksObtained = marks;
      else if (userAns) marksObtained = -negativeMarks;

      totalScore += marksObtained;
      return {
        question: ans.question,
        answer: ans.answer,
        marksObtained,
        timeTaken: ans.timeTaken || 0,
      };
    });

    const attemptNumber = previousAttempts.length + 1;

    // Save attempt first
    const attempt = await UserTestAttempt.create({
      user: userId,
      test: testId,
      answers: markedAnswers,
      score: totalScore,
      attemptNumber,
      isSubmitted: true,
      submittedAt: new Date(),
      totalTimeTaken: totalTimeTaken || 0,
    });

    await User.findByIdAndUpdate(userId, { $push: { testAttempts: attempt._id } });

    // 🧮 Now calculate rank among all attempts for this test
    const allAttempts = await UserTestAttempt.find({ test: testId, isSubmitted: true })
      .sort({ score: -1, totalTimeTaken: 1, submittedAt: 1 });

    let rank = 1;
    for (let i = 0; i < allAttempts.length; i++) {
      const a = allAttempts[i];
      a.rank = i + 1;
      await a.save();
      if (a._id.toString() === attempt._id.toString()) {
        rank = a.rank;
      }
    }

    res.json({
      message: "Test submitted successfully",
      score: totalScore,
      rank,
      attempt: { ...attempt.toObject(), rank },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};



// User test history
export const getUserTestHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const testId = req.params.id;

    const history = await UserTestAttempt.find({ user: userId, test: testId })
      .sort({ submittedAt: -1 })
      .populate("test", "title sections totalMarks totalDurationMinutes totalQuestions");

    res.json(history);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getUserTestResult = async (req, res) => {
  try {
    const userId = req.user._id;
    const { testId } = req.params;

    const attempt = await UserTestAttempt.findOne({
      user: userId,
      test: testId,
      isSubmitted: true,
    })
      .sort({ submittedAt: -1 })
      .populate({
        path: "test",
        select:
          "title category sections questions totalMarks totalQuestions totalDurationMinutes",
      });

    if (!attempt)
      return res.status(404).json({ message: "No submitted attempt found" });

    const test = attempt.test;
    if (!test)
      return res.status(404).json({ message: "Associated test not found" });


    const findQuestionById = (qid) => {
      if (!qid) return null;
      const qidStr = qid.toString();
      return (
        test.questions.find((q) => q._id && q._id.toString() === qidStr) || null
      );
    };

    let correct = 0;
    let incorrect = 0;
    let unattempted = 0;
    let totalScore = 0;
    let positiveMarks = 0;
    let negativeMarks = 0;


    const questionsReport = test.questions.map((question) => {
  const qidStr = question._id.toString();

  const userAnsObj = attempt.answers.find(
    (a) => a.question.toString() === qidStr
  );

  const sectionId = question.section ? question.section.toString() : null;
  const section =
    test.sections?.find((s) => s._id && s._id.toString() === sectionId) || null;

  const marksForQuestion = section?.marksPerQuestion ?? 1;
  const negMarks = section?.negativeMarks ?? 0;

  const correctAnswer = question.correctAnswer
    ? question.correctAnswer.toString().trim()
    : null;

  const userAnswerRaw = userAnsObj?.answer ?? null;
  const userAnswer =
    userAnswerRaw === null || userAnswerRaw === undefined
      ? null
      : userAnswerRaw.toString().trim();

  let result = "unattempted";
  if (userAnswer) {
    result =
      correctAnswer !== null && userAnswer === correctAnswer
        ? "correct"
        : "wrong";
  }

  let marksObtained = 0;
  if (result === "correct") {
    marksObtained = marksForQuestion;
    correct++;
    positiveMarks += marksObtained;
  } else if (result === "wrong") {
    marksObtained = -negMarks;
    incorrect++;
    negativeMarks += Math.abs(marksObtained);
  } else {
    unattempted++;
  }

  totalScore += marksObtained;

  return {
    questionId: qidStr,
    sectionId,
    questionText: question.text ?? null,
    options: question.options ?? [],
    correctAnswer,
    userAnswer,
    result,
    timeTaken: userAnsObj?.timeTaken || 0,
    markedForReview: userAnsObj?.markedForReview || false, // ✅ optional field
    marksForQuestion,
    negativeMarks: negMarks,
    marksObtained,
    solution: question.solution ?? null,
  };
});


    const sections = test.sections?.map((sec) => {
      const secQuestions = questionsReport.filter(
        (q) => q.sectionId === sec._id.toString()
      );
      const secTotalMarks =
        (sec.numQuestions || secQuestions.length) * (sec.marksPerQuestion || 1);
      const secScore = secQuestions.reduce(
        (sum, q) => sum + (q.marksObtained || 0),
        0
      );
      const secCorrect = secQuestions.filter(q => q.result === "correct").length;
      const secIncorrect = secQuestions.filter(q => q.result === "wrong").length;
      const secUnattempted = secQuestions.filter(q => q.result === "unattempted").length;

      const secAttempted = secCorrect + secIncorrect;
      const secAccuracy = secAttempted > 0 ? (secCorrect / secAttempted) * 100 : 0;

      return {
        sectionId: sec._id,
        title: sec.title,
        marksPerQuestion: sec.marksPerQuestion,
        negativeMarks: sec.negativeMarks,
        totalQuestions: sec.numQuestions || secQuestions.length,
        totalMarks: secTotalMarks,
        scoreObtained: secScore,
        stats: {
          correct: secCorrect,
          incorrect: secIncorrect,
          unattempted: secUnattempted,
        },
        questions: secQuestions, 
      };
    });

    const maxMarks =
      test.sections?.length > 0
        ? test.sections.reduce(
            (acc, s) => acc + (s.numQuestions * (s.marksPerQuestion ?? 1)),
            0
          )
        : test.totalMarks ?? 0;

    const totalTimeTaken =
      attempt.totalTimeTaken ||
      attempt.answers.reduce((acc, a) => acc + (a.timeTaken || 0), 0);

    const totalQuestions =
      test.totalQuestions && test.totalQuestions > 0
        ? test.totalQuestions
        : test.sections?.length > 0
        ? test.sections.reduce((acc, s) => acc + (s.numQuestions || 0), 0)
        : questionsReport.length;

    const attempted = correct + incorrect;
    const accuracy = attempted > 0 ? (correct / attempted) * 100 : 0;

  
    res.json({
      testId: test._id,
      testTitle: test.title,
      category: test.category || null,
      attemptNumber: attempt.attemptNumber,
      rank: attempt.rank ?? null,
      submittedAt: attempt.submittedAt,
      totalTimeTaken,
      totalScore,
      totalMarks: maxMarks,
      accuracy,
      stats: {
        correct,
        incorrect,
        unattempted,
        positiveMarks,
        negativeMarks,
      },
      sections, 
      questions: questionsReport,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};





export const updateQuestionSolution = async (req, res) => {
  try {
    const { testId, questionId } = req.params;
    const { solution } = req.body;

    const test = await Test.findById(testId);
    if (!test) return res.status(404).json({ message: "Test not found" });

    const question = test.questions.id(questionId);
    if (!question) return res.status(404).json({ message: "Question not found" });

    question.solution = solution;
    await test.save();

    res.json({ message: "Solution updated successfully", solution });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const getUserPerformanceAnalytics = async (req, res) => {
  try {
    const userId = req.user._id;


    const attempts = await UserTestAttempt.find({ user: userId, isSubmitted: true })
      .populate({
        path: "test",
        select: "title sections questions",
      });

    if (!attempts.length)
      return res.status(200).json({ message: "No test attempts found", analytics: [] });

    const subjectStats = {}; 

    for (const attempt of attempts) {
      const test = attempt.test;
      if (!test || !test.sections?.length) continue;

      for (const section of test.sections) {
        const secTitle = section.title || "Unknown Section";

        const secQuestions = attempt.answers.filter(a => {
          const q = test.questions.find(q => q._id.toString() === a.question.toString());
          return q && q.section?.toString() === section._id.toString();
        });

        if (!secQuestions.length) continue;

        let correct = 0, incorrect = 0, unattempted = 0, totalMarks = 0, scoredMarks = 0;

        for (const ans of secQuestions) {
          const question = test.questions.find(q => q._id.toString() === ans.question.toString());
          const correctAns = question?.correctAnswer?.toString().trim();
          const userAns = ans.answer?.toString().trim();

          if (!userAns) unattempted++;
          else if (userAns === correctAns) {
            correct++;
            scoredMarks += section.marksPerQuestion ?? 1;
          } else {
            incorrect++;
            scoredMarks -= section.negativeMarks ?? 0;
          }

          totalMarks += section.marksPerQuestion ?? 1;
        }

        const attempted = correct + incorrect;
        const accuracy = attempted > 0 ? (correct / attempted) * 100 : 0;

     
        if (!subjectStats[secTitle]) {
          subjectStats[secTitle] = {
            totalTests: 0,
            totalQuestions: 0,
            totalAttempted: 0,
            totalCorrect: 0,
            totalIncorrect: 0,
            totalUnattempted: 0,
            totalMarksScored: 0,
            totalPossibleMarks: 0,
          };
        }

        subjectStats[secTitle].totalTests++;
        subjectStats[secTitle].totalQuestions += secQuestions.length;
        subjectStats[secTitle].totalAttempted += attempted;
        subjectStats[secTitle].totalCorrect += correct;
        subjectStats[secTitle].totalIncorrect += incorrect;
        subjectStats[secTitle].totalUnattempted += unattempted;
        subjectStats[secTitle].totalMarksScored += scoredMarks;
        subjectStats[secTitle].totalPossibleMarks += totalMarks;
      }
    }

   
    const analytics = Object.entries(subjectStats).map(([subject, data]) => {
      const accuracy =
        data.totalAttempted > 0 ? (data.totalCorrect / data.totalAttempted) * 100 : 0;

      const avgScore =
        data.totalTests > 0 ? data.totalMarksScored / data.totalTests : 0;

      const avgMarksPercent =
        data.totalPossibleMarks > 0
          ? (data.totalMarksScored / data.totalPossibleMarks) * 100
          : 0;

      return {
        subject,
        testsTaken: data.totalTests,
        totalQuestions: data.totalQuestions,
        attempted: data.totalAttempted,
        correct: data.totalCorrect,
        incorrect: data.totalIncorrect,
        unattempted: data.totalUnattempted,
        accuracy: Number(accuracy.toFixed(2)),
        avgScore: Number(avgScore.toFixed(2)),
        avgMarksPercent: Number(avgMarksPercent.toFixed(2)),
      };
    });

    res.json({
      success: true,
      totalSubjects: analytics.length,
      analytics,
    });
  } catch (err) {
    console.error("Error in analytics:", err);
    res.status(500).json({ message: "Error fetching analytics" });
  }
};

export const getUserTestResultByAttempt = async (req, res) => {
  try {
    const userId = req.user._id;
    const { testId, attemptNumber } = req.params;

    const attempt = await UserTestAttempt.findOne({
      user: userId,
      test: testId,
      attemptNumber: Number(attemptNumber),
      isSubmitted: true,
    }).populate({
      path: "test",
      select:
        "title category sections questions totalMarks totalQuestions totalDurationMinutes",
    });

    if (!attempt)
      return res.status(404).json({ message: "No such attempt found" });

    const test = attempt.test;
    if (!test)
      return res.status(404).json({ message: "Associated test not found" });

    const findQuestionById = (qid) => {
      if (!qid) return null;
      const qidStr = qid.toString();
      return (
        test.questions.find((q) => q._id && q._id.toString() === qidStr) || null
      );
    };

    let correct = 0;
    let incorrect = 0;
    let unattempted = 0;
    let totalScore = 0;
    let positiveMarks = 0;
    let negativeMarks = 0;

   const questionsReport = test.questions.map((question) => {
  const qidStr = question._id.toString();

  const userAnsObj = attempt.answers.find(
    (a) => a.question.toString() === qidStr
  );

  const sectionId = question.section ? question.section.toString() : null;
  const section =
    test.sections?.find((s) => s._id && s._id.toString() === sectionId) || null;

  const marksForQuestion = section?.marksPerQuestion ?? 1;
  const negMarks = section?.negativeMarks ?? 0;

  const correctAnswer = question.correctAnswer
    ? question.correctAnswer.toString().trim()
    : null;

  const userAnswerRaw = userAnsObj?.answer ?? null;
  const userAnswer =
    userAnswerRaw === null || userAnswerRaw === undefined
      ? null
      : userAnswerRaw.toString().trim();

  let result = "unattempted";
  if (userAnswer) {
    result =
      correctAnswer !== null && userAnswer === correctAnswer
        ? "correct"
        : "wrong";
  }

  let marksObtained = 0;
  if (result === "correct") {
    marksObtained = marksForQuestion;
    correct++;
    positiveMarks += marksObtained;
  } else if (result === "wrong") {
    marksObtained = -negMarks;
    incorrect++;
    negativeMarks += Math.abs(marksObtained);
  } else {
    unattempted++;
  }

  totalScore += marksObtained;

  return {
    questionId: qidStr,
    sectionId,
    questionText: question.text ?? null,
    options: question.options ?? [],
    correctAnswer,
    userAnswer,
    result,
    timeTaken: userAnsObj?.timeTaken || 0,
    markedForReview: userAnsObj?.markedForReview || false, // ✅ optional field
    marksForQuestion,
    negativeMarks: negMarks,
    marksObtained,
    solution: question.solution ?? null,
  };
});


    const sections = test.sections?.map((sec) => {
      const secQuestions = questionsReport.filter(
        (q) => q.sectionId === sec._id.toString()
      );
      const secTotalMarks =
        (sec.numQuestions || secQuestions.length) * (sec.marksPerQuestion || 1);
      const secScore = secQuestions.reduce(
        (sum, q) => sum + (q.marksObtained || 0),
        0
      );
      const secCorrect = secQuestions.filter((q) => q.result === "correct").length;
      const secIncorrect = secQuestions.filter((q) => q.result === "wrong").length;
      const secUnattempted = secQuestions.filter(
        (q) => q.result === "unattempted"
      ).length;

      const secAttempted = secCorrect + secIncorrect;
      const secAccuracy = secAttempted > 0 ? (secCorrect / secAttempted) * 100 : 0;

      return {
        sectionId: sec._id,
        title: sec.title,
        marksPerQuestion: sec.marksPerQuestion,
        negativeMarks: sec.negativeMarks,
        totalQuestions: sec.numQuestions || secQuestions.length,
        totalMarks: secTotalMarks,
        scoreObtained: secScore,
        stats: {
          correct: secCorrect,
          incorrect: secIncorrect,
          unattempted: secUnattempted,
        },
        questions: secQuestions,
      };
    });

    const maxMarks =
      test.sections?.length > 0
        ? test.sections.reduce(
            (acc, s) => acc + (s.numQuestions * (s.marksPerQuestion ?? 1)),
            0
          )
        : test.totalMarks ?? 0;

    const totalTimeTaken =
      attempt.totalTimeTaken ||
      attempt.answers.reduce((acc, a) => acc + (a.timeTaken || 0), 0);

    const totalQuestions =
      test.totalQuestions && test.totalQuestions > 0
        ? test.totalQuestions
        : test.sections?.length > 0
        ? test.sections.reduce((acc, s) => acc + (s.numQuestions || 0), 0)
        : questionsReport.length;

    const attempted = correct + incorrect;
    const accuracy = attempted > 0 ? (correct / attempted) * 100 : 0;

    res.json({
      testId: test._id,
      testTitle: test.title,
      category: test.category || null,
      attemptNumber: attempt.attemptNumber,
      rank: attempt.rank ?? null,
      submittedAt: attempt.submittedAt,
      totalTimeTaken,
      totalScore,
      totalMarks: maxMarks,
      accuracy,
      stats: {
        correct,
        incorrect,
        unattempted,
        positiveMarks,
        negativeMarks,
      },
      sections,
      questions: questionsReport,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

