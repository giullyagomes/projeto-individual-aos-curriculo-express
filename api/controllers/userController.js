import { userService } from "../service/userService.js";

export const userController = {
    getAllUsers: async (req, res) => {
        try {
            const result = await userService.getAllUsers();
            return res.status(200).json(result);
        } catch (error) {
            throw new Error("Error fetching users: " + error.message);
        }
    },

    getUserById: async (req, res) => {
        const id = req.params.id;
        try {
            const result = await userService.getUserById(id);
            return res.status(200).json(result);
        } catch (error) {
            if (error instanceof Error) {
                return res.status(404).json({ message: error.message });
            }
            return res.status(500).json({ message: error.message });
        }
    },

    createNewUser: async (req, res) => {
        const { email, password, name } = req.body;
        try {
            const result = await userService.createNewUser(email, password, name);
            return res.status(201).json(result);
        } catch (error) {
            if (error instanceof Error) return res.status(400).json({ message: error.message });
            return res.status(500).json({ message: error.message });
        }
    },

    updateUserById: async (req, res) => {
        try {
            const id = req.params.id;
            const { email, password, name } = req.body;
            const result = await userService.updateUserById(id, email, password, name);
            return res.status(200).json(result);
        } catch (error) {
            if (error instanceof Error) return res.status(404).json({ message: error.message });
            return res.status(500).json({ message: error.message });
        }
    },

    deleteUserById: async (req, res) => {
        const id = req.params.id;
        try {
            await userService.deleteUserById(id);
            return res.status(204).send();
        } catch (error) {
            if (error instanceof Error) return res.status(404).json({ message: error.message });
            return res.status(500).json({ message: error.message });
        }
    }
};