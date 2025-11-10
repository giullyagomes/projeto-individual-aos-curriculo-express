import { db } from "../database/connection.js";
import { users, experiences, educations } from "../database/schema.js";
import { desc, eq } from "drizzle-orm";


export const userService = {
  getAllUsers: async () => {
    try {
      const usersList = await db.query.users.findMany({
        with: {
          experiences: {
            orderBy: [desc(experiences.createdAt)],
          },
          educations: {
            orderBy: [desc(educations.createdAt)],
          },
        },
      });
      return usersList;
    } catch (error) {
      throw new Error(`Erro: ${error.message}`);
    }
  },

  getUserById: async (id) => {
    try {
      const user = await db.query.users.findFirst({
        where: eq(users.id, id),
        with: {
          experiences: {
            orderBy: [desc(experiences.createdAt)],
          },
          educations: {
            orderBy: [desc(educations.createdAt)],
          },
        },
      });

      if (!user) {
        throw new Error (`User with id ${id} not found.`);
      }

      return user;
    } catch (error) {
      if (error instanceof Error ) throw error;
      throw new Error(`Could not fetch user with id ${id}: ${error.message}`);
    }
  },

  createNewUser: async (email, password, name) => {
    try {
      if (!email || !password || !name) {
        const emptyFields = [];
        if (!email) emptyFields.push("email");
        if (!password) emptyFields.push("password");
        if (!name) emptyFields.push("name");
        throw new Error (
          `The following fields are required and cannot be empty: ${emptyFields.join(", ")}`
        );
      }

      const [userCreated] = await db
        .insert(users)
        .values({
          email,
          password,
          name,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();

      return userCreated;
    } catch (error) {
      if (error instanceof Error ) throw error;
      throw new Error(`Could not create new user: ${error.message}`);
    }
  },

  updateUserById: async (id, email, password, name) => {
    try {
      const existingUser = await db.select().from(users).where(eq(users.id, id));
      if (existingUser.length === 0) {
        throw new Error (`User with id ${id} not found.`);
      }


      await db
        .update(users)
        .set({
          email,
          password,
          name,
          updatedAt: new Date(),
        })
        .where(eq(users.id, id));

      const [updatedUser] = await db.select().from(users).where(eq(users.id, id));
      return updatedUser;
    } catch (error) {
      if (error instanceof Error ) throw error;
      throw new Error(`Could not update user with id ${id}: ${error.message}`);
    }
  },

  deleteUserById: async (id) => {
    try {
      const existingUser = await db.select().from(users).where(eq(users.id, id));
      if (existingUser.length === 0) {
        throw new Error (`User with id ${id} not found.`);
      }

      await db.delete(users).where(eq(users.id, id));
      return { success: true, message: `User with id ${id} deleted successfully.` };
    } catch (error) {
      if (error instanceof Error ) throw error;
      throw new Error(`Could not delete user with id ${id}: ${error.message}`);
    }
  },
};