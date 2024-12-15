import express from "express";
import { authMiddleware } from "../middleware"; // Authentication middleware
import { PrismaClient } from "@prisma/client"; // Prisma Client to interact with the database
import { z } from "zod"; // Zod for request validation

const router = express.Router();
const prisma = new PrismaClient();

// Validation schemas
const submissionSchema = z.object({
    testId: z.number(), // Match the Prisma schema (Int)
    answers: z.any(),   // Replace with a specific answer format if required
    score: z.number(),
});

// Pagination utility
const parsePagination = (req: any) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    return { page, limit, skip: (page - 1) * limit };
};

// Route to get all tests for students to view (with pagination)
router.get('/all-tests', authMiddleware, async (req: any, res: any) => {
    try {
        const { page, limit, skip } = parsePagination(req);

        const tests = await prisma.test.findMany({
            take: limit,
            skip,
            select: {
                id: true,
                testName: true,
                questions: true,
                maxMarks: true,
                createdAt: true,
            },
            orderBy: { createdAt: "desc" },
        });

        const totalTests = await prisma.test.count();

        res.status(200).json({
            page,
            limit,
            totalTests,
            totalPages: Math.ceil(totalTests / limit),
            tests,
        });
    } catch (error) {
        console.error("Error fetching tests:", error);
        res.status(500).json({ message: "Failed to fetch tests. Please try again later." });
    }
});

// Route for students to submit an exam
router.post('/submit', authMiddleware, async (req: any, res: any) => {
    try {
        const userId = req.userId;

        // Validate user role
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user || user.role !== "Student") {
            return res.status(403).json({ message: "Only students can submit exams." });
        }

        // Validate request body
        const result = submissionSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({
                message: "Invalid submission data.",
                errors: result.error.errors,
            });
        }

        const { testId, answers, score } = result.data;

        // Check if test exists
        const test = await prisma.test.findUnique({
            where: { id: testId },
        });

        if (!test) {
            return res.status(404).json({ message: "Test not found." });
        }

        // Check if the student has already submitted this test
        const existingSubmission = await prisma.submission.findFirst({
            where: {
                testId,
                studentId: userId,
            },
        });

        if (existingSubmission) {
            return res.status(400).json({ message: "You have already submitted this test." });
        }

        // Create a new submission
        const submission = await prisma.submission.create({
            data: {
                testId,
                studentId: userId,
                answers,
                score,
            },
        });

        res.status(201).json({
            message: "Submission successful.",
            submission,
        });
    } catch (error) {
        console.error("Error submitting test:", error);
        res.status(500).json({ message: "Failed to submit the exam. Please try again." });
    }
});

export default router;
