import Test from "../models/Test.js";
import UserTestAttempt from "../models/UserTestAttempt.js";
import User from "../models/User.js";

export const createTest = async (req, res) => {
  try {
  
    const test = await Test.create(req.body);

    
    await Topic.findByIdAndUpdate(req.body.topic, {
      $push: { tests: test._id }
    });

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
    await test.save();

    res.json({ message: "Questions added successfully", totalQuestions: test.questions.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const uploadSolutionImage = async (req, res) => {
  try {
    res.json({ url: req.file.path });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const getTestForUser = async (req, res) => {
  try {
    const test = await Test.findById(req.params.id)
      .select("-questions.solutionImages")
      .populate("topic", "title");
    if (!test) return res.status(404).json({ message: "Test not found" });

    res.json(test);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const submitTest = async (req, res) => {
  try {
    const { userId, testId, answers } = req.body;
    const previousAttempts = await UserTestAttempt.find({ user: userId, test: testId });

    if (previousAttempts.length >= 5) {
      return res.status(400).json({ message: "Max attempts reached" });
    }

    const test = await Test.findById(testId);
    if (!test) return res.status(404).json({ message: "Test not found" });

  
    let score = 0;
    const markedAnswers = answers.map((ans) => {
      const question = test.questions.id(ans.question);
      if (!question) return ans;

      const section = test.sections.find(
        (s) => s._id.toString() === question.section.toString()
      );
      const marks = section?.marks || 1;
      const negativeMarks = section?.negativeMarks || 0;

      let marksObtained = 0;
      if (ans.answer === question.correctAnswer) marksObtained = marks;
      else if (ans.answer && ans.answer !== question.correctAnswer) marksObtained = -negativeMarks;

      score += marksObtained;
      return { ...ans, marksObtained };
    });

    const attempt = await UserTestAttempt.create({
      user: userId,
      test: testId,
      answers: markedAnswers,
      score,
      attemptNumber: previousAttempts.length + 1,
      isSubmitted: true,
    });

    await User.findByIdAndUpdate(userId, { $push: { testAttempts: attempt._id } });

    res.json({ message: "Test submitted successfully", score, attempt });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getUserTestHistory = async (req, res) => {
  try {
    const { userId, testId } = req.params;
    const history = await UserTestAttempt.find({ user: userId, test: testId })
      .sort({ submittedAt: -1 })
      .populate("test", "title sections");

    res.json(history);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
