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

// Add Questions to Test
export const addQuestionsToTest = async (req, res) => {
  try {
    const { testId } = req.params;
    const { questions } = req.body;
    if (!questions || questions.length === 0)
      return res.status(400).json({ message: "No questions provided" });

    const test = await Test.findById(testId);
    if (!test) return res.status(404).json({ message: "Test not found" });

    test.questions.push(...questions);
    await test.save();

    res.json({ message: "Questions added successfully", totalQuestions: test.questions.length });
  } catch (err) {
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

// Submit test (string-based answers)
export const submitTest = async (req, res) => {
  try {
    const userId = req.user._id;
    const { answers } = req.body; // [{ question: "...", answer: "..." }]
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
      } else {
        marksObtained = 0;
      }

      totalScore += marksObtained;
      return { ...ans, marksObtained };
    });

    const attemptNumber = previousAttempts.length + 1;

    // Total possible marks = sum of marksPerQuestion * numQuestions for all sections
    const totalPossibleMarks = test.sections.reduce(
      (acc, s) => acc + s.numQuestions * s.marksPerQuestion,
      0
    );

    const attempt = await UserTestAttempt.create({
      user: userId,
      test: testId,
      answers: markedAnswers,
      score: totalScore,
      attemptNumber,
      isSubmitted: true,
      submittedAt: new Date(),
      totalPossibleMarks,
    });

    await User.findByIdAndUpdate(userId, { $push: { testAttempts: attempt._id } });

    res.json({
      message: "Test submitted successfully",
      score: totalScore,
      totalPossibleMarks,
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

// User test result
// User test result (fixed with section-based scoring)
export const getUserTestResult = async (req, res) => {
  try {
    const userId = req.user._id;
    const { testId } = req.params;

    // Populate both test and answers
    const attempt = await UserTestAttempt.findOne({
      user: userId,
      test: testId,
      isSubmitted: true,
    })
      .sort({ submittedAt: -1 })
      .populate({
        path: "answers.question",
      })
      .populate({
        path: "test",
        select: "questions sections title totalMarks totalQuestions",
      });

    if (!attempt) return res.status(404).json({ message: "No submitted attempt found" });

    let correct = 0,
      incorrect = 0,
      unattempted = 0,
      totalScore = 0,
      positiveMarks = 0,
      negativeMarks = 0;

    const markedAnswers = attempt.answers.map(ans => {
      const question = attempt.test.questions?.find(
        q => q._id.toString() === ans.question._id.toString()
      );
      if (!question) return { ...ans, marksObtained: 0 };

      const section = attempt.test.sections?.find(
        s => s._id.toString() === question.section?.toString()
      );

      const marks = section?.marksPerQuestion ?? 1;
      const negMarks = section?.negativeMarks ?? 0;

      const userAns = ans.answer?.toString().trim();
      const correctAns = question.correctAnswer?.toString().trim();

      let marksObtained = 0;

      if (userAns && userAns === correctAns) {
        marksObtained = marks;
        correct++;
        positiveMarks += marksObtained;
      } else if (userAns) {
        marksObtained = -negMarks;
        incorrect++;
        negativeMarks += -marksObtained; // store positive value
      } else {
        marksObtained = 0;
        unattempted++;
      }

      totalScore += marksObtained;
      return { ...ans, marksObtained };
    });

    // Calculate max possible marks from the test sections
    const maxMarks = attempt.test.sections?.reduce(
      (acc, s) => acc + s.numQuestions * s.marksPerQuestion,
      0
    );

    const percentage = maxMarks > 0 ? (totalScore / maxMarks) * 100 : 0;

    res.json({
      testId: attempt.test._id,
      testTitle: attempt.test.title,
      userId: attempt.user,
      attemptNumber: attempt.attemptNumber,
      submittedAt: attempt.submittedAt,
      answers: markedAnswers,
      stats: {
        correct,
        incorrect,
        unattempted,
        positiveMarks,
        negativeMarks,
        totalScore,
        maxMarks,
        percentage,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
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
