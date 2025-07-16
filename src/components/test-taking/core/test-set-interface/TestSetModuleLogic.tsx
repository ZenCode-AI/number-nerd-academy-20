
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTestSet } from '@/contexts/TestSetContext';
import { calculateModuleScore } from '../utils/testScoring';
import { userService } from '@/services/userService';
import { userPurchaseService } from '@/services/userPurchaseService';

export const useTestSetModuleLogic = () => {
  const navigate = useNavigate();
  const { currentModuleData, session, testSet, completeModule, startBreak, moduleResults } = useTestSet();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<number>>(new Set());
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const getUser = async () => {
      const user = await userService.getCurrentUser();
      setCurrentUser(user);
    };
    getUser();
  }, []);

  // Check if user has access to this test
  useEffect(() => {
    const checkAccess = async () => {
      if (currentUser && testSet && !(await userPurchaseService.hasTestAccess(currentUser.id, testSet.id, testSet.plan || 'Free'))) {
        navigate('/student');
        return;
      }
    };
    checkAccess();
  }, [currentUser, testSet, navigate]);

  const navigateToQuestion = (index: number) => {
    setCurrentQuestion(index);
  };

  const handleNext = () => {
    if (currentQuestion < (currentModuleData?.questions.length || 0) - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleFlag = () => {
    const newFlagged = new Set(flaggedQuestions);
    if (newFlagged.has(currentQuestion)) {
      newFlagged.delete(currentQuestion);
    } else {
      newFlagged.add(currentQuestion);
    }
    setFlaggedQuestions(newFlagged);
  };

  // Fix: Module indexing - currentModule is 1-based, but we need to compare with length
  const isLastModule = (session?.currentModule || 1) >= (testSet?.modules.length || 1);
  const isLastQuestion = currentQuestion === (currentModuleData?.questions.length || 0) - 1;

  const handleSubmitClick = () => {
    if (isLastModule && isLastQuestion) {
      setShowSubmitModal(true);
    } else if (isLastQuestion) {
      setShowSubmitModal(true);
    }
  };

  const handleComplete = (answers: any[], timeRemaining: number) => {
    setShowSubmitModal(false);
    
    const moduleStats = calculateModuleScore(currentModuleData?.questions || [], answers);
    const currentModuleConfig = testSet?.modules.find(m => m.moduleNumber === session?.currentModule);
    const timeSpent = (currentModuleConfig?.duration || currentModuleData?.duration || 0) * 60 - timeRemaining;
    
    const moduleResult = {
      moduleNumber: session?.currentModule || 1,
      moduleId: currentModuleData?.id || '',
      testId: currentModuleData?.id || '',
      score: moduleStats.score,
      maxScore: moduleStats.maxScore,
      percentage: moduleStats.maxScore > 0 ? Math.round((moduleStats.score / moduleStats.maxScore) * 100) : 0,
      timeSpent,
      questionsCorrect: moduleStats.questionsCorrect,
      questionsIncorrect: moduleStats.questionsIncorrect,
      questionsSkipped: moduleStats.questionsSkipped,
      completedAt: new Date(),
      difficulty: currentModuleConfig?.difficulty as 'Easy' | 'Medium' | 'Hard' || 'Medium',
      questions: currentModuleData?.questions || [],
      userAnswers: answers,
      flaggedQuestions: Array.from(flaggedQuestions),
    };

    console.log('🎯 Module completion result:', {
      moduleNumber: moduleResult.moduleNumber,
      score: moduleResult.score,
      maxScore: moduleResult.maxScore,
      percentage: moduleResult.percentage,
      timeSpent: moduleResult.timeSpent,
      questionsTotal: moduleResult.questions.length,
      difficulty: moduleResult.difficulty
    });

    completeModule(moduleResult);

    // Store comprehensive review data for all modules
    const existingReviewData = JSON.parse(localStorage.getItem('testSetReviewData') || '{}');
    const allModules = [...(existingReviewData.modules || []), {
      moduleNumber: session?.currentModule || 1,
      moduleName: currentModuleConfig?.name || `Module ${session?.currentModule}`,
      questions: currentModuleData?.questions || [],
      userAnswers: answers,
      flaggedQuestions: Array.from(flaggedQuestions),
      score: moduleStats.score,
      maxScore: moduleStats.maxScore,
      percentage: moduleResult.percentage,
      timeSpent,
      difficulty: currentModuleConfig?.difficulty || 'Medium'
    }];

    if (isLastModule) {
      const totalScore = allModules.reduce((sum, m) => sum + m.score, 0);
      const totalMaxScore = allModules.reduce((sum, m) => sum + m.maxScore, 0);
      const totalTimeSpent = allModules.reduce((sum, m) => sum + m.timeSpent, 0);

      const comprehensiveReviewData = {
        testName: testSet?.name || 'Practice Test',
        modules: allModules,
        totalScore,
        totalMaxScore,
        totalPercentage: totalMaxScore > 0 ? Math.round((totalScore / totalMaxScore) * 100) : 0,
        totalTimeSpent,
        skippedModules: session?.skippedModules || []
      };

      localStorage.setItem('testSetReviewData', JSON.stringify(comprehensiveReviewData));
    } else {
      localStorage.setItem('testSetReviewData', JSON.stringify({
        ...existingReviewData,
        testName: testSet?.name || 'Practice Test',
        modules: allModules,
        skippedModules: session?.skippedModules || []
      }));

      // Fix: Use 5 minutes (300 seconds) instead of 5 seconds
      const breakDuration = testSet?.breakDuration || 300; // Default 5 minutes
      startBreak(breakDuration);
    }
  };

  return {
    currentQuestion,
    flaggedQuestions,
    showSubmitModal,
    isLastModule,
    isLastQuestion,
    navigateToQuestion,
    handleNext,
    handlePrevious,
    handleFlag,
    handleSubmitClick,
    handleComplete,
    setShowSubmitModal
  };
};
