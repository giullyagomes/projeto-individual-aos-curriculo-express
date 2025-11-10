import { experienceService } from "../service/experienceService.js";

export const experienceController = {
    getAllExperiences: async (req, res) => {
        try {
            const result = await experienceService.getAllExperiences();
            return res.status(200).json(result);
        } catch (error) {
            throw new Error("Error fetching experiences: " + error.message);
        }
    },

    getExperienceById: async (req, res) => {
        const id = req.params.id;
        try {
            const result = await experienceService.getExperienceById(id);
            return res.status(200).json(result);
        } catch (error) {
            if (error instanceof Error) {
                return res.status(404).json({ message: error.message });
            }
            return res.status(500).json({ message: error.message });
        }
    },

    createNewExperience: async (req, res) => {
        const {
            userId,
            jobTitle,
            company,
            location,
            startDate,
            endDate,
            isCurrent,
            description
        } = req.body;
        try {
            const result = await experienceService.createNewExperience(
                userId,
                jobTitle,
                company,
                location,
                startDate,
                endDate,
                isCurrent,
                description
            );
            return res.status(201).json(result);
        } catch (error) {
            if (error instanceof Error) return res.status(400).json({ message: error.message });
            return res.status(500).json({ message: error.message });
        }
    },

    updateExperienceById: async (req, res) => {
        try {
            const id = req.params.id;
            const {
                jobTitle,
                company,
                location,
                startDate,
                endDate,
                isCurrent,
                description
            } = req.body;
            const result = await experienceService.updateExperienceById(
                id,
                jobTitle,
                company,
                location,
                startDate,
                endDate,
                isCurrent,
                description
            );
            return res.status(200).json(result);
        } catch (error) {
            if (error instanceof Error) return res.status(404).json({ message: error.message });
            return res.status(500).json({ message: error.message });
        }
    },

    deleteExperienceById: async (req, res) => {
        const id = req.params.id;
        try {
            await experienceService.deleteExperienceById(id);
            return res.status(204).send();
        } catch (error) {
            if (error instanceof Error) return res.status(404).json({ message: error.message });
            return res.status(500).json({ message: error.message });
        }
    }
};