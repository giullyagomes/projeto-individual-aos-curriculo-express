import { educationService } from "../service/educationService.js";

export const educationController = {
    getAllEducations: async (req, res) => {
        try {
            const result = await educationService.getAllEducations();
            return res.status(200).json(result);
        } catch (error) {
            throw new Error("Error fetching educations: " + error.message);
        }
    },

    getEducationById: async (req, res) => {
        const id = req.params.id;
        try {
            const result = await educationService.getEducationById(id);
            return res.status(200).json(result);
        } catch (error) {
            if (error instanceof Error) {
                return res.status(404).json({ message: error.message });
            }
            return res.status(500).json({ message: error.message });
        }
    },

    createNewEducation: async (req, res) => {
        const {
            userId,
            degree,
            institution,
            location,
            startDate,
            endDate,
            isCurrent,
            grade
        } = req.body;
        try {
            const result = await educationService.createNewEducation(
                userId,
                degree,
                institution,
                location,
                startDate,
                endDate,
                isCurrent,
                grade
            );
            return res.status(201).json(result);
        } catch (error) {
            if (error instanceof Error) return res.status(400).json({ message: error.message });
            return res.status(500).json({ message: error.message });
        }
    },

    updateEducationById: async (req, res) => {
        try {
            const id = req.params.id;
            const {
                degree,
                institution,
                location,
                startDate,
                endDate,
                isCurrent,
                grade
            } = req.body;
            const result = await educationService.updateEducationById(
                id,
                degree,
                institution,
                location,
                startDate,
                endDate,
                isCurrent,
                grade
            );
            return res.status(200).json(result);
        } catch (error) {
            if (error instanceof Error) return res.status(404).json({ message: error.message });
            return res.status(500).json({ message: error.message });
        }
    },

    deleteEducationById: async (req, res) => {
        const id = req.params.id;
        try {
            await educationService.deleteEducationById(id);
            return res.status(204).send();
        } catch (error) {
            if (error instanceof Error) return res.status(404).json({ message: error.message });
            return res.status(500).json({ message: error.message });
        }
    }
};