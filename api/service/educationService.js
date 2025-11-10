import { db } from "../database/connection.js";
import { educations, users } from "../database/schema.js";
import { desc, eq } from "drizzle-orm";


export const educationService = {
  getAllEducations: async () => {
    try {
      const list = await db.query.educations.findMany({
        with: {
          user: true,
        },
        orderBy: [desc(educations.createdAt)],
      });
      return list;
    } catch (error) {
      throw new Error(`Erro: ${error.message}`);
    }
  },

  getEducationById: async (id) => {
    try {
      const edu = await db.query.educations.findFirst({
        where: eq(educations.id, id),
        with: {
          user: true,
        },
      });

      if (!edu) {
        throw new Error (`Education with id ${id} not found.`);
      }

      return edu;
    } catch (error) {
      if (error instanceof Error ) throw error;
      throw new Error(`Could not fetch education with id ${id}: ${error.message}`);
    }
  },

  createNewEducation: async (
    userId,
    degree,
    institution,
    location,
    startDate,
    endDate,
    isCurrent,
    grade
  ) => {
    try {
      if (!userId || !degree || !institution || !startDate) {
        const emptyFields = [];
        if (!userId) emptyFields.push("userId");
        if (!degree) emptyFields.push("degree");
        if (!institution) emptyFields.push("institution");
        if (!startDate) emptyFields.push("startDate");
        throw new Error (
          `The following fields are required and cannot be empty: ${emptyFields.join(", ")}`
        );
      }

      const [eduCreated] = await db
        .insert(educations)
        .values({
          userId,
          degree,
          institution,
          location,
          startDate: new Date(startDate),
          endDate: endDate ? new Date(endDate) : null,
          isCurrent: isCurrent || false,
          grade,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();

      return eduCreated;
    } catch (error) {
      if (error instanceof Error ) throw error;
      throw new Error(`Could not create new education: ${error.message}`);
    }
  },

  updateEducationById: async (
    id,
    degree,
    institution,
    location,
    startDate,
    endDate,
    isCurrent,
    grade
  ) => {
    try {
      const existing = await db.select().from(educations).where(eq(educations.id, id));
      if (existing.length === 0) {
        throw new Error (`Education with id ${id} not found.`);
      }


      await db
        .update(educations)
        .set({
          degree,
          institution,
          location,
          startDate: new Date(startDate),
          endDate: endDate ? new Date(endDate) : null,
          isCurrent: isCurrent || false,
          grade,
          updatedAt: new Date(),
        })
        .where(eq(educations.id, id));

      const [updated] = await db.select().from(educations).where(eq(educations.id, id));
      return updated;
    } catch (error) {
      if (error instanceof Error ) throw error;
      throw new Error(`Could not update education with id ${id}: ${error.message}`);
    }
  },

  deleteEducationById: async (id) => {
    try {
      const existing = await db.select().from(educations).where(eq(educations.id, id));
      if (existing.length === 0) {
        throw new Error (`Education with id ${id} not found.`);
      }

      await db.delete(educations).where(eq(educations.id, id));
      return { success: true, message: `Education with id ${id} deleted successfully.` };
    } catch (error) {
      if (error instanceof Error ) throw error;
      throw new Error(`Could not delete education with id ${id}: ${error.message}`);
    }
  },
};