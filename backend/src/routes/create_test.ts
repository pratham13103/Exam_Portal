import express from "express";
import { authMiddleware } from "../middleware"; // Authentication middleware
import { PrismaClient } from "@prisma/client"; // Prisma Client to interact with the database
import { z } from "zod"; // Zod for request validation

const router = express.Router();
const prisma = new PrismaClient();

// Validation schema for creating a test
const createTestSchema = z.object({
    testName: z.string().min(1, "Test name is required."),
    questions: z.any(), // Define a specific schema for questions if necessary
    maxMarks: z.number().min(1, "Max marks must be at least 1."),
});

// Route to create a test (only accessible by authenticated users with 'teacher' role)
router.post('/new-test', authMiddleware, async (req: any, res: any) => {
    try {
        // Check if the user is a teacher
        const userId = req.userId;

        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user || user.role !== "Teacher") {
            return res.status(403).json({
                message: "Only teachers can create tests.",
            });
        }

        // Validate request body
        const result = createTestSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({
                message: "Invalid test data.",
                errors: result.error.errors,
            });
        }

        const { testName, questions, maxMarks } = result.data;

        // Create a new test associated with the teacher
        const newTest = await prisma.test.create({
            data: {
                testName,
                teacherId: userId,
                questions, // Assuming the questions are passed as JSON
                maxMarks,
            },
        });

        // Send success response with the created test
        return res.status(201).json({
            message: "Test created successfully!",
            test: newTest,
        });
    } catch (error) {
        console.error("Error creating test:", error);
        return res.status(500).json({
            message: "Failed to create test. Please try again later.",
        });
    }
});

// A route to verify authentication (for testing purposes)
router.get('/', authMiddleware, (req, res) => {
    res.json({
        message: "You are a verified user!",
    });
});

export default router;
