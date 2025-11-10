import { db } from "../database/connection.js";
import { experiences, users } from "../database/schema.js";
import { desc, eq } from "drizzle-orm";


export const experienceService = {
  getAllExperiences: async () => {
    try {
      const list = await db.query.experiences.findMany({
        with: {
          user: true,
        },
        orderBy: [desc(experiences.createdAt)],
      });
      return list;
    } catch (error) {
      throw new Error(`Erro: ${error.message}`);
    }
  },

  getExperienceById: async (id) => {
    try {
      const exp = await db.query.experiences.findFirst({
        where: eq(experiences.id, id),
        with: {
          user: true,
        },
      });

      if (!exp) {
        throw new Error (`Experience with id ${id} not found.`);
      }

      return exp;
    } catch (error) {
      if (error instanceof Error ) throw error;
      throw new Error(`Could not fetch experience with id ${id}: ${error.message}`);
    }
  },

  createNewExperience: async (
    userId,
    jobTitle,
    company,
    location,
    startDate,
    endDate,
    isCurrent,
    description
  ) => {
    try {
      if (!userId || !jobTitle || !company || !startDate) {
        const emptyFields = [];
        if (!userId) emptyFields.push("userId");
        if (!jobTitle) emptyFields.push("jobTitle");
        if (!company) emptyFields.push("company");
        if (!startDate) emptyFields.push("startDate");
        throw new Error (
          `The following fields are required and cannot be empty: ${emptyFields.join(", ")}`
        );
      }

      const [expCreated] = await db
        .insert(experiences)
        .values({
          userId,
          jobTitle,
          company,
          location,
          startDate: new Date(startDate),
          endDate: endDate ? new Date(endDate) : null,
          isCurrent: isCurrent || false,
          description,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();

      return expCreated;
    } catch (error) {
      if (error instanceof Error ) throw error;
      throw new Error(`Could not create new experience: ${error.message}`);
    }
  },

  updateExperienceById: async (
    id,
    jobTitle,
    company,
    location,
    startDate,
    endDate,
    isCurrent,
    description
  ) => {
    try {
      const existing = await db.select().from(experiences).where(eq(experiences.id, id));
      if (existing.length === 0) {
        throw new Error (`Experience with id ${id} not found.`);
      }
      

      await db
        .update(experiences)
        .set({
          jobTitle,
          company,
          location,
          startDate: new Date(startDate),
          endDate: endDate ? new Date(endDate) : null,
          isCurrent: isCurrent || false,
          description,
          updatedAt: new Date(),
        })
        .where(eq(experiences.id, id));

      const [updated] = await db.select().from(experiences).where(eq(experiences.id, id));
      return updated;
    } catch (error) {
      if (error instanceof Error ) throw error;
      throw new Error(`Could not update experience with id ${id}: ${error.message}`);
    }
  },

  deleteExperienceById: async (id) => {
    try {
      const existing = await db.select().from(experiences).where(eq(experiences.id, id));
      if (existing.length === 0) {
        throw new Error (`Experience with id ${id} not found.`);
      }

      await db.delete(experiences).where(eq(experiences.id, id));
      return { success: true, message: `Experience with id ${id} deleted successfully.` };
    } catch (error) {
      if (error instanceof Error ) throw error;
      throw new Error(`Could not delete experience with id ${id}: ${error.message}`);
    }
  },
};