import Test from "../models/Test.js";
import UserTestAttempt from "../models/UserTestAttempt.js";
import User from "../models/User.js";

// Create Test
export const createTest = async (req, res) => {
  try {
    const test = await Test.create(req.body);
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
      if (userAns && userAns === correctAns) {
        marksObtained = marks;
      } else if (userAns) {
        marksObtained = -negativeMarks;
      }

      totalScore += marksObtained;

      return {
        question: ans.question,
        answer: ans.answer,
        marksObtained,
        timeTaken: ans.timeTaken || 0,
      };
    });

    const attemptNumber = previousAttempts.length + 1;

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

    res.json({
      message: "Test submitted successfully",
      score: totalScore,
      attempt,
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


    const questionsReport = attempt.answers.map((ans) => {
      const qidStr = ans.question ? ans.question.toString() : null;
      const question = findQuestionById(qidStr);

      const questionText = question?.text ?? null;
      const options = question?.options ?? [];
      const correctAnswer = question?.correctAnswer
        ? question.correctAnswer.toString().trim()
        : null;

      const sectionId = question?.section ? question.section.toString() : null;
      const section =
        test.sections?.find(
          (s) => s._id && s._id.toString() === sectionId
        ) || null;

      const marksForQuestion = section?.marksPerQuestion ?? 1;
      const negMarks = section?.negativeMarks ?? 0;

      const userAnswerRaw = ans.answer ?? null;
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
        questionText,
        options, 
        correctAnswer,
        userAnswer,
        result,
        timeTaken: ans.timeTaken || 0,
        marksForQuestion,
        negativeMarks: negMarks,
        marksObtained,
        solution: question?.solution ?? null,
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

    const accuracy = totalQuestions > 0 ? (correct / totalQuestions) * 100 : 0;

  
    res.json({
      testId: test._id,
      testTitle: test.title,
      category: test.category || null,
      attemptNumber: attempt.attemptNumber,
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




// Update solution for a question
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
